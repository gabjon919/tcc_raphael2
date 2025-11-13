// Sistema de Autenticação e Gerenciamento de Usuário
const Auth = {
  isLoggedIn() {
    return localStorage.getItem('magnie_user') !== null;
  },
  
  getUser() {
    const userData = localStorage.getItem('magnie_user');
    return userData ? JSON.parse(userData) : null;
  },
  
  login(username, password) {
    const user = {
      username: username,
      email: username + '@magnie.com',
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('magnie_user', JSON.stringify(user));
    return true;
  },
  
  register(username, email, password) {
    const user = {
      username: username,
      email: email,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem('magnie_user', JSON.stringify(user));
    return true;
  },
  
  logout() {
    localStorage.removeItem('magnie_user');
    window.location.href = 'index.html'; // <-- ajustado
  }
};

// Toast Notifications
const Toast = {
  container: null,
  
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },
  
  show(title, message, type = 'success') {
    this.init();
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    `;
    this.container.appendChild(toast);
    
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  },
  
  success(title, message) { this.show(title, message, 'success'); },
  error(title, message) { this.show(title, message, 'error'); }
};

// Atualizar Header
function updateHeader() {
  const user = Auth.getUser();
  const userArea = document.getElementById('user-area');
  const navEnigmas = document.getElementById('nav-enigmas');
  if (!userArea) return;
  
  if (user) {
    userArea.innerHTML = `
      <div class="user-info">
        <span>Bem-vindo, <span class="user-name">${user.username}</span>!</span>
        <button onclick="Auth.logout()" class="btn btn-outline">Sair</button>
      </div>
    `;
    if (navEnigmas) navEnigmas.classList.remove('hidden');
  } else {
    userArea.innerHTML = `
      <a href="login.html" class="btn btn-outline">Login</a>
      <a href="cadastro.html" class="btn btn-primary">Cadastro</a>
    `;
    if (navEnigmas) navEnigmas.classList.add('hidden');
  }
}

document.addEventListener('DOMContentLoaded', updateHeader);

// Formulários
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (!username || !password) {
    Toast.error('Erro no Login', 'Por favor, preencha todos os campos.');
    return;
  }
  
  Auth.login(username, password);
  Toast.success('Login Realizado!', 'Bem-vindo de volta ao MAGNIE!');
  setTimeout(() => { window.location.href = 'enigmas.html'; }, 1500); // <-- ajustado
}

function handleRegister(event) {
  event.preventDefault();
  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  if (!username || !email || !password || !confirmPassword) {
    Toast.error('Erro no Cadastro', 'Por favor, preencha todos os campos.');
    return;
  }
  
  if (password !== confirmPassword) {
    Toast.error('Erro no Cadastro', 'As senhas não coincidem.');
    return;
  }
  
  Auth.register(username, email, password);
  Toast.success('Cadastro Realizado!', 'Bem-vindo ao MAGNIE!');
  setTimeout(() => { window.location.href = 'enigmas.html'; }, 1500); // <-- ajustado
}

// Proteger páginas
function requireAuth() {
  if (!Auth.isLoggedIn()) {
    Toast.error('Acesso Negado', 'Você precisa fazer login para acessar esta página.');
    setTimeout(() => { window.location.href = 'login.html'; }, 2000); // <-- ajustado
  }
}
