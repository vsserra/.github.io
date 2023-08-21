const sortearBtn = document.getElementById("sortearBtn");
const fileInput = document.getElementById("fileInput");
const resultado = document.getElementById("resultado");
const nomesSorteados = document.getElementById("nomesSorteados");
const quantidadeInput = document.getElementById("quantidadeInput");
let nomes = [];
let nomesSorteadosArray = [];
      
sortearBtn.addEventListener("click", () => {
    let quantidade = parseInt(quantidadeInput.value) || 1;

    if (isNaN(quantidade)) {
        resultado.innerHTML = "POR FAVOR, INSIRA UMA QUANTIDADE VÁLIDA DE NOMES A SEREM SORTEADOS!";
        return;
    }

    if (nomes.length === 0 || fileInput.value === "") {
        resultado.innerHTML = "TODOS OS NOMES FORAM SORTEADOS OU NENHUM ARQUIVO FOI SELECIONADO!";
        return;
    }

    resultado.innerHTML = "SORTEADO(A)";
    let contador = 1; 

    for (let i = 0; i < quantidade; i++) {
        if (nomes.length === 0) {
            break;
        }

        let sorteadoIndex = Math.floor(Math.random() * nomes.length);
        let nomeSorteado = nomes[sorteadoIndex];

        nomes.splice(sorteadoIndex, 1);
        nomesSorteadosArray.push(nomeSorteado);
        const item = document.createElement("li");
        item.innerHTML = nomeSorteado;
        resultado.appendChild(item);
        contador++;
    }

    updateNomesSorteados();
});      
      
      fileInput.addEventListener("change", (e) => {
      let file = e.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
      nomes = e.target.result.split("\n");
      nomes = nomes.filter((nome) => nome !== "");
      };
  reader.readAsText(file);
});
      
      function updateNomesSorteados() {
        nomesSorteados.innerHTML = "";
        for (let i = 0; i < nomesSorteadosArray.length; i++) {
          let item = document.createElement("li");
          item.innerHTML = `${i + 1}. ${nomesSorteadosArray[i]}`;
          nomesSorteados.appendChild(item);
        }
      }

      const downloadBtn = document.createElement("button");
      downloadBtn.innerHTML = "BAIXAR HISTÓRICO DE SORTEADOS";
      downloadBtn.title = "Clique aqui para baixar o histórico de sorteados no formato de planilha.";
      downloadBtn.style.display = "block";
      downloadBtn.style.margin = "0 auto";
      downloadBtn.style.marginBottom = "20px";
      document.body.appendChild(downloadBtn);
      downloadBtn.addEventListener("click", () => {
        if (nomesSorteadosArray.length === 0) {
          return;
        }

        let data = nomesSorteadosArray.join("\n");
        let blob = new Blob([data], { type: "text/csv" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "historico_sorteados.csv";
        a.click();
        });

        const printButton = document.getElementById("print-button");
        printButton.addEventListener("click", () => {
          window.print();
        });

document.getElementById("appBtn").addEventListener("click", function() {
    window.open("https://sorteiodejurados.online/sorteadordejurados.rar", "_blank");
});


function irParaComparador() {
			window.location.href = "comparadordearquivos.html";
		}

function irParaVerificador() {
			window.location.href = "verificadordenomes.html";
		}

function irParaCronometro() {
			window.location.href = "cronometrodebates.html";
		}

function irParaWpp() {
			window.location.href = "wpp.html";
		}

function irParaCalc() {
			window.location.href = "https://chrome.google.com/webstore/detail/calculadora-penal/bbombpbliidopehhicjgbjgldadbfjai?hl=pt-br";
		}

function toggleDownloadBtn() {
  if (nomesSorteadosArray.length === 0) {
    downloadBtn.style.display = "none";
  } else {
    downloadBtn.style.display = "block";
  }
}

toggleDownloadBtn();

function updateNomesSorteados() {
  nomesSorteados.innerHTML = "";
  for (let i = 0; i < nomesSorteadosArray.length; i++) {
    let item = document.createElement("li");
    item.innerHTML = `${i + 1}. ${nomesSorteadosArray[i]}`;
    nomesSorteados.appendChild(item);
  }
  toggleDownloadBtn();
  nomesSorteados.scrollTop = nomesSorteados.scrollHeight;

  // Adicionar ou remover a classe "hidden" para exibir ou ocultar o elemento <ol>
  if (nomesSorteadosArray.length === 0) {
    nomesSorteados.classList.add("hidden");
  } else {
    nomesSorteados.classList.remove("hidden");
  }
  // Adicionar ou remover a classe "hidden" para exibir ou ocultar o elemento <h3>
  const historicoTitle = document.getElementById("historicoTitle");
  if (nomesSorteadosArray.length === 0) {
    historicoTitle.classList.add("hidden");
  } else {
    historicoTitle.classList.remove("hidden");
  }
}

document.getElementById("reiniciarBtn").addEventListener("click", function() {
    fileInput.value = "";
    document.getElementById("nomesSorteados").innerHTML = "";
    document.getElementById("resultado").innerHTML = "AGUARDANDO SORTEIO...";
    nomesSorteadosArray = [];
    document.getElementById("quantidadeInput").value = "";
    toggleDownloadBtn();
    document.getElementById("nomesSorteados").classList.add("hidden");
    document.getElementById("historicoTitle").classList.add("hidden");
});

document.getElementById("appBtn").addEventListener("click", function() {
    window.open("https://sorteiodejurados.online/sorteadordejurados.rar", "_blank");
});

window.addEventListener("load", function() {
  const popup = document.getElementById("popup");
  const closePopupBtn = document.getElementById("close-popup");

  popup.classList.add("popup-appear");

  closePopupBtn.addEventListener("click", function() {
    popup.classList.remove("popup-appear");
    popup.classList.add("popup-disappear");

    // Aguarda o término da animação e remove o elemento do DOM
    setTimeout(function() {
      popup.parentNode.removeChild(popup);
    }, 300);
  });
});
