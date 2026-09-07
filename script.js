import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAYBh_xHUGuEGMjpHEOxBU-Nppc5ymum6g",
  authDomain: "yasmim-dc181.firebaseapp.com",
  projectId: "yasmim-dc181",
  storageBucket: "yasmim-dc181.firebasestorage.app",
  messagingSenderId: "773790336369",
  appId: "1:773790336369:web:9292e70565a551b4bf22d0",
  measurementId: "G-MRCSX5RNGN"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log("Firebase conectado! 💙");

const nomeInput = document.getElementById("nome");
const buscarBtn = document.getElementById("buscarBtn");
const resultado = document.getElementById("resultado");

function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function idSeguro(texto) {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

async function verificarConfirmacao(convidado) {

  const id = `${convidado.grupo}_${idSeguro(convidado.nome)}`;

  const referencia = doc(db, "confirmacoes", id);
  const documento = await getDoc(referencia);

  return documento.exists();
}

async function confirmar(convidado, botao) {

  botao.disabled = true;
  botao.textContent = "Confirmando...";

  try {

    const id = `${convidado.grupo}_${idSeguro(convidado.nome)}`;
    const referencia = doc(db, "confirmacoes", id);

    const existente = await getDoc(referencia);

    if (existente.exists()) {

      botao.textContent = "✓ Já confirmado";
      botao.classList.add("confirmado");

      return;
    }

    await setDoc(referencia, {
      nome: convidado.nome,
      familia: convidado.familia,
      grupo: convidado.grupo,
      confirmado: true,
      data: new Date().toISOString()
    });

    botao.textContent = "✓ Presença confirmada!";
    botao.classList.add("confirmado");

  } catch (erro) {

    console.error(erro);

    botao.disabled = false;
    botao.textContent = "Confirmar presença";

    alert(
      "Não foi possível confirmar agora. Verifique sua conexão e tente novamente."
    );
  }
}

async function mostrarResultado(nomeDigitado) {

  resultado.innerHTML = "";

  const busca = normalizar(nomeDigitado);

  if (!busca) {

    resultado.innerHTML = `
      <p class="mensagem">
        Digite seu nome para continuar.
      </p>
    `;

    return;
  }

  const encontrados = window.convidados.filter(convidado =>
    normalizar(convidado.nome).includes(busca)
  );

  if (encontrados.length === 0) {

    resultado.innerHTML = `
      <div class="mensagem">
        <p>Não encontramos esse nome na lista.</p>
        <small>Confira a escrita e tente novamente.</small>
      </div>
    `;

    return;
  }

  resultado.innerHTML = `
    <div class="lista-encontrados">
      <h2>Encontramos:</h2>
    </div>
  `;

  const lista = resultado.querySelector(".lista-encontrados");

  for (const convidado of encontrados) {

    const jaConfirmou = await verificarConfirmacao(convidado);

    const item = document.createElement("div");
    item.className = "convidado";

    const nome = document.createElement("strong");
    nome.textContent = convidado.nome;

    const familia = document.createElement("small");
    familia.textContent = convidado.familia;

    const botao = document.createElement("button");

    if (jaConfirmou) {

      botao.textContent = "✓ Já confirmou";
      botao.disabled = true;
      botao.classList.add("confirmado");

    } else {

      botao.textContent = "Confirmar presença";

      botao.addEventListener("click", () => {
        confirmar(convidado, botao);
      });
    }

    item.appendChild(nome);
    item.appendChild(familia);
    item.appendChild(botao);

    lista.appendChild(item);
  }
}

if (buscarBtn) {

  buscarBtn.addEventListener("click", () => {
    mostrarResultado(nomeInput.value);
  });
}

if (nomeInput) {

  nomeInput.addEventListener("keydown", (evento) => {

    if (evento.key === "Enter") {
      mostrarResultado(nomeInput.value);
    }

  });
}
