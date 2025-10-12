// adminUsers.js - user management & bulk upload module

const express = require("express");
const router = express.Router();
const multer = require("multer");
const csvParser = require("csv-parser");
const fs = require("fs");
const bcrypt = require("bcrypt");
const { Pool } = require("pg");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

// Multer config for file uploads
const upload = multer({ dest: "uploads/" });

// Middleware for JWT authentication
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return res.status(401).json({ error: "No token provided" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Role check middleware for admin permissions
function requireAdmin(req, res, next) {
  if (!["super_admin", "tenant_admin"].includes(req.user.role)) {
    return res.status(403).json({ error: "Admin privileges required" });
  }
  next();
}

// Create single user API to create admins, teachers, staff, etc.
router.post(
  "/users",
  authenticateToken,
  requireAdmin,
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  body("fullName").notEmpty(),
  body("role").notEmpty(),
  body("tenant").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password, fullName, role, tenant } = req.body;

    try {
      // Validate role
      const roleRes = await pool.query("SELECT id FROM roles WHERE name = $1", [role]);
      if (!roleRes.rows.length) return res.status(400).json({ error: "Invalid role" });

      // Validate tenant
      const tenantRes = await pool.query("SELECT id FROM tenants WHERE name = $1", [tenant]);
      if (!tenantRes.rows.length) return res.status(400).json({ error: "Invalid tenant" });

      // Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // Insert user
      await pool.query(
        `INSERT INTO users (email, password_hash, full_name, role_id, tenant_id, active)
        VALUES ($1, $2, $3, $4, $5, TRUE)`,
        [email, passwordHash, fullName, roleRes.rows[0].id, tenantRes.rows[0].id]
      );

      res.json({ message: "User created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Bulk upload CSV for students or teachers
router.post(
  "/upload",
  authenticateToken,
  requireAdmin,
  upload.single("file"),
  body("userType").isIn(["student", "teacher"]),
  async (req, res) => {
    const userType = req.body.userType;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "CSV file required" });
    }

    const users = [];

    // Parse CSV file
    fs.createReadStream(file.path)
      .pipe(csvParser())
      .on("data", (row) => {
        const { email, fullName, role, password, tenant } = row;
        users.push({ email, fullName, role, password, tenant });
      })
      .on("end", async () => {
        // Remove uploaded file
        fs.unlinkSync(file.path);

        try {
          for (const user of users) {
            // Validate each user
            if (!user.email || !user.fullName || !user.role || !user.password || !user.tenant) {
              continue; // skip incomplete entries
            }

            // Get role id
            const roleRes = await pool.query("SELECT id FROM roles WHERE name = $1", [user.role]);
            const tenantRes = await pool.query("SELECT id FROM tenants WHERE name = $1", [user.tenant]);

            if (!roleRes.rows.length || !tenantRes.rows.length) continue; // skip invalid role/tenant

            const passwordHash = await bcrypt.hash(user.password, 12);

            await pool.query(
              `INSERT INTO users (email, password_hash, full_name, role_id, tenant_id, active) 
              VALUES ($1, $2, $3, $4, $5, TRUE)
              ON CONFLICT (email) DO NOTHING`,
              [user.email, passwordHash, user.fullName, roleRes.rows[0].id, tenantRes.rows[0].id]
            );
          }
          res.json({ message: `${users.length} users processed successfully` });
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: "Failed to process user upload" });
        }
      });
  }
);

module.exports = router;
