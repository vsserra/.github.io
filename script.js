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
        let contador = 1; // Inicia o contador em 1
        for (let i = 0; i < quantidade; i++) {
          if (nomes.length === 0) {
            break;
          }
          const sorteadoIndex = Math.floor(Math.random() * nomes.length);
          const nomeSorteado = nomes[sorteadoIndex];
          nomes.splice(sorteadoIndex, 1);
          nomesSorteadosArray.push(nomeSorteado);
          const item = document.createElement("li");
          item.innerHTML = `${contador}. ${nomeSorteado}`; // Adiciona o número da contagem ao nome do jurado sorteado
          resultado.appendChild(item);
          contador++; // Incrementa o contador em 1
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
        
        
function irParaComparador() {
			window.location.href = "comparadordearquivos.html";
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
}

document.getElementById("reiniciarBtn").addEventListener("click", function() {
  fileInput.value = "";
  document.getElementById("nomesSorteados").innerHTML = "";
  document.getElementById("resultado").innerHTML = "AGUARDANDO SORTEIO...";
  nomesSorteadosArray = [];
  document.getElementById("quantidadeInput").value = "";
  toggleDownloadBtn();
});


document.getElementById("appBtn").addEventListener("click", function() {
    window.open("https://sorteiodejurados.online/sorteadordejurados.rar", "_blank");
  });
