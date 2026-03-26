// ventanas/tradicional/tradicional.js
import FractionUtils from '../../utils/fraction.js';

// TRADICIONAL window calculation formulas
const Tradicional = {
    calcular(ancho, alto, hojas) {
        const parts = [];
        
        if (hojas === 2) {
            parts.push(
                { tipo: 'HOJA', pieza: 'CAB-ALF', medida: (ancho / 2) - (5/16) },
                { tipo: 'HOJA', pieza: 'JAMBAS', medida: alto - (11/16) },
                { tipo: 'MARCO', pieza: 'CAB-RIEL', medida: ancho - (2/16) },
                { tipo: 'MARCO', pieza: 'LATERAL', medida: alto - (1/2) },
                { tipo: 'VIDRIO', pieza: 'ANCHO', medida: (ancho / 2) - (2 + 1/8) },
                { tipo: 'VIDRIO', pieza: 'ALTO', medida: alto - (3 + 13/16) }
            );
        } else if (hojas === 3) {
            parts.push(
                { tipo: 'HOJA', pieza: 'CAB-ALF', medida: (ancho / 3) + (1/16) },
                { tipo: 'HOJA', pieza: 'JAMBAS', medida: alto - (10/16) },
                { tipo: 'MARCO', pieza: 'CAB-RIEL', medida: ancho - (2/16) },
                { tipo: 'MARCO', pieza: 'LATERAL', medida: alto - (1/2) },
                { tipo: 'VIDRIO', pieza: 'ANCHO LATERAL', medida: (ancho / 3) - (1 + 7/8) },
                { tipo: 'VIDRIO', pieza: 'ANCHO MEDIO', medida: (ancho / 3) - 1  },
                { tipo: 'VIDRIO', pieza: 'ALTO', medida: alto - (3 + 13/16) }
            );
        } else if (hojas === 4) {
            parts.push(
                { tipo: 'HOJA', pieza: 'CAB-ALF', medida: (ancho / 4) - (1/8) },
                { tipo: 'HOJA', pieza: 'JAMBAS', medida: alto - (7/8) },
                { tipo: 'MARCO', pieza: 'CAB-RIEL', medida: ancho - (1/8) },
                { tipo: 'MARCO', pieza: 'LATERAL', medida: alto - (1/2) },
                { tipo: 'VIDRIO', pieza: 'ANCHO', medida: (ancho / 4) - 2 },
                { tipo: 'VIDRIO', pieza: 'ALTO', medida: alto - (4 + 1/8) }
            );
        }
        
        return parts;
    }
};

// App state
let windows = [];
let currentHueco = 1;

// DOM Elements
const huecoInput = document.getElementById('hueco');
const anchoInput = document.getElementById('ancho');
const altoInput = document.getElementById('alto');
const hojasSelect = document.getElementById('hojas');
const agregarBtn = document.getElementById('agregarBtn');
const resetBtn = document.getElementById('resetBtn');
const printBtn = document.getElementById('printBtn');
const pdfBtn = document.getElementById('pdfBtn');
const tableBody = document.getElementById('tableBody');
const printFooter = document.getElementById('printFooter');

