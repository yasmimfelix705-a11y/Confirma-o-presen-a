import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/* =========================
   FIREBASE
========================= */

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


/* =========================
   ABRIR CONVITE
========================= */

const abrirConvite = document.getElementById("abrirConvite");
const abertura = document.getElementById("abertura");
const convite = document.getElementById("convite");

if (abrirConvite) {

  abrirConvite.addEventListener("click", () => {

    abertura.style.opacity = "0";

    setTimeout(() => {

      abertura.style.display = "none";
      convite.classList.remove("escondido");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }, 600);

  });

}


/* =========================
   CONTAGEM REGRESSIVA
========================= */

function atualizarContagem() {

  const agora = new Date();

  let ano = agora.getFullYear();

  let dataFesta = new Date(
    ano,
    11,
    5,
    20,
    0,
    0
  );

  /*
    Se o dia 5 de dezembro deste ano já passou,
    usamos o próximo ano.
  */

  if (agora >= dataFesta) {

    dataFesta = new Date(
      ano + 1,
      11,
      5,
      20,
      0,
      0
    );

  }

  const diferenca = dataFesta - agora;

  const dias = Math.floor(
    diferenca / (1000 * 60 * 60 * 24)
  );

  const horas = Math.floor(
    (diferenca / (1000 * 60 * 60)) % 24
  );

  const minutos = Math.floor(
    (diferenca / (1000 * 60)) % 60
  );

  const segundos = Math.floor(
    (diferenca / 1000) % 60
  );


  const elementoDias =
    document.getElementById("dias");

  const elementoHoras =
    document.getElementById("horas");

  const elementoMinutos =
    document.getElementById("minutos");

  const elementoSegundos =
    document.getElementById("segundos");


  if (elementoDias) {
    elementoDias.textContent =
      String(dias).padStart(2, "0");
  }

  if (elementoHoras) {
    elementoHoras.textContent =
      String(horas).padStart(2, "0");
  }

  if (elementoMinutos) {
    elementoMinutos.textContent =
      String(minutos).padStart(2, "0");
  }

  if (elementoSegundos) {
    elementoSegundos.textContent =
      String(segundos).padStart(2, "0");
  }

}

atualizarContagem();

setInterval(atualizarContagem, 1000);


/* =========================
   FUNÇÕES DOS CONVIDADOS
========================= */

function normalizar(texto) {

  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

}


function criarId(convidado) {

  const nome = normalizar(convidado.nome)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");

  return `${convidado.grupo}_${nome}`;

}


/* =========================
   BUSCAR CONVIDADO
========================= */

const nomeInput =
  document.getElementById("nome");

const buscarBtn =
  document.getElementById("buscarBtn");

const resultado =
  document.getElementById("resultado");


if (buscarBtn) {

  buscarBtn.addEventListener("click", buscarConvidado);

}


if (nomeInput) {

  nomeInput.addEventListener("keydown", (evento) => {

    if (evento.key === "Enter") {
      buscarConvidado();
    }

  });

}


async function buscarConvidado() {

  const nomeDigitado =
    normalizar(nomeInput.value);


  if (!nomeDigitado) {

    resultado.innerHTML = `
      <div class="mensagem">
        Digite seu nome para encontrar seu convite.
      </div>
    `;

    return;
  }


  const lista =
    window.convidados || [];


  const encontrados =
    lista.filter((convidado) =>
      normalizar(convidado.nome)
        .includes(nomeDigitado)
    );


  if (encontrados.length === 0) {

    resultado.innerHTML = `
      <div class="mensagem">
        Não encontramos seu nome na lista.
        <br>
        Confira a escrita e tente novamente.
      </div>
    `;

    return;
  }


  resultado.innerHTML = `
    <div class="lista-encontrados">
      <h2>Seu convite foi encontrado! 💙</h2>
    </div>
  `;


  const listaResultado =
    resultado.querySelector(".lista-encontrados");


  for (const convidado of encontrados) {

    const id =
      criarId(convidado);


    const referencia =
      doc(db, "confirmacoes", id);


    let confirmado = false;


    try {

      const documento =
        await getDoc(referencia);

      confirmado =
        documento.exists();

    } catch (erro) {

      console.error(
        "Erro ao verificar confirmação:",
        erro
      );

    }


    const card =
      document.createElement("div");

    card.className =
      "convidado";


    card.innerHTML = `
      <strong>${convidado.nome}</strong>

      <small>
        ${convidado.familia}
      </small>
    `;


    const botao =
      document.createElement("button");
