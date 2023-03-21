function checkForDuplicates() {
  const fileInput = document.getElementById("csv-file");
  const file = fileInput.files[0];

  // Verifica se o arquivo é do tipo CSV
  if (!file.name.endsWith(".csv")) {
    alert("Por favor, selecione um arquivo CSV!");
    return;
  }

  // Leitura do arquivo
  const reader = new FileReader();
  reader.readAsText(file);

  // Tratamento dos dados
  reader.onload = function (e) {
    const csv = e.target.result;
    const lines = csv.split("\n");

    const uniqueLines = new Set();
    const duplicateLines = new Set();

    // Percorrendo as linhas do arquivo
    lines.forEach((line) => {
      if (uniqueLines.has(line)) {
        duplicateLines.add(line);
      } else {
        uniqueLines.add(line);
      }
    });

    // Mostrando os resultados
    const resultDiv = document.getElementById("result");
    if (duplicateLines.size > 0) {
      const duplicatesCount = duplicateLines.size;
      resultDiv.innerHTML = `<h2>Linhas duplicadas encontradas: ${duplicatesCount}</h2>`;
      duplicateLines.forEach((line) => {
        const p = document.createElement("p");
        p.innerText = line;
        resultDiv.appendChild(p);
      });
      const deleteBtn = document.createElement("button");
      deleteBtn.innerText = "Excluir linhas duplicadas";
      deleteBtn.addEventListener("click", () => {
        const modifiedLines = [...uniqueLines];
        const modifiedCsv = modifiedLines.join("\n");
        const blob = new Blob([modifiedCsv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "LISTA MODIFICADA.csv";
        a.click();
      });
      resultDiv.appendChild(deleteBtn);
    } else {
      resultDiv.innerHTML = "<h2>Não foram encontradas linhas duplicadas.</h2>";
    }
  };
}