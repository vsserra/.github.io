document.addEventListener('DOMContentLoaded', () => {
    let fileInput = document.getElementById('fileInput');
    const fileLabel = document.getElementById('fileLabel');
    const sorteioButton = document.getElementById('sorteioButton');
    const reiniciarButton = document.getElementById('reiniciarButton');
    const toggleHistoricoButton = document.getElementById('toggleHistoricoButton');
    const quantidadeInput = document.getElementById('quantidadeInput');
    const sorteado = document.getElementById('sorteado');
    const sorteadoContainer = document.getElementById('sorteadoContainer');
    const sorteadoTitulo = document.getElementById('sorteadoTitulo');
    const historicoTitulo = document.getElementById('historicoTitulo');
    const historicoList = document.getElementById('historicoList');
    const downloadHistoricoButton = document.getElementById('downloadHistoricoButton');
    const historicoContainer = document.getElementById('historicoContainer');
    const historicoHeader = document.getElementById('historicoHeader');
    const inputGroup = document.getElementById('inputGroup');
    const { jsPDF } = window.jspdf;

    const contadorJurados = document.getElementById('contadorJurados');
    const quantidadeRestante = document.getElementById('quantidadeRestante');

    function atualizarContador() {
        quantidadeRestante.textContent = jurados.length;
        contadorJurados.classList.toggle('hidden', jurados.length === 0);
    } 

    // Modais
    const formatSelectModal = document.getElementById('formatSelectModal');
    const closeFormatModal = document.getElementById('closeFormatModal');
    const downloadCsvButton = document.getElementById('downloadCsvButton');
    const downloadPdfButton = document.getElementById('downloadPdfButton');

    const modalForm = document.getElementById('modalForm');
    const cancelButton = document.getElementById('cancelButton');
    const sessionForm = document.getElementById('sessionForm');

    // Popup de conferência da urna
    const popupOverlay = document.createElement('div');
    const popupContent = document.createElement('div');
    const popupCloseButton = document.createElement('button');

    popupOverlay.classList.add('popup-overlay');
    popupContent.classList.add('popup-content');
    popupCloseButton.textContent = 'Continuar';
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
                // Carrega os jurados na ordem original
                juradosIniciais = text.split('\n').map(name => name.trim()).filter(name => name);
    
                // Cria a lista embaralhada para o sorteio
                jurados = [...juradosIniciais];
                shuffleArray(jurados);
    
                sorteioButton.disabled = jurados.length === 0;
                fileLabel.textContent = file.name.length > 20 ? file.name.slice(0, 17) + '...' : file.name;
    
                if (juradosIniciais.length > 0) {
                    displayPopup(juradosIniciais); // Exibe a lista original na conferência
                }
    
                atualizarContador(); // Atualiza o contador de jurados restantes
            };
            reader.readAsText(file);
        } else {
            alert('Por favor, selecione um arquivo CSV válido.');
            fileLabel.textContent = 'Selecionar arquivo CSV';
        }
    }    
    
    // Função de embaralhamento Fisher-Yates
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
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
    
        if (quantidade > jurados.length) {
            alert(`Não é possível sortear mais jurados do que os disponíveis na lista. Há apenas ${jurados.length} jurados.`);
            return;
        }
    
        if (jurados.length > 0) {
            sorteadoContainer.classList.remove('hidden');
            reiniciarButton.classList.remove('hidden');
            sorteadoTitulo.classList.remove('hidden');
            historicoHeader.classList.remove('hidden'); // Apenas a barra com o botão "+" aparece
            toggleHistoricoButton.classList.remove('hidden'); // O botão "+" aparece
            historicoTitulo.classList.add('hidden'); // Garante que o título NÃO apareça automaticamente
            inputGroup.classList.add('hidden');
    
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
            sorteado.innerHTML = sorteados.join('<br>');
            updateHistorico();
            sorteioButton.disabled = jurados.length === 0;
            downloadHistoricoButton.disabled = false;
    
            atualizarContador();
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
        sorteadoTitulo.classList.add('hidden');
        historicoTitulo.classList.add('hidden'); // Agora sempre oculta ao reiniciar
        historicoContainer.classList.add('hidden');
        downloadHistoricoButton.classList.add('hidden');
        reiniciarButton.classList.add('hidden');
        historicoHeader.classList.add('hidden');
        toggleHistoricoButton.classList.add('hidden');
        toggleHistoricoButton.textContent = '+';
    
        sorteioButton.disabled = true;
        quantidadeInput.value = '';
        fileInput.value = '';
        fileLabel.textContent = 'Selecionar arquivo CSV';
    
        inputGroup.classList.remove('hidden');
    
        updateHistorico();
        atualizarContador();
    });            

    toggleHistoricoButton.addEventListener('click', () => {
        if (historicoContainer.classList.contains('hidden')) {
            historicoContainer.classList.remove('hidden');
            historicoTitulo.classList.remove('hidden'); // Só aparece ao clicar no botão "+"
            downloadHistoricoButton.classList.remove('hidden');
            toggleHistoricoButton.textContent = '-';
        } else {
            historicoContainer.classList.add('hidden');
            historicoTitulo.classList.add('hidden'); // Oculta novamente ao clicar "-"
            downloadHistoricoButton.classList.add('hidden');
            toggleHistoricoButton.textContent = '+';
        }
    });        

    function updateHistorico() {
        historicoList.innerHTML = "";
        historico.forEach(jurado => {
            const li = document.createElement('li');
            li.textContent = jurado;
            historicoList.appendChild(li);
        });
    }

    // Modal de seleção de formato
    function openFormatSelectModal() {
        formatSelectModal.classList.remove('hidden');
    }

    function closeFormatSelectModal() {
        formatSelectModal.classList.add('hidden');
    }

    document.getElementById('downloadHistoricoButton').addEventListener('click', openFormatSelectModal);
    closeFormatModal.addEventListener('click', closeFormatSelectModal);

    downloadCsvButton.addEventListener('click', () => {
        closeFormatSelectModal();
        downloadCsv();
    });

    downloadPdfButton.addEventListener('click', () => {
        closeFormatSelectModal();
        openModal();
    });

    // Função de download de CSV
    function downloadCsv() {
        const csvContent = "﻿" + historico.join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "historico_sorteados.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Modal de coleta de informações
    function openModal() {
        modalForm.classList.remove('hidden');
    }

    function closeModal() {
        modalForm.classList.add('hidden');
    }

    cancelButton.addEventListener('click', closeModal);

    sessionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(sessionForm);
        const sessionData = {
            processNumber: formData.get('processNumber'),
            judicialUnit: formData.get('judicialUnit'), // Nova chave para unidade judicial
            judgeName: formData.get('judgeName'),
            secretaryName: formData.get('secretaryName'),
            mpName: formData.get('mpName'),
            defenseNames: formData.get('defenseNames'),
            sessionDate: formData.get('sessionDate'),
            sessionTime: formData.get('sessionTime'),
        };        

        closeModal();
        generatePdf(sessionData);
    });

    function generatePdf(sessionData) {
        const doc = new jsPDF();
    
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(18);
        doc.text('Sorteio de Jurados - Relatório', 105, 20, { align: 'center' });
        doc.setFontSize(14);
        doc.text(`Unidade Judicial: ${sessionData.judicialUnit}`, 105, 28, { align: 'center' });
    
        doc.line(10, 35, 200, 35);
    
        doc.setFontSize(12);
        let startY = 45;
        const lineSpacing = 8;
    
        doc.setFont('helvetica', 'bold');
        doc.text('Unidade Judicial:', 10, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(sessionData.judicialUnit, 60, startY);
        startY += lineSpacing;
    
        doc.setFont('helvetica', 'bold');
        doc.text('Número do Processo:', 10, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(sessionData.processNumber, 60, startY);
        startY += lineSpacing;
    
        doc.setFont('helvetica', 'bold');
        doc.text('Juiz(a) Responsável:', 10, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(sessionData.judgeName, 60, startY);
        startY += lineSpacing;
    
        doc.setFont('helvetica', 'bold');
        doc.text('Secretário(a):', 10, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(sessionData.secretaryName, 60, startY);
        startY += lineSpacing;
    
        doc.setFont('helvetica', 'bold');
        doc.text('Representante do MP:', 10, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(sessionData.mpName, 60, startY);
        startY += lineSpacing;
    
        doc.setFont('helvetica', 'bold');
        doc.text('Defesa:', 10, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(sessionData.defenseNames, 60, startY);
        startY += lineSpacing;
    
        doc.setFont('helvetica', 'bold');
        doc.text('Data do Sorteio:', 10, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(sessionData.sessionDate, 60, startY);
        startY += lineSpacing;
    
        doc.setFont('helvetica', 'bold');
        doc.text('Hora do Sorteio:', 10, startY);
        doc.setFont('helvetica', 'normal');
        doc.text(sessionData.sessionTime, 60, startY);
        startY += lineSpacing;
    
        doc.line(10, startY, 200, startY);
    
        startY += lineSpacing;
    
        // === Título da Lista de Jurados ===
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Jurados Sorteados:', 10, startY);
        startY += lineSpacing;
    
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
    
        // === Tabela de Jurados Sorteados ===
        const tableColumn = ['Nº', 'Nome do Jurado'];
        const tableRows = historico.map((jurado, index) => [index + 1, jurado]);
    
        doc.autoTable({
            startY: startY,
            head: [tableColumn],
            body: tableRows,
            theme: 'striped',
            headStyles: { fillColor: [200, 200, 200], textColor: [0, 0, 0] },
            margin: { top: 20 },
            styles: { fontSize: 11, cellPadding: 3 },
            didDrawPage: function (data) {
                const pageHeight = doc.internal.pageSize.height;
                doc.setFontSize(10);
                doc.setTextColor(150);
                doc.text('Relatório Gerado pelo site www.sorteiodejurados.com', 105, pageHeight - 10, { align: 'center' });
            },
        });
    
        // Obtém a última posição Y da tabela
        let finalY = doc.lastAutoTable.finalY;

        // Calcula o espaço disponível na página
        const pageHeight = doc.internal.pageSize.height;
        const availableSpace = pageHeight - finalY - 20; // Espaço disponível após a tabela
        const minSignatureSpace = 40; // Espaço necessário para as assinaturas

        // === Verifica se as assinaturas cabem na mesma página ===
        if (availableSpace < minSignatureSpace) {
            doc.addPage();
            finalY = 20; // Define um novo Y no topo da página
        } else {
            finalY += 10; // Move um pouco para baixo se houver espaço
        }

        // === Rodapé com Assinaturas ===
        doc.setDrawColor(0);

        // Linha Juiz
        doc.line(30, finalY, 90, finalY);
        doc.text('Juiz(a) Responsável', 60, finalY + 5, { align: 'center' });

        // Linha Secretário
        doc.line(120, finalY, 180, finalY);
        doc.text('Secretário(a) Judicial', 150, finalY + 5, { align: 'center' });

        // Baixar o PDF
        doc.save('relatorio_sorteio.pdf');
    }        
});
