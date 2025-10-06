// Your full original SmartGenEduXApp class code...
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
        // Return academic modules list (your existing)
        return [];
    }

    getPremiumModules() {
        // Return premium modules list (your existing)
        return [];
    }

    openModuleDetails(moduleId) {
        // Your existing detailed modal code
    }

    launchModule(moduleId) {
        // Your existing launch module logic
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

// Global functions
window.app = app;
window.switchRole = (role) => app.switchRole(role);
window.logout = () => app.logout();
window.closeModal = () => app.closeModal();


// ==== Arattai Integration Additions Start ====

const ARATTAI_API_BASE = '/api/arattai-alert';
let templateVariablesMap = {};

async function fetchArattaiTemplates() {
  const res = await fetch(`${ARATTAI_API_BASE}/templates`);
  if (!res.ok) throw new Error('Failed to fetch templates');
  return await res.json();
}

async function fetchArattaiContacts() {
  const res = await fetch(`${ARATTAI_API_BASE}/contacts`);
  if (!res.ok) throw new Error('Failed to fetch contacts');
  return await res.json();
}

async function fetchRecentMessages() {
  const res = await fetch(`${ARATTAI_API_BASE}/scheduled`);
  if (!res.ok) throw new Error('Failed to fetch recent messages');
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

document.addEventListener('DOMContentLoaded', async () => {
  if (window.location.pathname.includes('arattai.html')) {
    try {
      const recipientSelect = document.getElementById('recipientSelect');
      const templateSelect = document.getElementById('templateSelect');
      const variablesContainer = document.getElementById('templateVariablesContainer');
      const recentMessagesBody = document.getElementById('recentMessagesBody');

      // Populate recipients dropdown
      const contacts = await fetchArattaiContacts();
      recipientSelect.innerHTML = '<option value="">Select a recipient</option>';
      contacts.forEach(contact => {
        const option = document.createElement('option');
        option.value = contact.phoneNumber;
        option.textContent = `${contact.parentName} (${contact.studentName})`;
        recipientSelect.appendChild(option);
      });

      // Populate templates dropdown and map variables
      const templates = await fetchArattaiTemplates();
      templateSelect.innerHTML = '<option value="">Select a template</option>';
      templates.forEach(tmpl => {
        templateVariablesMap[tmpl.id] = tmpl.variables || [];
        const option = document.createElement('option');
        option.value = tmpl.id;
        option.textContent = tmpl.name;
        templateSelect.appendChild(option);
      });

      // Template select change event to render variable inputs
      templateSelect.addEventListener('change', e => {
        variablesContainer.innerHTML = '';
        const selectedId = e.target.value;
        if (!selectedId || !templateVariablesMap[selectedId]) return;

        templateVariablesMap[selectedId].forEach(variableName => {
          const label = document.createElement('label');
          label.textContent = `${variableName.charAt(0).toUpperCase() + variableName.slice(1)}:`;
          label.className = 'block text-sm font-medium mb-1';

          const input = document.createElement('input');
          input.type = 'text';
          input.id = `var_${variableName}`;
          input.className = 'w-full border rounded px-3 py-2 mb-3';

          variablesContainer.appendChild(label);
          variablesContainer.appendChild(input);
        });
      });

      // Load and display recent messages
      const recentMessages = await fetchRecentMessages();
      recentMessagesBody.innerHTML = recentMessages.map(msg => `
        <tr class="border-t">
          <td class="px-4 py-2">${new Date(msg.scheduledFor || msg.sentAt).toLocaleString()}</td>
          <td class="px-4 py-2">${msg.category || 'N/A'}</td>
          <td class="px-4 py-2">${msg.recipientNumber}</td>
          <td class="px-4 py-2">${msg.message}</td>
          <td class="px-4 py-2">
            <span class="${msg.status === 'sent' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} px-2 py-1 rounded text-xs">
              ${msg.status || 'pending'}
            </span>
          </td>
        </tr>
      `).join('');

    } catch (error) {
      console.error('Error loading Arattai data:', error);
    }
  }
});

// Send button click handler
document.getElementById('sendButton').addEventListener('click', async () => {
  const recipientNumber = document.getElementById('recipientSelect').value;
  const templateId = document.getElementById('templateSelect').value;
  const messageContent = document.getElementById('messageContent').value.trim();

  if (!recipientNumber) {
    alert('Please select a recipient');
    return;
  }
  if (!templateId) {
    alert('Please select a template');
    return;
  }
  if (!messageContent) {
    alert('Message cannot be empty');
    return;
  }

  const variables = {};
  (templateVariablesMap[templateId] || []).forEach(variableName => {
    const input = document.getElementById(`var_${variableName}`);
    if (input) variables[variableName] = input.value.trim();
  });

  const payload = {
    recipientNumber,
    templateId,
    variables,
    message: messageContent
  };

  try {
    const response = await sendArattaiMessage(payload);
    if (response.success) {
      alert('Message sent successfully');
      document.getElementById('messageContent').value = '';
      document.getElementById('charCount').textContent = 'Characters: 0/1000';
      // Optionally reload recent messages here
    } else {
      alert('Failed to send message');
    }
  } catch (error) {
    alert('Error sending message');
    console.error(error);
  }
});
