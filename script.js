const abrirConvite = document.getElementById("abrirConvite");
const abertura = document.getElementById("abertura");
const convite = document.getElementById("convite");

if (abrirConvite) {
  abrirConvite.addEventListener("click", function () {

    abertura.style.opacity = "0";

    setTimeout(function () {
      abertura.style.display = "none";
      convite.classList.remove("escondido");
    }, 600);

  });
}


/* CONTAGEM REGRESSIVA */

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

  document.getElementById("dias").textContent =
    String(dias).padStart(2, "0");

  document.getElementById("horas").textContent =
    String(horas).padStart(2, "0");

  document.getElementById("minutos").textContent =
    String(minutos).padStart(2, "0");

  document.getElementById("segundos").textContent =
    String(segundos).padStart(2, "0");
}

atualizarContagem();

setInterval(atualizarContagem, 1000);
