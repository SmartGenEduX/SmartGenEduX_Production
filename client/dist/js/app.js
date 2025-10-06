// SmartGenEduX - Main Application JavaScript
class SmartGenEduXApp {
    constructor() {
        this.currentUser = null;
        this.currentRole = 'school_admin';
        this.apiBase = '/api';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Handle modal clicks
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Handle escape key for modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const loginText = document.getElementById('loginText');
        const loginLoading = document.getElementById('loginLoading');
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Show loading
        loginText.style.display = 'none';
        loginLoading.style.display = 'inline-block';

        try {
            // Simulate API call
            await this.delay(1500);
            
            // Determine user role and info based on email
            let user = this.getUserByEmail(email);
            
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Store user session
            this.currentUser = user;
            this.currentRole = user.role;
            localStorage.setItem('smartgenedux_user', JSON.stringify(user));
            localStorage.setItem('smartgenedux_role', user.role);

            // Show dashboard
            this.showDashboard();
            
        } catch (error) {
            alert('Login failed: ' + error.message);
            loginText.style.display = 'inline';
            loginLoading.style.display = 'none';
        }
    }

    getUserByEmail(email) {
        const users = {
            'super@smartgenedux.org': {
                id: 'super_001',
                name: 'Super Administrator',
                email: 'super@smartgenedx.org',
                role: 'super_admin',
                avatar: 'SA',
                permissions: ['all']
            },
            'admin@dps.edu': {
                id: 'admin_001',
                name: 'Dr. Rajesh Kumar',
                email: 'admin@dps.edu',
                role: 'school_admin',
                school: 'Delhi Public School',
                schoolId: 'school_001',
                avatar: 'RK',
                permissions: ['school_management', 'student_management', 'teacher_management']
            },
            'priya@dps.edu': {
                id: 'teacher_001',
                name: 'Ms. Priya Sharma',
                email: 'priya@dps.edu',
                role: 'teacher',
                school: 'Delhi Public School',
                schoolId: 'school_001',
                subjects: ['Mathematics', 'Science'],
                classes: ['Class 1-A', 'Class 2-A'],
                avatar: 'PS',
                permissions: ['attendance', 'student_records', 'assignments']
            }
        };

        return users[email.toLowerCase()] || null;
    }

    checkAuthStatus() {
        const savedUser = localStorage.getItem('smartgenedux_user');
        const savedRole = localStorage.getItem('smartgenedux_role');
        
        if (savedUser && savedRole) {
            this.currentUser = JSON.parse(savedUser);
            this.currentRole = savedRole;
            this.showDashboard();
        }
    }

    showDashboard() {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('dashboard').classList.add('active');
        
        this.updateUserInfo();
        this.loadDashboardStats();
        this.loadModules();
        this.updateRoleButtons();
    }

    updateUserInfo() {
        if (this.currentUser) {
            document.getElementById('userName').textContent = this.currentUser.name;
            document.getElementById('userRole').textContent = this.getRoleDisplayName(this.currentRole);
            document.getElementById('userAvatar').textContent = this.currentUser.avatar;
        }
    }

    getRoleDisplayName(role) {
        const roleNames = {
            'super_admin': 'Super Administrator',
            'school_admin': 'School Administrator', 
            'teacher': 'Teacher'
        };
        return roleNames[role] || role;
    }

