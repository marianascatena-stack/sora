
const DB_KEY = "sora_users";
const SESSION_KEY = "sora_session";

// banco de dados
function getUsers() {
  return JSON.parse(localStorage.getItem(DB_KEY) || "[]");
}

function saveUsers(users) {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

function seedDemoUser() {
  const users = getUsers();
  const jaExiste = users.some(u => u.email === "demo@sora.com");
  if (!jaExiste) {
    users.push({ nome: "Convidado", email: "demo@sora.com", senha: "sora123" });
    saveUsers(users);
  }
}
seedDemoUser();

// sessão 
function iniciarSessao(usuario, lembrar) {
  const payload = JSON.stringify({ nome: usuario.nome, email: usuario.email });
  if (lembrar) {
    localStorage.setItem(SESSION_KEY, payload);
  } else {
    sessionStorage.setItem(SESSION_KEY, payload);
  }
}

// validação 
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function setErro(inputEl, erroEl, msg) {
  inputEl.classList.toggle("is-invalid", Boolean(msg));
  erroEl.textContent = msg || "";
}

function mostrarAlerta(alertEl, msg) {
  alertEl.textContent = msg;
  alertEl.hidden = false;
}

function ocultarAlerta(alertEl) {
  alertEl.hidden = true;
  alertEl.textContent = "";
}


// Entrar / Criar conta

const tabs = document.querySelectorAll(".tab");
const indicator = document.querySelector(".tabs__indicator");
const forms = {
  login: document.getElementById("form-login"),
  signup: document.getElementById("form-signup"),
};

function posicionarIndicador(tabAtiva) {
  if (!indicator || !tabAtiva) return;
  indicator.style.width = `${tabAtiva.offsetWidth}px`;
  indicator.style.transform = `translateX(${tabAtiva.offsetLeft}px)`;
}

function ativarTab(nome) {
  let tabAtiva = null;
  tabs.forEach(t => {
    const ativa = t.dataset.tab === nome;
    t.classList.toggle("is-active", ativa);
    t.setAttribute("aria-selected", String(ativa));
    if (ativa) tabAtiva = t;
  });
  Object.entries(forms).forEach(([chave, form]) => {
    form.classList.toggle("is-active", chave === nome);
  });
  posicionarIndicador(tabAtiva);
}

// se a janela for redimensionada
window.addEventListener("resize", () => {
  const tabAtiva = document.querySelector(".tab.is-active");
  posicionarIndicador(tabAtiva);
});

tabs.forEach(tab => {
  tab.addEventListener("click", () => ativarTab(tab.dataset.tab));
});

// carga da página
posicionarIndicador(document.querySelector(".tab.is-active"));


// Mostrar/ocultar senha

document.querySelectorAll(".field__toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const input = document.getElementById(btn.dataset.toggleFor);
    const oculto = input.type === "password";
    input.type = oculto ? "text" : "password";
    btn.textContent = oculto ? "ocultar" : "ver";
  });
});

// LOGIN

const formLogin = document.getElementById("form-login");
const loginAlert = document.getElementById("login-alert");

document.getElementById("btn-demo").addEventListener("click", () => {
  document.getElementById("login-email").value = "demo@sora.com";
  document.getElementById("login-senha").value = "sora123";
});

formLogin.addEventListener("submit", (evento) => {
  evento.preventDefault();
  ocultarAlerta(loginAlert);

  const emailInput = document.getElementById("login-email");
  const senhaInput = document.getElementById("login-senha");
  const emailErro = document.getElementById("login-email-error");
  const senhaErro = document.getElementById("login-senha-error");

  const email = emailInput.value.trim().toLowerCase();
  const senha = senhaInput.value;
  let valido = true;

  if (!EMAIL_RE.test(email)) {
    setErro(emailInput, emailErro, "Digite um e-mail válido.");
    valido = false;
  } else {
    setErro(emailInput, emailErro, "");
  }

  if (senha.length < 6) {
    setErro(senhaInput, senhaErro, "A senha precisa ter ao menos 6 caracteres.");
    valido = false;
  } else {
    setErro(senhaInput, senhaErro, "");
  }

  if (!valido) return;

  const usuario = getUsers().find(u => u.email === email);

  if (!usuario || usuario.senha !== senha) {
    mostrarAlerta(loginAlert, "E-mail ou senha incorretos.");
    return;
  }

  const lembrar = document.getElementById("login-remember").checked;
  iniciarSessao(usuario, lembrar);
  window.location.href = "home.html";
});

// CADASTRO

const formSignup = document.getElementById("form-signup");
const signupAlert = document.getElementById("signup-alert");

formSignup.addEventListener("submit", (evento) => {
  evento.preventDefault();
  ocultarAlerta(signupAlert);

  const nomeInput = document.getElementById("signup-nome");
  const emailInput = document.getElementById("signup-email");
  const senhaInput = document.getElementById("signup-senha");
  const confirmarInput = document.getElementById("signup-confirmar");

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const senha = senhaInput.value;
  const confirmar = confirmarInput.value;

  let valido = true;

  if (nome.length < 2) {
    setErro(nomeInput, document.getElementById("signup-nome-error"), "Digite seu nome.");
    valido = false;
  } else {
    setErro(nomeInput, document.getElementById("signup-nome-error"), "");
  }

  if (!EMAIL_RE.test(email)) {
    setErro(emailInput, document.getElementById("signup-email-error"), "Digite um e-mail válido.");
    valido = false;
  } else if (getUsers().some(u => u.email === email)) {
    setErro(emailInput, document.getElementById("signup-email-error"), "Esse e-mail já tem cadastro.");
    valido = false;
  } else {
    setErro(emailInput, document.getElementById("signup-email-error"), "");
  }

  if (senha.length < 6) {
    setErro(senhaInput, document.getElementById("signup-senha-error"), "Mínimo de 6 caracteres.");
    valido = false;
  } else {
    setErro(senhaInput, document.getElementById("signup-senha-error"), "");
  }

  if (confirmar !== senha) {
    setErro(confirmarInput, document.getElementById("signup-confirmar-error"), "As senhas não coincidem.");
    valido = false;
  } else {
    setErro(confirmarInput, document.getElementById("signup-confirmar-error"), "");
  }

  if (!valido) return;

  const users = getUsers();
  users.push({ nome, email, senha });
  saveUsers(users);

  iniciarSessao({ nome, email }, true);
  window.location.href = "home.html";
});

// pula direto pra vitrine
if (localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY)) {
  window.location.href = "home.html";
}
