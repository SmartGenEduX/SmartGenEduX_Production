class SmartGenEduXApp {
  constructor() {
    this.currentUser = null;
    this.currentRole = null;
    this.apiBase = this.getApiBaseUrl();
    this.authToken = null;
    this.templateVariablesMap = {};
    this.init();
  }

  // Dynamic API base URL detection
  getApiBaseUrl() {
    // Check if running locally or on production
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3000/api';
    }
    // Production: Use same domain as frontend
    return `${window.location.protocol}//${window.location.host}/api`;
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

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // Modal close handlers
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

  // REAL LOGIN - Calls backend API
  async handleLogin(event) {
    event.preventDefault();
    const loginText = document.getElementById('loginText');
    const loginLoading = document.getElementById('loginLoading');
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }

    loginText.style.display = 'none';
    loginLoading.style.display = 'inline-block';

    try {
      const response = await fetch(`${this.apiBase}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store authentication data
      this.authToken = data.token;
      this.currentUser = data.user;
      this.currentRole = data.user.role;

      localStorage.setItem('smartgenedux_token', data.token);
      localStorage.setItem('smartgenedux_user', JSON.stringify(data.user));
      localStorage.setItem('smartgenedux_role', data.user.role);

      this.showDashboard();
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed: ' + err.message);
    } finally {
      loginText.style.display = 'inline';
      loginLoading.style.display = 'none';
    }
  }

  // Check if user is already logged in
  checkAuthStatus() {
    const savedToken = localStorage.getItem('smartgenedux_token');
    const savedUser = localStorage.getItem('smartgenedux_user');
    const savedRole = localStorage.getItem('smartgenedux_role');

    if (savedToken && savedUser && savedRole) {
      this.authToken = savedToken;
      this.currentUser = JSON.parse(savedUser);
      this.currentRole = savedRole;
      
      // Verify token is still valid
      this.verifyToken().then(isValid => {
        if (isValid) {
          this.showDashboard();
        } else {
          this.handleLogout();
        }
      });
    }
  }

  // Verify token validity with backend
  async verifyToken() {
    try {
      const response = await fetch(`${this.apiBase}/v1/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });
      return response.ok;
    } catch (err) {
      console.error('Token verification failed:', err);
      return false;
    }
  }

  // Logout handler
  handleLogout() {
    this.authToken = null;
    this.currentUser = null;
    this.currentRole = null;
    localStorage.removeItem('smartgenedux_token');
    localStorage.removeItem('smartgenedux_user');
    localStorage.removeItem('smartgenedux_role');
    
    document.getElementById('dashboard').classList.remove('active');
    document.getElementById('loginScreen').style.display = 'flex';
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
      document.getElementById('userName').textContent = this.currentUser.name || this.currentUser.first_name + ' ' + this.currentUser.last_name;
      document.getElementById('userRole').textContent = this.getRoleDisplayName(this.currentRole);
      
      // Generate avatar initials
      const name = this.currentUser.name || `${this.currentUser.first_name} ${this.currentUser.last_name}`;
      const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
      document.getElementById('userAvatar').textContent = initials;
    }
  }

  getRoleDisplayName(role) {
    const roleNames = {
      super_admin: 'Super Administrator',
      school_admin: 'School Administrator',
      teacher: 'Teacher',
      parent: 'Parent',
      student: 'Student'
    };
    return roleNames[role] || role;
  }

  updateRoleButtons() {
    const buttons = document.querySelectorAll('.role-btn');
    buttons.forEach((btn) => {
      btn.classList.remove('active');
      const btnRole = btn.textContent.toLowerCase().replace(' ', '_');
      if (btnRole === this.currentRole) {
        btn.classList.add('active');
      }
    });
  }

  switchRole(role) {
    // Only allow role switching if user has permissions
    if (this.currentUser && this.currentUser.permissions && this.currentUser.permissions.includes('all')) {
      this.currentRole = role;
      localStorage.setItem('smartgenedux_role', role);
      this.updateUserInfo();
      this.loadDashboardStats();
      this.updateRoleButtons();
    } else {
      alert('You do not have permission to switch roles');
    }
  }

  // Load real dashboard stats from API
  async loadDashboardStats() {
    const statsGrid = document.getElementById('statsGrid');
    statsGrid.innerHTML = '<div class="loading">Loading statistics...</div>';

    try {
      const response = await fetch(`${this.apiBase}/v1/dashboard-stats`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to load stats');
      }

      const stats = await response.json();
      this.renderStats(stats);
    } catch (error) {
      console.error('Failed to load stats:', error);
      statsGrid.innerHTML = '<div class="error">Failed to load statistics. Please refresh.</div>';
    }
  }

  renderStats(stats) {
    const statsGrid = document.getElementById('statsGrid');
    const statCards = [];

    // Render based on role
    if (this.currentRole === 'super_admin') {
      statCards.push(
        { icon: '🏫', value: stats.totalSchools || '0', label: 'Total Schools' },
        { icon: '👥', value: stats.totalStudents || '0', label: 'Total Students' },
        { icon: '👨‍🏫', value: stats.totalTeachers || '0', label: 'Total Teachers' },
        { icon: '💰', value: stats.feeCollection || '₹0', label: 'Fee Collection' }
      );
    } else if (this.currentRole === 'school_admin') {
      statCards.push(
        { icon: '👥', value: stats.totalStudents || '0', label: 'Total Students' },
        { icon: '👨‍🏫', value: stats.totalTeachers || '0', label: 'Teaching Staff' },
        { icon: '📚', value: stats.totalClasses || '0', label: 'Active Classes' },
        { icon: '💰', value: stats.feeCollection || '₹0', label: 'Fee Collection' }
      );
    } else if (this.currentRole === 'teacher') {
      statCards.push(
        { icon: '👥', value: stats.myStudents || '0', label: 'My Students' },
        { icon: '📚', value: stats.myClasses || '0', label: 'Classes Assigned' },
        { icon: '📝', value: stats.pendingAssessments || '0', label: 'Pending Assessments' },
        { icon: '📅', value: stats.attendanceRate || '0%', label: 'Class Attendance' }
      );
    }

    statsGrid.innerHTML = statCards.map(stat => `
      <div class="stat-card">
        <div class="stat-icon">${stat.icon}</div>
        <div class="stat-number">${stat.value}</div>
        <div class="stat-label">${stat.label}</div>
      </div>
    `).join('');
  }

  loadModules() {
    const academicModules = document.getElementById('academicModules');
    const premiumModules = document.getElementById('premiumModules');
    
    if (academicModules) {
      academicModules.innerHTML = this.generateModuleCards(this.getAcademicModules());
    }
    if (premiumModules) {
      premiumModules.innerHTML = this.generateModuleCards(this.getPremiumModules());
    }
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
          <span class="status-badge ${module.status.toLowerCase()}">${module.status}</span>
          <button class="module-btn" onclick="event.stopPropagation(); app.launchModule('${module.id}')">Launch</button>
        </div>
      </div>
      `
      )
      .join('');
  }

  getAcademicModules() {
    return [
      {
        id: 'attendance',
        icon: 'attendance.svg',
        name: 'Attendance Management',
        description: 'Track daily attendance of students and staff with real-time sync.',
        features: ['Daily attendance marking', 'Attendance reports', 'SMS/Email alerts'],
        status: 'Active',
        isPremium: false,
      },
      {
        id: 'timetable',
        icon: 'timetable.svg',
        name: 'Timetable Management',
        description: 'Create and manage class timetables efficiently.',
        features: ['Drag-drop interface', 'Conflict detection', 'Teacher allocation'],
        status: 'Active',
        isPremium: false,
      },
      {
        id: 'admission',
        icon: 'admission.svg',
        name: 'Admission Management',
        description: 'Streamline student admission and enrollment process.',
        features: ['Online applications', 'Document verification', 'Fee processing'],
        status: 'Active',
        isPremium: false,
      },
      {
        id: 'fee-management',
        icon: 'fee.svg',
        name: 'Fee Management',
        description: 'Complete fee collection and tracking system.',
        features: ['Fee structure setup', 'Payment tracking', 'Receipt generation'],
        status: 'Active',
        isPremium: false,
      },
      {
        id: 'reports',
        icon: 'reports.svg',
        name: 'Report Tracker',
        description: 'Generate and track academic reports and report cards.',
        features: ['Custom report templates', 'Bulk generation', 'Parent access'],
        status: 'Active',
        isPremium: false,
      },
      {
        id: 'substitution',
        icon: 'substitution.svg',
        name: 'Substitution Log',
        description: 'Manage teacher substitutions and leave tracking.',
        features: ['Auto-substitute allocation', 'Leave requests', 'Coverage tracking'],
        status: 'Active',
        isPremium: false,
      }
    ];
  }

  getPremiumModules() {
    return [
      {
        id: 'vipu-ai',
        icon: 'ai.svg',
        name: 'VIPU AI Assistant',
        description: 'AI-powered educational assistant for smart insights.',
        features: ['Student performance prediction', 'Smart recommendations', 'Automated insights'],
        status: 'Premium',
        isPremium: true,
      },
      {
        id: 'arattai',
        icon: 'whatsapp.svg',
        name: 'Arattai WhatsApp Manager',
        description: 'WhatsApp communication automation for parents and staff.',
        features: ['Broadcast messages', 'Automated alerts', 'Template management'],
        status: 'Premium',
        isPremium: true,
      },
      {
        id: 'qpg',
        icon: 'question-paper.svg',
        name: 'Question Paper Generator',
        description: 'AI-powered question paper generation from question bank.',
        features: ['Auto-generate papers', 'Difficulty balancing', 'Blueprint compliance'],
        status: 'Premium',
        isPremium: true,
      },
      {
        id: 'id-card',
        icon: 'id-card.svg',
        name: 'ID Card Generator',
        description: 'Generate professional student and staff ID cards.',
        features: ['Custom templates', 'Bulk generation', 'QR code integration'],
        status: 'Premium',
        isPremium: true,
      },
      {
        id: 'library',
        icon: 'library.svg',
        name: 'Library Manager',
        description: 'Complete library management with issue/return tracking.',
        features: ['Book catalog', 'Issue tracking', 'Fine calculation'],
        status: 'Premium',
        isPremium: true,
      },
      {
        id: 'transport',
        icon: 'transport.svg',
        name: 'Transport Manager',
        description: 'School transport and route management system.',
        features: ['Route planning', 'GPS tracking', 'Student allocation'],
        status: 'Premium',
        isPremium: true,
      }
    ];
  }

  async launchModule(moduleId) {
    try {
      // Check if module exists and user has access
      const response = await fetch(`${this.apiBase}/v1/${moduleId}/check-access`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      });

      if (response.ok) {
        window.location.href = `/${moduleId}.html`;
      } else {
        alert('You do not have access to this module or it is not available.');
      }
    } catch (err) {
      console.error('Module launch error:', err);
      // Fallback: try to navigate anyway
      window.location.href = `/${moduleId}.html`;
    }
  }

  openModuleDetails(moduleId) {
    // Show module details modal
    console.log('Opening details for module:', moduleId);
    // You can implement a modal here to show more details
  }

  closeModal() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.style.display = 'none';
    });
  }

  // Arattai WhatsApp functionality
  async handleArattaiSend() {
    const messageInput = document.getElementById('arattaiMessage');
    const recipientSelect = document.getElementById('arattaiRecipient');
    
    if (!messageInput || !recipientSelect) return;

    const message = messageInput.value.trim();
    const recipient = recipientSelect.value;

    if (!message) {
      alert('Please enter a message');
      return;
    }

    try {
      const response = await fetch(`${this.apiBase}/v1/arattai/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          recipient,
          type: 'manual'
        })
      });

      if (response.ok) {
        alert('Message sent successfully!');
        messageInput.value = '';
      } else {
        throw new Error('Failed to send message');
      }
    } catch (err) {
      console.error('Arattai send error:', err);
      alert('Failed to send message: ' + err.message);
    }
  }

  // Utility function for delays (if needed)
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Initialize the app when DOM is ready
let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new SmartGenEduXApp();
  window.app = app; // Make it globally accessible
});
