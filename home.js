// =========================================================
// SORA — página inicial (vitrine + sacola + contato)
// =========================================================

const SESSION_KEY = "sora_session";
const CART_KEY = "sora_cart";

// ---- sessão (a home pode ser vista sem login; o ícone de conta leva ao login)
const sessaoBruta = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
const sessao = sessaoBruta ? JSON.parse(sessaoBruta) : null;
document.getElementById("user-name").textContent = sessao ? sessao.nome : "Visitante";

// ---- popover de conta -----------------------------------------
const accountBtn = document.getElementById("account-btn");
const accountPopover = document.getElementById("account-popover");

accountBtn.addEventListener("click", (evento) => {
  evento.stopPropagation();
  accountPopover.classList.toggle("is-open");
});
document.addEventListener("click", (evento) => {
  if (!accountPopover.contains(evento.target) && evento.target !== accountBtn) {
    accountPopover.classList.remove("is-open");
  }
});

// ---- logout -------------------------------------------------
document.getElementById("btn-logout").addEventListener("click", () => {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
});

// ---- toast ----------------------------------------------------
function mostrarToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("is-visible");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
}

// ---- catálogo de demonstração (fotos: banco livre Pexels) ----
const PRODUTOS = [
  { id: "runner-volt",  nome: "Runner Volt",   categoria: "Corrida",   preco: 509.90, foto: "https://images.pexels.com/photos/13450843/pexels-photo-13450843.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "street-flame", nome: "Street Flame",  categoria: "Skate",     preco: 349.90, foto: "https://images.pexels.com/photos/28953577/pexels-photo-28953577.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "nimbus-low",   nome: "Nimbus Low",    categoria: "Originals", preco: 299.90, foto: "https://images.pexels.com/photos/15398044/pexels-photo-15398044.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "pace-breaker", nome: "Pace Breaker",  categoria: "Corrida",   preco: 459.90, foto: "https://images.pexels.com/photos/27178861/pexels-photo-27178861.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "court-classic",nome: "Court Classic", categoria: "Originals", preco: 279.90, foto: "https://images.pexels.com/photos/11962269/pexels-photo-11962269.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "grip-line",    nome: "Grip Line",     categoria: "Skate",     preco: 369.90, foto: "https://images.pexels.com/photos/9333372/pexels-photo-9333372.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "trail-edge",   nome: "Trail Edge",    categoria: "Corrida",   preco: 499.90, foto: "https://images.pexels.com/photos/30063866/pexels-photo-30063866.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "retro-stride", nome: "Retro Stride",  categoria: "Originals", preco: 319.90, foto: "https://images.pexels.com/photos/3375910/pexels-photo-3375910.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "slide-deck",   nome: "Slide Deck",    categoria: "Skate",     preco: 359.90, foto: "https://images.pexels.com/photos/29548615/pexels-photo-29548615.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "volt-sprint",  nome: "Volt Sprint",   categoria: "Corrida",   preco: 439.90, foto: "https://images.pexels.com/photos/5051000/pexels-photo-5051000.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "heritage-82",  nome: "Heritage 82",   categoria: "Originals", preco: 289.90, foto: "https://images.pexels.com/photos/31172682/pexels-photo-31172682.jpeg?auto=compress&cs=tinysrgb&w=500" },
  { id: "curb-anthem",  nome: "Curb Anthem",   categoria: "Skate",     preco: 379.90, foto: "https://images.pexels.com/photos/9333372/pexels-photo-9333372.jpeg?auto=compress&cs=tinysrgb&w=500" },
];

const formatoPreco = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

// =========================================================
// SACOLA — estado + persistência
// =========================================================
function lerCarrinho() {
  return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
}
function salvarCarrinho(itens) {
  localStorage.setItem(CART_KEY, JSON.stringify(itens));
}

const bagCountEl = document.getElementById("bag-count");
const bagListEl = document.getElementById("bag-list");
const bagSubtotalEl = document.getElementById("bag-subtotal");
const bagOverlay = document.getElementById("bag-overlay");
const bagDrawer = document.getElementById("bag-drawer");

function atualizarContadorSacola() {
  const itens = lerCarrinho();
  const total = itens.reduce((soma, item) => soma + item.qtd, 0);
  bagCountEl.textContent = total;
  bagCountEl.classList.add("is-bump");
  setTimeout(() => bagCountEl.classList.remove("is-bump"), 200);
}

function renderizarSacola() {
  const itens = lerCarrinho();

  if (itens.length === 0) {
    bagListEl.innerHTML = `<p class="bag-empty">Sua sacola está vazia.</p>`;
    bagSubtotalEl.textContent = formatoPreco.format(0);
    return;
  }

  bagListEl.innerHTML = "";
  let subtotal = 0;

  itens.forEach(item => {
    subtotal += item.preco * item.qtd;

    const linha = document.createElement("div");
    linha.className = "bag-item";
    linha.innerHTML = `
      <div class="bag-item__art"><img src="${item.foto}" alt="${item.nome}" loading="lazy"></div>
      <div class="bag-item__info">
        <span class="bag-item__name">${item.nome}</span>
        <span class="bag-item__cat">${item.categoria}</span>
        <div class="bag-item__qty">
          <button class="qty-btn" data-acao="menos" data-id="${item.id}" aria-label="Diminuir quantidade">-</button>
          <span>${item.qtd}</span>
          <button class="qty-btn" data-acao="mais" data-id="${item.id}" aria-label="Aumentar quantidade">+</button>
        </div>
      </div>
      <div class="bag-item__right">
        <span class="bag-item__price">${formatoPreco.format(item.preco * item.qtd)}</span>
        <button class="bag-item__remove" data-acao="remover" data-id="${item.id}">Remover</button>
      </div>
    `;
    bagListEl.appendChild(linha);
  });

  bagSubtotalEl.textContent = formatoPreco.format(subtotal);
}

function adicionarAoCarrinho(produto) {
  const itens = lerCarrinho();
  const existente = itens.find(i => i.id === produto.id);

  if (existente) {
    existente.qtd += 1;
  } else {
    itens.push({ ...produto, qtd: 1 });
  }

  salvarCarrinho(itens);
  atualizarContadorSacola();
  renderizarSacola();
  mostrarToast(`${produto.nome} foi pra sua bolsa.`);
}

function alterarQuantidade(id, delta) {
  let itens = lerCarrinho();
  const item = itens.find(i => i.id === id);
  if (!item) return;

  item.qtd += delta;
  if (item.qtd <= 0) {
    itens = itens.filter(i => i.id !== id);
  }

  salvarCarrinho(itens);
  atualizarContadorSacola();
  renderizarSacola();
}

function removerDoCarrinho(id) {
  const itens = lerCarrinho().filter(i => i.id !== id);
  salvarCarrinho(itens);
  atualizarContadorSacola();
  renderizarSacola();
}

// ---- abrir/fechar drawer --------------------------------------
function abrirSacola() {
  renderizarSacola();
  bagOverlay.classList.add("is-open");
  bagDrawer.classList.add("is-open");
}
function fecharSacola() {
  bagOverlay.classList.remove("is-open");
  bagDrawer.classList.remove("is-open");
}

document.getElementById("bag-btn").addEventListener("click", abrirSacola);
document.getElementById("bag-close").addEventListener("click", fecharSacola);
bagOverlay.addEventListener("click", fecharSacola);

bagListEl.addEventListener("click", (evento) => {
  const btn = evento.target.closest("button[data-acao]");
  if (!btn) return;
  const { acao, id } = btn.dataset;

  if (acao === "mais") alterarQuantidade(id, 1);
  if (acao === "menos") alterarQuantidade(id, -1);
  if (acao === "remover") removerDoCarrinho(id);
});

document.getElementById("bag-checkout").addEventListener("click", () => {
  const itens = lerCarrinho();
  if (itens.length === 0) {
    mostrarToast("Sua sacola está vazia.");
    return;
  }
  salvarCarrinho([]);
  atualizarContadorSacola();
  renderizarSacola();
  fecharSacola();
  mostrarToast("Pedido feito! (demonstração — nenhuma cobrança real)");
});

// =========================================================
// Vitrine — montar cards
// =========================================================
function montarCard(produto) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.categoria = produto.categoria;

  card.innerHTML = `
    <div class="card__art">
      <span class="card__tag">Novo</span>
      <img src="${produto.foto}" alt="${produto.nome}" loading="lazy">
    </div>
    <div class="card__body">
      <span class="card__cat">${produto.categoria}</span>
      <span class="card__name">${produto.nome}</span>
      <span class="card__price">${formatoPreco.format(produto.preco)}</span>
      <button class="card__btn" type="button">Adicionar à bolsa</button>
    </div>
  `;

  card.querySelector(".card__btn").addEventListener("click", () => adicionarAoCarrinho(produto));
  return card;
}

