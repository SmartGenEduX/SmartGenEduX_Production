// login.js - comprehensive auth module
const express = require("express");
const router = express.Router();
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
// Configure your DB connection (adjust your connection string)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
// Middleware: authenticate JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Authorization header missing" });
  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token missing" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
}
// POST /auth/login - user login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password").isLength({ min: 6 }).withMessage("Password of min 6 chars required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password } = req.body;
    try {
      const result = await pool.query(
        `SELECT u.id, u.email, u.password_hash, u.full_name, r.name as role, t.name as tenant
        FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN tenants t ON u.tenant_id = t.id
        WHERE u.email = $1 AND u.active = true`,
        [email]
      );
      if (result.rowCount === 0) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const user = result.rows[0];
      const validPass = await bcrypt.compare(password, user.password_hash);
      if (!validPass) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      // Prepare JWT payload
      const payload = {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        tenant: user.tenant,
      };
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
      return res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenant: user.tenant,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
// POST /auth/register - Create new user (by admin)
router.post(
  "/register",
  authenticateToken,
  [
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("fullName").notEmpty(),
    body("role").notEmpty(),
    body("tenant").optional(), // If omitted, assign to current tenant from token
  ],
  async (req, res) => {
    if (!["super_admin", "tenant_admin"].includes(req.user.role)) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password, fullName, role, tenant } = req.body;
    try {
      // Get role ID
      const roleRes = await pool.query(`SELECT id FROM roles WHERE name = $1`, [role]);
      if (roleRes.rowCount === 0) return res.status(400).json({ error: "Invalid role" });
      // Determine tenant ID
      let tenantName = tenant;
      if (!tenantName && req.user.tenant) tenantName = req.user.tenant;
      const tenantRes = await pool.query(`SELECT id FROM tenants WHERE name = $1`, [tenantName]);
      if (tenantRes.rowCount === 0) return res.status(400).json({ error: "Invalid tenant" });
      // Hash password
      const hashedPass = await bcrypt.hash(password, 12);
      // Insert user
      await pool.query(
        `INSERT INTO users (email, password_hash, full_name, role_id, tenant_id, active)
        VALUES ($1, $2, $3, $4, $5, true)`,
        [email, hashedPass, fullName, roleRes.rows[0].id, tenantRes.rows[0].id]
      );
      return res.json({ message: "User created successfully" });
    } catch (err) {
      console.error("User registration error:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);
// GET /auth/me - Get current user info
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const userRes = await pool.query(
      `SELECT u.id, u.email, u.full_name, r.name as role, t.name as tenant
       FROM users u
       JOIN roles r ON u.role_id = r.id
       JOIN tenants t ON u.tenant_id = t.id
       WHERE u.id = $1`,
      [req.user.id]
    );
    if (userRes.rowCount === 0) return res.status(404).json({ error: "User not found" });
    const user = userRes.rows[0];
    return res.json({
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      role: user.role,
      tenant: user.tenant,
    });
  } catch (err) {
    console.error("Fetch user info error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});
module.exports = router;
