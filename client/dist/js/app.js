class SmartGenEduXApp {
  constructor() {
    this.currentUser = null;
    this.currentRole = 'school_admin';
    this.apiBase = '/api';
    this.templateVariablesMap = {};
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.checkAuthStatus();
  }

  setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) this.closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    // Arattai Send Button
    const sendButton = document.getElementById('sendButton');
    if (sendButton) {
      sendButton.addEventListener('click', () => this.handleArattaiSend());
    }
  }

  async handleLogin(event) {
    event.preventDefault();
    const loginText = document.getElementById('loginText');
    const loginLoading = document.getElementById('loginLoading');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    loginText.style.display = 'none';
    loginLoading.style.display = 'inline-block';

    try {
      await this.delay(1500); // Simulate API call delay
      const user = this.getUserByEmail(email);

      if (!user) throw new Error('Invalid credentials');

      this.currentUser = user;
      this.currentRole = user.role;
      localStorage.setItem('smartgenedux_user', JSON.stringify(user));
      localStorage.setItem('smartgenedux_role', user.role);
      this.showDashboard();
    } catch (err) {
      alert('Login failed: ' + err.message);
      loginText.style.display = 'inline';
      loginLoading.style.display = 'none';
    }
  }

  getUserByEmail(email) {
    const users = {
      'super@smartgenedux.org': {
        id: 'super_001',
        name: 'Super Administrator',
        email: 'super@smartgenedux.org',
        role: 'super_admin',
        avatar: 'SA',
        permissions: ['all'],
      },
      'admin@dps.edu': {
        id: 'admin_001',
        name: 'Dr. Rajesh Kumar',
        email: 'admin@dps.edu',
        role: 'school_admin',
        school: 'Delhi Public School',
        schoolId: 'school_001',
        avatar: 'RK',
        permissions: ['school_management', 'student_management', 'teacher_management'],
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
        permissions: ['attendance', 'student_records', 'assignments'],
      },
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
      super_admin: 'Super Administrator',
      school_admin: 'School Administrator',
      teacher: 'Teacher',
    };
    return roleNames[role] || role;
  }

  updateRoleButtons() {
    const buttons = document.querySelectorAll('.role-btn');
    buttons.forEach((btn) => {
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
      statsGrid.innerHTML = stats
        .map(
          (stat) => `
          <div class="stat-card">
            <div class="stat-icon">${stat.icon}</div>
            <div class="stat-number">${stat.value}</div>
            <div class="stat-label">${stat.label}</div>
          </div>
          `
        )
        .join('');
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  }

  async getStatsForRole(role) {
    await this.delay(500);
    const statsData = {
      super_admin: [
        { icon: '🏫', value: '247', label: 'Total Schools' },
        { icon: '👥', value: '15,432', label: 'Total Students' },
        { icon: '👨‍🏫', value: '2,186', label: 'Total Teachers' },
        { icon: '💰', value: '₹24.7L', label: 'Monthly Revenue' },
        { icon: '📊', value: '94%', label: 'System Uptime' },
        { icon: '🎯', value: '98.2%', label: 'Client Satisfaction' },
      ],
      school_admin: [
        { icon: '👥', value: '1,247', label: 'Total Students' },
        { icon: '👨‍🏫', value: '89', label: 'Teaching Staff' },
        { icon: '📚', value: '47', label: 'Active Classes' },
        { icon: '💰', value: '₹89,500', label: 'Fee Collection' },
        { icon: '📅', value: '95%', label: 'Attendance Rate' },
        { icon: '🏆', value: '87%', label: 'Academic Performance' },
      ],
      teacher: [
        { icon: '👥', value: '156', label: 'My Students' },
        { icon: '📚', value: '6', label: 'Classes Assigned' },
        { icon: '📝', value: '23', label: 'Pending Assessments' },
        { icon: '📅', value: '98%', label: 'Class Attendance' },
        { icon: '🎯', value: '92%', label: 'Assignment Completion' },
        { icon: '⭐', value: '4.8/5', label: 'Student Rating' },
      ],
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
    return modules
      .map(
        (module) => `
      <div class="module-card ${module.isPremium ? 'premium' : ''}" onclick="app.openModuleDetails('${module.id}')">
        ${module.isPremium ? '<div class="premium-badge">PREMIUM</div>' : ''}
        <img src="./assets/${module.icon}" alt="${module.name}" class="module-icon" onerror="this.style.display='none'">
        <div class="module-title">${module.name}</div>
        <div class="module-description">${module.description}</div>
        <ul class="module-features">
          ${module.features.slice(0, 3).map((feature) => `<li>${feature}</li>`).join('')}
        </ul>
        <div class="module-status">
          <span class="status-badge">${module.status}</span>
          <button class="module-btn" onclick="event.stopPropagation(); app.launchModule('${module.id}')">Launch</button>
        </div>
      </div>
      `
      )
      .join('');
  }

  getAcademicModules() {
    return [
      // Example academic modules — replace with your real data
      {
        id: 'attendance',
        icon: 'attendance.png',
        name: 'Attendance Management',
        description: 'Track daily attendance of students and staff.',
        features: ['Daily attendance', 'Reports', 'Alerts'],
        status: 'Active',
        isPremium: false,
      },
      {
        id: 'academic-performance',
        icon: 'performance.png',
        name: 'Academic Performance',
        description: 'Manage student assessments and grading.',
        features: ['Grades', 'Assessments', 'Reports'],
        status: 'Active',
        isPremium: false,
      },
    ];
  }

  getPremiumModules() {
    return [
      // Example premium modules — replace with your real data
      {
        id: 'sms-integration',
        icon: 'sms.png',
        name: 'SMS/WhatsApp Integration',
        description: 'Send automated alerts through SMS and WhatsApp.',
        features: ['Automatic alerts', 'Bulk messaging', 'Templates'],
        status: 'Premium',
        isPremium: true,
      },
      {
        id: 'fee-management',
        icon: 'fees.png',
        name: 'Fee Management',
        description: 'Automate fee collection and reminders.',
        features: ['Fee tracking', 'Payment reminders', 'Reports'],
        status: 'Premium',
        isPremium: true,
      },
    ];
  }

  openModuleDetails(moduleId) {
    // Show modal with module details
    // You can implement this modal logic as needed
    alert(`Open details for module: ${moduleId}`);
  }

  launchModule(moduleId) {
    // Implement your module launch logic here, e.g. navigate to module page
    alert(`Launching module: ${moduleId}`);
  }

  closeModal() {
    const modal = document.getElementById('moduleModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  logout() {
    localStorage.removeItem('smartgenedux_user');
    localStorage.removeItem('smartgenedux_role');

    this.currentUser = null;
    this.currentRole = 'school_admin';

    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('loginScreen').style.display = 'flex';

    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // === Arattai Integration === //

  async fetchArattaiTemplates() {
    const res = await fetch(`${this.apiBase}/arattai-alert/templates`);
    if (!res.ok) throw new Error('Failed to fetch templates');
    return await res.json();
  }

  async fetchArattaiContacts() {
    const res = await fetch(`${this.apiBase}/arattai-alert/contacts`);
    if (!res.ok) throw new Error('Failed to fetch contacts');
    return await res.json();
  }

  async fetchRecentArattaiMessages() {
    const res = await fetch(`${this.apiBase}/arattai-alert/scheduled`);
    if (!res.ok) throw new Error('Failed to fetch recent messages');
    return await res.json();
  }

  async sendArattaiMessage(payload) {
    const res = await fetch(`${this.apiBase}/arattai-alert/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return await res.json();
  }

  async setupArattaiPage() {
    if (!window.location.pathname.includes('arattai.html')) return;

    try {
      const recipientSelect = document.getElementById('recipientSelect');
      const templateSelect = document.getElementById('templateSelect');
      const variablesContainer = document.getElementById('templateVariablesContainer');
      const recentMessagesBody = document.getElementById('recentMessagesBody');

      const contacts = await this.fetchArattaiContacts();
      recipientSelect.innerHTML =
        '<option value="">Select a recipient</option>' +
        contacts.map(
          (c) =>
            `<option value="${c.phoneNumber}">${c.parentName} (${c.studentName})</option>`
        ).join('');

      const templates = await this.fetchArattaiTemplates();
      this.templateVariablesMap = {};
      templateSelect.innerHTML =
        '<option value="">Select a template</option>' +
        templates.map((t) => {
          this.templateVariablesMap[t.id] = t.variables || [];
          return `<option value="${t.id}">${t.name}</option>`;
        }).join('');

      templateSelect.addEventListener('change', (e) => {
        variablesContainer.innerHTML = '';
        const selectedId = e.target.value;
        if (!selectedId || !this.templateVariablesMap[selectedId]) return;
        this.templateVariablesMap[selectedId].forEach((variableName) => {
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

      const recentMessages = await this.fetchRecentArattaiMessages();
      recentMessagesBody.innerHTML = recentMessages.map((msg) => `
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

  async handleArattaiSend() {
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
    (this.templateVariablesMap[templateId] || []).forEach((variableName) => {
      const input = document.getElementById(`var_${variableName}`);
      if (input) variables[variableName] = input.value.trim();
    });

    try {
      const response = await this.sendArattaiMessage({
        recipientNumber,
        templateId,
        variables,
        message: messageContent,
      });
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
  }
}

// Initialize app and setup Arattai page on DOMContentLoaded
const app = new SmartGenEduXApp();
window.app = app;
window.switchRole = (role) => app.switchRole(role);
window.logout = () => app.logout();
window.closeModal = () => app.closeModal();

document.addEventListener('DOMContentLoaded', () => {
  app.setupArattaiPage();
});