    updateRoleButtons() {
        const buttons = document.querySelectorAll('.role-btn');
        buttons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent.toLowerCase().replace(' ', '_') === this.currentRole) {
                btn.classList.add('active');
            }
        });
    }

    switchRole(role) {
        this.currentRole = role;
        localStorage.setItem('smartgenedux_role', role);
        this.updateUserInfo();
        this.loadDashboardStats();
        this.updateRoleButtons();
    }

    async loadDashboardStats() {
        const statsGrid = document.getElementById('statsGrid');
        
        try {
            const stats = await this.getStatsForRole(this.currentRole);
            
            statsGrid.innerHTML = stats.map(stat => `
                <div class="stat-card">
                    <div class="stat-icon">${stat.icon}</div>
                    <div class="stat-number">${stat.value}</div>
                    <div class="stat-label">${stat.label}</div>
                </div>
            `).join('');
            
        } catch (error) {
            console.error('Failed to load stats:', error);
        }
    }

    async getStatsForRole(role) {
        // Simulate API delay
        await this.delay(500);
        
        const statsData = {
            super_admin: [
                { icon: '🏫', value: '247', label: 'Total Schools' },
                { icon: '👥', value: '15,432', label: 'Total Students' },
                { icon: '👨‍🏫', value: '2,186', label: 'Total Teachers' },
                { icon: '💰', value: '₹24.7L', label: 'Monthly Revenue' },
                { icon: '📊', value: '94%', label: 'System Uptime' },
                { icon: '🎯', value: '98.2%', label: 'Client Satisfaction' }
            ],
            school_admin: [
                { icon: '👥', value: '1,247', label: 'Total Students' },
                { icon: '👨‍🏫', value: '89', label: 'Teaching Staff' },
                { icon: '📚', value: '47', label: 'Active Classes' },
                { icon: '💰', value: '₹89,500', label: 'Fee Collection' },
                { icon: '📅', value: '95%', label: 'Attendance Rate' },
                { icon: '🏆', value: '87%', label: 'Academic Performance' }
            ],
            teacher: [
                { icon: '👥', value: '156', label: 'My Students' },
                { icon: '📚', value: '6', label: 'Classes Assigned' },
                { icon: '📝', value: '23', label: 'Pending Assessments' },
                { icon: '📅', value: '98%', label: 'Class Attendance' },
                { icon: '🎯', value: '92%', label: 'Assignment Completion' },
                { icon: '⭐', value: '4.8/5', label: 'Student Rating' }
            ]
        };

        return statsData[role] || [];
    }

    loadModules() {
        const academicModules = document.getElementById('academicModules');
        const premiumModules = document.getElementById('premiumModules');
        
        academicModules.innerHTML = this.generateModuleCards(this.getAcademicModules());
        premiumModules.innerHTML = this.generateModuleCards(this.getPremiumModules());
    }

    generateModuleCards(modules) {
        return modules.map(module => `
            <div class="module-card ${module.isPremium ? 'premium' : ''}" onclick="app.openModuleDetails('${module.id}')">
                ${module.isPremium ? '<div class="premium-badge">PREMIUM</div>' : ''}
                <img src="./assets/${module.icon}" alt="${module.name}" class="module-icon" onerror="this.style.display='none'">
                <div class="module-title">${module.name}</div>
                <div class="module-description">${module.description}</div>
                <ul class="module-features">
                    ${module.features.slice(0, 3).map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <div class="module-status">
                    <span class="status-badge">${module.status}</span>
                    <button class="module-btn" onclick="event.stopPropagation(); app.launchModule('${module.id}')">Launch</button>
                </div>
            </div>
        `).join('');
    }

    getAcademicModules() {
        return [
            {
                id: 'timetable',
                name: 'Timetable Management',
                description: 'Automated scheduling with conflict resolution and teacher allocation',
                icon: 'Production_Dashboard_Design_1751034772507.png',
                status: 'Active',
                features: [
                    'Automated conflict detection',
                    'Teacher workload balancing',
                    'Room allocation management',
                    'Multiple template support',
                    'Export to PDF/Excel'
                ]
            },
            {
                id: 'substitution',
                name: 'Substitution Log',
                description: 'Track teacher substitutions and manage replacement scheduling',
                icon: 'Students + Teachers Attendance_20250621_161408_0000_1751087241306.png',
                status: 'Active',
                features: [
                    'Real-time substitution alerts',
                    'Available teacher finder',
                    'Automatic notifications',
                    'Historical tracking',
                    'Performance analytics'
                ]
            },
            {
                id: 'behavior',
                name: 'Student Behaviour Tracker',
                description: 'Monitor and track student behavior with points system',
                icon: 'Students + Teachers Attendance _20250621_133616_0000_1751087241302.png',
                status: 'Active',
                features: [
                    'Points-based behavior system',
                    'Parent notification alerts',
                    'Behavior trend analysis',
                    'Disciplinary action tracking',
                    'Positive reinforcement tools'
                ]
            },
            {
                id: 'invigilation',
                name: 'Invigilation Duty Allocation',
                description: 'Automated exam supervision duty assignment and scheduling',
                icon: 'Invigilation Duty Allocation_20250621_132356_0000_1751087212459.png',
                status: 'Active',
                features: [
                    'Fair duty distribution',
                    'Exam schedule integration',
                    'Conflict-free allocation',
                    'Substitute arrangements',
                    'Digital duty roster'
                ]
            },
            {
                id: 'distribution',
                name: 'Student Distribution',
                description: 'Optimize class allocation and capacity planning',
                icon: 'Students + Teachers Attendance_20250621_161408_0000_1751087241306.png',
                status: 'Active',
                features: [
                    'Balanced class distribution',
                    'Capacity optimization',
                    'Academic performance based grouping',
                    'Transfer management',
                    'Statistical reporting'
                ]
            },
            {
                id: 'reports',
                name: 'Report Tracker',
                description: 'Generate and track academic progress reports',
                icon: 'Reporttracker_20250621_152503_0000_1751087212463.png',
                status: 'Active',
                features: [
                    'Automated report cards',
                    'Progress tracking',
                    'Parent portal access',
                    'Custom report templates',
                    'Grade analytics'
                ]
            },
            {
                id: 'qp_generator',
                name: 'Question Paper Generation',
                description: 'AI-powered question paper creation and management',
                icon: 'Question Paper Generation_20250621_152842_0000_1751087212462.png',
                status: 'Active',
                features: [
                    'AI question generation',
                    'Difficulty level balancing',
                    'Syllabus coverage tracking',
                    'Question bank management',
                    'Multiple formats support'
                ]
            },
            {
                id: 'q_extractor',
                name: 'Question Extractor',
                description: 'Extract and categorize questions from documents',
                icon: 'Question Extractor_20250621_153142_0000_1751087212462.png',
                status: 'Active',
                features: [
                    'OCR text extraction',
                    'Question categorization',
                    'Difficulty assessment',
                    'Bulk processing',
                    'Quality verification'
                ]
            },
            {
                id: 'fee_management',
                name: 'Fee Management',
                description: 'Complete fee collection and financial tracking system',
                icon: 'Fee Management_20250621_155356_0000_1751087212456.png',
                status: 'Active',
                features: [
                    'Online payment gateway',
                    'Installment tracking',
                    'Late fee calculation',
                    'Receipt generation',
                    'Financial reporting'
                ]
            },
            {
                id: 'attendance',
                name: 'Students + Teachers Attendance',
                description: 'Digital attendance system with biometric integration',
                icon: 'Students + Teachers Attendance_20250621_161408_0000_1751087241306.png',
                status: 'Active',
                features: [
                    'Biometric integration',
                    'Real-time tracking',
                    'Parent SMS alerts',
                    'Attendance analytics',
                    'Leave management'
                ]
            },
            {
                id: 'admission',
                name: 'Admission Management',
                description: 'Streamlined student admission and enrollment process',
                icon: 'Admission Management_20250621_155736_0000_1751087212454.png',
                status: 'Active',
                features: [
                    'Online application forms',
                    'Document verification',
                    'Merit list generation',
                    'Interview scheduling',
                    'Admission analytics'
                ]
            },
            {
                id: 'pdf_tools',
                name: 'PDF to Word & Compilation',
                description: 'Document conversion and compilation tools',
                icon: 'PDF - Word & Compilation_20250621_153548_0000_1751087212461.png',
                status: 'Active',
                features: [
                    'PDF to Word conversion',
                    'Batch processing',
                    'Document merging',
                    'Format preservation',
                    'Cloud storage integration'
                ]
            },
            {
                id: 'events',
                name: 'School Event Log',
                description: 'Event planning and management system',
                icon: 'Documentation_20250621_160840_0000_1751087212455.png',
                status: 'Active',
                features: [
                    'Event calendar',
                    'Resource booking',
                    'Participant management',
                    'Budget tracking',
                    'Photo gallery'
                ]
            },
            {
                id: 'whatsapp',
                name: 'Smart WhatsApp Alert',
                description: 'Automated WhatsApp notifications for parents and staff',
                icon: 'Smart WhatsApp Alert_20250621_160156_0000_1751087212464.png',
                status: 'Active',
                features: [
                    'Bulk messaging',
                    'Template management',
                    'Delivery tracking',
                    'Group management',
                    'Automated triggers'
                ]
            },
            {
                id: 'vipu_ai',
                name: 'Vipu AI',
                description: 'AI assistant for educational queries and support',
                icon: 'Vipu AI_20250622_061707_0000_1751087241309.png',
                status: 'Active',
                features: [
                    'Natural language queries',
                    'Educational content help',
                    'Student guidance',
                    'Teacher assistance',
                    'Knowledge base integration'
                ]
            }
        ];
    }

    getPremiumModules() {
        return [
            {
                id: 'timesubbehave_ai',
                name: 'Timesubbehave AI Premium',
                description: 'Advanced AI analytics for behavior prediction and intervention',
                icon: 'Timesubbehave AI_20250621_132022_0000_1751087241308.png',
                status: 'Premium',
                isPremium: true,
                features: [
                    'Predictive behavior analytics',
                    'Early intervention alerts',
                    'ML-based pattern recognition',
                    'Personalized recommendations',
                    'Advanced reporting dashboard'
                ]
            },
            {
                id: 'fee_tally',
                name: 'Fee Management with Tally',
                description: 'Enterprise accounting integration with Tally software',
                icon: 'Fee Management_20250621_155356_0000_1751087212456.png',
                status: 'Premium',
                isPremium: true,
                features: [
                    'Tally ERP integration',
                    'Automated bookkeeping',
                    'GST compliance',
                    'Financial statements',
                    'Audit trail management'
                ]
            }
        ];
    }

    openModuleDetails(moduleId) {
        const allModules = [...this.getAcademicModules(), ...this.getPremiumModules()];
        const module = allModules.find(m => m.id === moduleId);
        
        if (!module) return;

        const modalContent = document.getElementById('modalContent');
        modalContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <img src="./assets/${module.icon}" alt="${module.name}" style="width: 80px; height: 80px; border-radius: 12px; margin-bottom: 15px;" onerror="this.style.display='none'">
                <h2 style="color: #2c3e50; margin-bottom: 10px;">${module.name}</h2>
                <p style="color: #7f8c8d; font-size: 16px;">${module.description}</p>
                ${module.isPremium ? '<span style="background: linear-gradient(45deg, #f39c12, #e67e22); color: white; padding: 4px 12px; border-radius: 15px; font-size: 12px; font-weight: bold;">PREMIUM MODULE</span>' : ''}
            </div>
            
            <div class="feature-demo">
                <h3 style="color: #2c3e50; margin-bottom: 15px;">✨ Key Features</h3>
                <ul style="list-style: none; padding: 0;">
                    ${module.features.map(feature => `
                        <li style="color: #27ae60; margin-bottom: 8px; padding-left: 20px; position: relative;">
                            <span style="position: absolute; left: 0; color: #27ae60; font-weight: bold;">✓</span>
                            ${feature}
                        </li>
                    `).join('')}
                </ul>
            </div>
            
            <div class="feature-demo">
                <h3 style="color: #2c3e50; margin-bottom: 15px;">📊 Live Demo Data</h3>
                ${this.getModuleDemoData(moduleId)}
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
                <button class="module-btn" style="padding: 12px 30px; font-size: 16px;" onclick="app.launchModule('${moduleId}')">
                    Launch ${module.name}
                </button>
            </div>
        `;
        
        document.getElementById('moduleModal').style.display = 'block';
    }

    getModuleDemoData(moduleId) {
        const demoData = {
            timetable: `
                <div class="demo-data">
                    <strong>Active Schedules:</strong> 47 classes<br>
                    <strong>Today's Periods:</strong> 8 academic periods<br>
                    <strong>Conflicts Detected:</strong> 0<br>
                    <strong>Teacher Utilization:</strong> 87%<br>
                    <strong>Room Utilization:</strong> 92%
                </div>
            `,
            attendance: `
                <div class="demo-data">
                    <strong>Today's Attendance:</strong> 94.2%<br>
                    <strong>Present Students:</strong> 1,174 / 1,247<br>
                    <strong>Absent Students:</strong> 73<br>
                    <strong>Late Arrivals:</strong> 12<br>
                    <strong>Parent Notifications:</strong> 85 sent
                </div>
            `,
            fee_management: `
                <div class="demo-data">
                    <strong>Total Collection:</strong> ₹89,50,000<br>
                    <strong>Pending Amount:</strong> ₹12,30,000<br>
                    <strong>Defaulters:</strong> 47 students<br>
                    <strong>This Month:</strong> ₹6,75,000<br>
                    <strong>Payment Methods:</strong> Online 78%, Cash 22%
                </div>
            `
        };
        
        return demoData[moduleId] || `
            <div class="demo-data">
                <strong>Module Status:</strong> Fully Operational<br>
                <strong>Active Users:</strong> 156<br>
                <strong>Daily Transactions:</strong> 247<br>
                <strong>Success Rate:</strong> 99.2%<br>
                <strong>Response Time:</strong> < 200ms
            </div>
        `;
    }

    launchModule(moduleId) {
        // Close modal if open
        this.closeModal();
        
        // Show loading and simulate module launch
        const button = event.target;
        const originalText = button.textContent;
        
        button.innerHTML = '<span class="loading"></span> Loading...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
            
            // For demo, show an alert - in production this would navigate to the module
            alert(`Launching ${moduleId} module...`);
        }, 2000);
    }

    closeModal() {
        document.getElementById('moduleModal').style.display = 'none';
    }

    logout() {
        localStorage.removeItem('smartgenedux_user');
        localStorage.removeItem('smartgenedux_role');
        
        this.currentUser = null;
        this.currentRole = 'school_admin';
        
        document.getElementById('dashboard').classList.remove('active');
        document.getElementById('loginScreen').style.display = 'flex';
        
        // Reset form
        document.getElementById('loginForm').reset();
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app
const app = new SmartGenEduXApp();

// Global functions for HTML onclick events
window.app = app;
window.switchRole = (role) => app.switchRole(role);
window.logout = () => app.logout();
window.closeModal = () => app.closeModal();
// --- Arattai API functions ---
const ARATTAI_API_BASE = '/api/arattai-alert';

async function fetchArattaiTemplates() {
  const res = await fetch(`${ARATTAI_API_BASE}/templates`);
  return await res.json();
}

async function sendArattaiMessage(payload) {
  const res = await fetch(`${ARATTAI_API_BASE}/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

// --- UI Handler for arattai.html ---
document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname.includes('arattai.html')) {
    // Load templates in dropdown
    const templates = await fetchArattaiTemplates();
    const select = document.getElementById('templateSelect');
    if (select && templates.length) {
      templates.forEach(template => {
        const option = document.createElement('option');
        option.value = template.id;
        option.textContent = template.name;
        select.appendChild(option);
      });
    }

    // Send message button event
    const sendBtn = document.getElementById('sendButton');
    if (sendBtn) {
      sendBtn.addEventListener('click', async () => {
        const templateId = select.value;
        const recipientNumber = 'ENTER_PHONE_NUMBER'; // Replace with actual logic to determine
        const variables = {}; // Collect variables from the UI
        const payload = { templateId, recipientNumber, variables };

        const response = await sendArattaiMessage(payload);
        alert(response.success ? 'Message sent!' : 'Failed to send!');
      });
    }
  }
});
async function fetchArattaiContacts() {
  const res = await fetch('/api/arattai-alert/contacts');
  if (!res.ok) throw new Error('Failed to fetch contacts');
  return await res.json();
}

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname.includes('arattai.html')) {
    // Populate recipients dropdown
    try {
      const contacts = await fetchArattaiContacts();
      const recipientSelect = document.getElementById('recipientSelect');

      if (recipientSelect) {
        contacts.forEach(contact => {
          const option = document.createElement('option');
          option.value = contact.phoneNumber;
          option.textContent = `${contact.parentName} (${contact.studentName})`;
          recipientSelect.appendChild(option);
        });
      }
    } catch (err) {
      console.error('Error loading contacts', err);
    }
  }
});