function renderTable() {
    if (windows.length === 0) {
        tableBody.innerHTML = `<tr class="empty-row"><td colspan="11">— Antre mezi yo epi klike AGREGAR —</td></tr>`;
        return;
    }
    
    let html = '';
    windows.forEach(row => {
        html += `
            <tr>
                <td>${row.hueco}</td>
                <td>${row.ancho}</td>
                <td>${row.alto}</td>
                <td>${row.hojas}</td>
                <td>${row.cabAlf}</td>
                <td>${row.jambas}</td>
                <td>${row.cabRiel}</td>
                <td>${row.latMarco}</td>
                <td>${row.vidrioAncho}</td>
                <td>${row.vidrioAlto}</td>
                <td>${row.vidrioMedio || ''}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

function handleAgregar() {
    const hueco = parseInt(huecoInput.value) || currentHueco;
    const anchoRaw = anchoInput.value.trim();
    const altoRaw = altoInput.value.trim();
    const hojas = parseInt(hojasSelect.value);
    
    if (!anchoRaw || !altoRaw) {
        alert('Antre ANCHO ak ALTO');
        return;
    }
    
    const anchoDec = FractionUtils.parseFraction(anchoRaw);
    const altoDec = FractionUtils.parseFraction(altoRaw);
    
    if (anchoDec <= 0 || altoDec <= 0) {
        alert('Mezi yo dwe pi gran pase 0');
        return;
    }
    
    const parts = Tradicional.calcular(anchoDec, altoDec, hojas);
    
    const row = {
        hueco,
        ancho: anchoRaw,
        alto: altoRaw,
        hojas,
        cabAlf: FractionUtils.toSixteenths(parts.find(p => p.pieza === 'CAB-ALF')?.medida || 0),
        jambas: FractionUtils.toSixteenths(parts.find(p => p.pieza === 'JAMBAS')?.medida || 0),
        cabRiel: FractionUtils.toSixteenths(parts.find(p => p.pieza === 'CAB-RIEL')?.medida || 0),
        latMarco: FractionUtils.toSixteenths(parts.find(p => p.pieza === 'LATERAL')?.medida || 0),
        vidrioAncho: FractionUtils.toSixteenths(parts.find(p => p.pieza === 'ANCHO' || p.pieza === 'ANCHO LATERAL')?.medida || 0),
        vidrioAlto: FractionUtils.toSixteenths(parts.find(p => p.pieza === 'ALTO')?.medida || 0),
        vidrioMedio: hojas === 3 ? FractionUtils.toSixteenths(parts.find(p => p.pieza === 'ANCHO MEDIO')?.medida || 0) : null
    };
    
    windows.push(row);
    renderTable();
    
    currentHueco = hueco + 1;
    huecoInput.value = currentHueco;
    anchoInput.value = '';
    altoInput.value = '';
}

function handleReset() {
    windows = [];
    currentHueco = 1;
    huecoInput.value = '1';
    anchoInput.value = '';
    altoInput.value = '';
    hojasSelect.value = '2';
    renderTable();
}

/**
 * Creates a printable version with PROFESSIONAL STYLING
 */
function createPrintableContent() {
    const date = new Date().toLocaleDateString();
    
    // Get the table with results
    const tableClone = document.getElementById('cuttingTable').cloneNode(true);
    
    // Remove empty row if present
    const emptyRow = tableClone.querySelector('.empty-row');
    if (emptyRow) emptyRow.remove();
    
    // If no data, show message
    if (windows.length === 0) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>DESGLOSE TRADICIONAL</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
                        margin: 0.5in;
                        background: white;
                    }
                    .message {
                        text-align: center;
                        padding: 2rem;
                        color: #666;
                        font-size: 14px;
                    }
                </style>
            </head>
            <body>
                <div class="message">Pa gen done pou enprime</div>
            </body>
            </html>
        `;
    }
    
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>DESGLOSE TRADICIONAL</title>
            <style>
                * {
                    box-sizing: border-box;
                }
                body {
                    font-family: 'Segoe UI', Roboto, Arial, sans-serif;
                    margin: 0.5in;
                    background: white;
                    line-height: 1.4;
                }
                .header {
                    text-align: center;
                    margin-bottom: 25px;
                }
                .header h1 {
                    font-size: 24px;
                    color: #1e2b3c;
                    margin: 0 0 5px 0;
                    font-weight: 600;
                }
                .header h2 {
                    font-size: 18px;
                    color: #2c3e50;
                    margin: 0;
                    font-weight: 400;
                }
                .info-section {
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 15px;
                    margin-bottom: 25px;
                    border: 1px solid #dee2e6;
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: space-between;
                }
                .info-item {
                    font-size: 14px;
                    color: #495057;
                }
                .info-item strong {
                    color: #1e2b3c;
                    margin-right: 5px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    border: 2px solid #1e2b3c;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                }
                th {
                    background: #1e2b3c;
                    color: white;
                    text-align: center;
                    padding: 12px 8px;
                    border: 1px solid #2c3e50;
                    font-size: 13px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                th[colspan] {
                    background: #2c3e50;
                }
                td {
                    border: 1px solid #adb5bd;
                    padding: 10px 8px;
                    text-align: center;
                    font-family: 'Courier New', monospace;
                    font-size: 13px;
                    color: #212529;
                    background: white;
                }
                tr:nth-child(even) td {
                    background: #f8f9fa;
                }
                .footer {
                    margin-top: 30px;
                    text-align: right;
                    font-size: 12px;
                    color: #6c757d;
                    border-top: 1px solid #dee2e6;
                    padding-top: 15px;
                }
                .footer .date {
                    font-weight: 600;
                    color: #1e2b3c;
                }
                .footer .credit {
                    float: left;
                    font-weight: 400;
                    color: #2c3e50;
                }
                @media print {
                    body {
                        margin: 0.2in;
                    }
                    th {
                        background: #1e2b3c !important;
                        color: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    th[colspan] {
                        background: #2c3e50 !important;
                    }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>VENTANA TRADICIONAL</h1>
                <h2>SISTEMA PROFESIONAL DE CÁLCULO</h2>
            </div>
            
            ${tableClone.outerHTML}
            
            <div class="footer">
                <span class="credit">KREYE PA CHRISTOPHER</span>
                <span class="date">${date}</span>
            </div>
        </body>
        </html>
    `;
    
    return html;
}

function handlePrint() {
    if (windows.length === 0) {
        alert('Pa gen done pou enprime. Antre mezi ou an premye.');
        return;
    }
    
    const printContent = createPrintableContent();
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    
    setTimeout(() => {
        printWindow.print();
    }, 500);
}

function handlePdf() {
    if (windows.length === 0) {
        alert('Pa gen done pou ekspòte. Antre mezi ou an premye.');
        return;
    }
    
    const container = document.createElement('div');
    container.innerHTML = createPrintableContent();
    
    const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'tradicional-desglose.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            letterRendering: true,
            backgroundColor: '#ffffff'
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'landscape' 
        }
    };
    
    html2pdf().set(options).from(container).save();
}

// Event Listeners
agregarBtn.addEventListener('click', handleAgregar);
resetBtn.addEventListener('click', handleReset);
printBtn.addEventListener('click', handlePrint);
pdfBtn.addEventListener('click', handlePdf);

[anchoInput, altoInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAgregar();
    });
});