const grid = document.getElementById("product-grid");
PRODUTOS.forEach(produto => grid.appendChild(montarCard(produto)));
document.getElementById("product-count").textContent = `${PRODUTOS.length} pares`;

// =========================================================
// Filtro por categoria (nav, tiles das categorias e chips da vitrine)
// =========================================================
function aplicarFiltro(categoria) {
  const cards = grid.querySelectorAll(".card");
  let visiveis = 0;

  cards.forEach(card => {
    const mostrar = categoria === "todos" || card.dataset.categoria === categoria;
    card.classList.toggle("is-hidden", !mostrar);
    if (mostrar) visiveis += 1;
  });

  document.getElementById("product-count").textContent = `${visiveis} ${visiveis === 1 ? "par" : "pares"}`;

  document.querySelectorAll(".filtro-btn").forEach(btn => {
    btn.classList.toggle("is-active", btn.dataset.filtro === categoria);
  });
}

document.querySelectorAll("[data-filtro]").forEach(el => {
  el.addEventListener("click", (evento) => {
    const categoria = el.dataset.filtro;
    aplicarFiltro(categoria);

    if (el.classList.contains("categoria-tile") || el.tagName === "A") {
      evento.preventDefault();
      document.getElementById("vitrine").scrollIntoView({ behavior: "smooth" });
    }
  });
});

