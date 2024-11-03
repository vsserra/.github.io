document.addEventListener('DOMContentLoaded', () => {
    let fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const sorteioButton = document.getElementById('sorteioButton');
    const reiniciarButton = document.getElementById('reiniciarButton');
    const toggleHistoricoButton = document.getElementById('toggleHistoricoButton');
    const quantidadeInput = document.getElementById('quantidadeInput');
    const sorteado = document.getElementById('sorteado');
    const sorteadoContainer = document.getElementById('sorteadoContainer');
    const sorteadoTitulo = document.getElementById('sorteadoTitulo'); // Novo elemento
    const historicoTitulo = document.getElementById('historicoTitulo');
    const historicoList = document.getElementById('historicoList');
    const downloadHistoricoButton = document.getElementById('downloadHistoricoButton');
    const historicoContainer = document.getElementById('historicoContainer');
    const historicoHeader = document.getElementById('historicoHeader');
    const inputGroup = document.getElementById('inputGroup'); // Novo elemento

    // Criação do Popup para mostrar as informações do arquivo
    const popupOverlay = document.createElement('div');
    const popupContent = document.createElement('div');
    const popupCloseButton = document.createElement('button');

    popupOverlay.classList.add('popup-overlay');
    popupContent.classList.add('popup-content');
    popupCloseButton.textContent = 'Fechar';
    popupCloseButton.classList.add('popup-close');

    popupOverlay.appendChild(popupContent);
    popupContent.appendChild(popupCloseButton);
    document.body.appendChild(popupOverlay);

    popupOverlay.style.display = 'none';

    // Evento para fechar o Popup
    popupCloseButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
    });

    let jurados = [];
    let historico = [];
    let juradosIniciais = [];

    function handleFileChange(event) {
        const file = event.target.files[0];
        if (file && file.type === 'text/csv') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const text = e.target.result;
                jurados = text.split('\n').map(name => name.trim()).filter(name => name);
                juradosIniciais = [...jurados];
                sorteioButton.disabled = jurados.length === 0;
                fileLabel.textContent = file.name.length > 20 ? file.name.slice(0, 17) + '...' : file.name;

                if (jurados.length > 0) {
                    displayPopup(jurados);
                }
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, selecione um arquivo CSV válido.');
            fileLabel.textContent = 'Selecionar arquivo CSV';
        }
    }

    fileInput.addEventListener('change', handleFileChange);

    function displayPopup(jurados) {
        popupContent.innerHTML = '<h2>Conferência da Urna</h2>';
        popupContent.appendChild(popupCloseButton);

        // Estatísticas gerais
        const statsContainer = document.createElement('div');
        statsContainer.classList.add('stats-container');
        const totalJurados = document.createElement('p');
        totalJurados.textContent = `Total de Jurados: ${jurados.length}`;
        statsContainer.appendChild(totalJurados);
        popupContent.appendChild(statsContainer);

        // Tabela dos jurados
        const tableContainer = document.createElement('div');
        tableContainer.classList.add('table-container');
        const table = document.createElement('table');
        table.classList.add('styled-table');

        const headerRow = document.createElement('tr');
        const thIndex = document.createElement('th');
        const thName = document.createElement('th');

        thIndex.textContent = 'Nº';
        thName.textContent = 'Nome do Jurado';
        headerRow.appendChild(thIndex);
        headerRow.appendChild(thName);
        table.appendChild(headerRow);

        jurados.forEach((jurado, index) => {
            const row = document.createElement('tr');
            const cellIndex = document.createElement('td');
            const cellName = document.createElement('td');

            cellIndex.textContent = index + 1;
            cellName.textContent = jurado;

            row.appendChild(cellIndex);
            row.appendChild(cellName);
            table.appendChild(row);
        });

        tableContainer.appendChild(table);
        popupContent.appendChild(tableContainer);

        popupOverlay.style.display = 'flex';
    }

    sorteioButton.addEventListener('click', () => {
        const quantidade = parseInt(quantidadeInput.value) || 1;
        if (jurados.length > 0) {
            sorteadoContainer.classList.remove('hidden');
            reiniciarButton.classList.remove('hidden');
            sorteadoTitulo.classList.remove('hidden'); // Exibir título
            historicoHeader.classList.remove('hidden');
            toggleHistoricoButton.classList.remove('hidden');
            if (toggleHistoricoButton.textContent === '+') {
                historicoTitulo.classList.add('hidden'); // Manter o título do histórico oculto
            }
            inputGroup.classList.add('hidden'); // Ocultar grupo de inputs

            const sorteados = [];
            for (let i = 0; i < quantidade; i++) {
                if (jurados.length > 0) {
                    const randomIndex = Math.floor(Math.random() * jurados.length);
                    const juradoSorteado = jurados.splice(randomIndex, 1)[0];
                    sorteados.push(juradoSorteado);
                    historico.push(juradoSorteado);
                } else {
                    break;
                }
            }
            sorteado.innerHTML = sorteados.join('<br>'); // Usar <br> para quebras de linha
            updateHistorico();
            sorteioButton.disabled = jurados.length === 0;
            downloadHistoricoButton.disabled = false;
        } else {
            sorteado.textContent = 'Não há mais jurados para sortear.';
        }
    });

    reiniciarButton.addEventListener('click', () => {
        jurados = [];
        juradosIniciais = [];
        historico = [];
        sorteado.textContent = '';
        sorteadoContainer.classList.add('hidden');
        sorteadoTitulo.classList.add('hidden'); // Ocultar título
        historicoTitulo.classList.add('hidden');
        historicoContainer.classList.add('hidden');
        downloadHistoricoButton.classList.add('hidden');
        reiniciarButton.classList.add('hidden');
        historicoHeader.classList.add('hidden');
        toggleHistoricoButton.classList.add('hidden');
        toggleHistoricoButton.textContent = '+';
        sorteioButton.disabled = true;
        quantidadeInput.value = ''; // Limpar o input de quantidade de jurados

        // Limpar o valor do input de arquivo
        fileInput.value = '';
        fileLabel.textContent = 'Selecionar arquivo CSV'; // Redefinir o texto do rótulo do arquivo

        // Remover o evento de mudança do input antigo
        fileInput.removeEventListener('change', handleFileChange);

        // Criar um novo input de arquivo
        const newFileInput = document.createElement('input');
        newFileInput.type = 'file';
        newFileInput.id = 'fileInput';
        newFileInput.accept = '.csv';
        newFileInput.setAttribute('aria-label', 'Selecione um arquivo CSV com a lista de jurados');

        // Substituir o input antigo pelo novo
        fileInput.parentNode.replaceChild(newFileInput, fileInput);

        // Atualizar a referência do fileInput e adicionar o evento change
        fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', handleFileChange);

        inputGroup.classList.remove('hidden'); // Mostrar grupo de inputs

        updateHistorico();
    });

    toggleHistoricoButton.addEventListener('click', () => {
        if (historicoContainer.classList.contains('hidden')) {
            historicoContainer.classList.remove('hidden');
            historicoTitulo.classList.remove('hidden');
            downloadHistoricoButton.classList.remove('hidden');
            toggleHistoricoButton.textContent = '-';
        } else {
            historicoContainer.classList.add('hidden');
            historicoTitulo.classList.add('hidden');
            downloadHistoricoButton.classList.add('hidden');
            toggleHistoricoButton.textContent = '+';
        }
    });

    downloadHistoricoButton.addEventListener('click', () => {
        const csvContent = "﻿" + historico.join("\n"); // Adicionado BOM para UTF-8
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "historico_sorteados.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    function updateHistorico() {
        historicoList.innerHTML = "";
        historico.forEach(jurado => {
            const li = document.createElement('li');
            li.textContent = jurado;
            historicoList.appendChild(li);
        });
        scrollToBottom(historicoContainer);
    }

    function scrollToBottom(element) {
        element.scrollTop = element.scrollHeight;
    }
});
