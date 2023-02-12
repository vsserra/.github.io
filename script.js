      const sortearBtn = document.getElementById("sortearBtn");
      const fileInput = document.getElementById("fileInput");
      const resultado = document.getElementById("resultado");
      const nomesSorteados = document.getElementById("nomesSorteados");
      let nomes = [];
      let nomesSorteadosArray = [];
      
      sortearBtn.addEventListener("click", () => {
        if (nomes.length === 0) {
          resultado.innerHTML = "TODOS OS NOMES FORAM SORTEADOS OU NENHUM ARQUIVO FOI SELECIONADO!";
          return;
        }
        let index = Math.floor(Math.random() * nomes.length);
        let sorteado = nomes[index];
        nomesSorteadosArray.push(sorteado);
        nomes.splice(index, 1);
        resultado.innerHTML = `O(A) SORTEADO(A) É: ${sorteado}`;
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

  let data = nomesSorteadosArray.join("");
  let blob = new Blob([data], { type: "text/csv" });
  let url = URL.createObjectURL(blob);
  let a = document.createElement("a");
  a.href = url;
  a.download = "historico_sorteados.csv";
  a.click();
});

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
}

document.getElementById("reiniciarBtn").addEventListener("click", function() {
document.getElementById("fileInput").value = "";
document.getElementById("nomesSorteados").innerHTML = "";
document.getElementById("resultado").innerHTML = "AGUARDANDO SORTEIO...";
    nomesSorteadosArray = [];
    toggleDownloadBtn();
});

document.getElementById("appBtn").addEventListener("click", function() {
    window.open("https://sorteiodejurados.online/SorteadorDeJurados.exe", "_blank");
  });