// carrega estado inicial da sacola (persistiu de visitas anteriores)
atualizarContadorSacola();

// =========================================================
// Formulário de contato (envio real para o Gmail via FormSubmit)
// =========================================================
const GMAIL_DESTINO = "086b7668bd5e284a5f268d166347004f";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const formContato = document.getElementById("form-contato");
const contatoAlert = document.getElementById("contato-alert");
const submitBtn = formContato.querySelector('button[type="submit"]');
const submitBtnText = document.getElementById("contato-btn-text") || submitBtn.querySelector("span") || submitBtn;

function setErro(inputEl, erroEl, msg) {
  inputEl.classList.toggle("is-invalid", Boolean(msg));
  erroEl.textContent = msg || "";
}

formContato.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nomeInput = document.getElementById("contato-nome");
  const emailInput = document.getElementById("contato-email");
  const msgInput = document.getElementById("contato-mensagem");
  const honeyInput = formContato.querySelector("input[name='_honey']");

  // Se o campo invisível foi preenchido, é um bot de spam
  if (honeyInput && honeyInput.value) {
    return;
  }

  const nome = nomeInput.value.trim();
  const email = emailInput.value.trim();
  const mensagem = msgInput.value.trim();
  let valido = true;

  if (nome.length < 2) {
    setErro(nomeInput, document.getElementById("contato-nome-error"), "Digite seu nome.");
    valido = false;
  } else {
    setErro(nomeInput, document.getElementById("contato-nome-error"), "");
  }

  if (!EMAIL_RE.test(email)) {
    setErro(emailInput, document.getElementById("contato-email-error"), "Digite um e-mail válido.");
    valido = false;
  } else {
    setErro(emailInput, document.getElementById("contato-email-error"), "");
  }

  if (mensagem.length < 5) {
    setErro(msgInput, document.getElementById("contato-mensagem-error"), "Escreva sua mensagem.");
    valido = false;
  } else {
    setErro(msgInput, document.getElementById("contato-mensagem-error"), "");
  }

  if (!valido) {
    contatoAlert.hidden = true;
    return;
  }

  // Estado de envio (Carregando)
  contatoAlert.hidden = true;
  submitBtn.disabled = true;
  const textoOriginal = submitBtnText.textContent;
  submitBtnText.textContent = "Enviando mensagem...";

  try {
    const resposta = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(GMAIL_DESTINO)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "Nome": nome,
        "Email": email,
        "Mensagem": mensagem,
        "_subject": `Nova mensagem de contato de ${nome} - SORA`,
        "_replyto": email,
        "_template": "table",
        "_captcha": "false"
      })
    });

    const resultado = await resposta.json();

    if (resposta.ok && (resultado.success === "true" || resultado.success === true)) {
      contatoAlert.textContent = "Mensagem enviada com sucesso! A gente responde em breve no seu e-mail.";
      contatoAlert.classList.remove("form-alert--erro");
      contatoAlert.classList.add("is-success");
      contatoAlert.hidden = false;
      formContato.reset();
    } else {
      throw new Error(resultado.message || "Erro ao enviar o e-mail");
    }
  } catch (erro) {
    console.error("Erro no envio via AJAX:", erro);
    // Fallback: se falhar via AJAX, envia via form nativo
    formContato.submit();
  } finally {
    submitBtn.disabled = false;
    submitBtnText.textContent = textoOriginal;
  }
});

// =========================================================
// Newsletter (validação + confirmação — sem backend)
// =========================================================
const formNewsletter = document.getElementById("form-newsletter");
const newsletterAlert = document.getElementById("newsletter-alert");

formNewsletter.addEventListener("submit", (evento) => {
  evento.preventDefault();
  const emailInput = document.getElementById("newsletter-email");
  const email = emailInput.value.trim();

  if (!EMAIL_RE.test(email)) {
    newsletterAlert.textContent = "Digite um e-mail válido.";
    newsletterAlert.classList.remove("is-success");
    newsletterAlert.hidden = false;
    return;
  }

  newsletterAlert.textContent = "Inscrito! Seu cupom de 10% chega por e-mail.";
  newsletterAlert.classList.add("is-success");
  newsletterAlert.hidden = false;
  formNewsletter.reset();
});
