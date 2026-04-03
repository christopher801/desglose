// app.js
import Calculator from './engine/calculator.js';
import FractionUtils from './utils/fraction.js';
import P92 from './ventanas/p-92.js';
import P65 from './ventanas/p-65.js';
import PuertaComercial from './puertas/puerta-comercial.js';

// DOM Elements
const huecoInput = document.getElementById('hueco');
const productoSelect = document.getElementById('producto');
const hojasGroup = document.getElementById('hojasGroup');
const hojasSelect = document.getElementById('hojas');
const hojasLabel = document.getElementById('hojasLabel');
const anchoInput = document.getElementById('ancho');
const altoInput = document.getElementById('alto');
const agregarBtn = document.getElementById('agregarBtn');
const resetBtn = document.getElementById('resetBtn');
const printBtn = document.getElementById('printBtn');
const pdfBtn = document.getElementById('pdfBtn');
const tableBody = document.getElementById('tableBody');
const printFooter = document.getElementById('printFooter');
const tableTitle = document.getElementById('tableTitle');

let currentHueco = 1;

// Map of product calculators
const productCalculators = {
    'P92': P92.calcular,
    'P65': P65.calcular,
    'PUERTA': PuertaComercial.calcular
};

/**
 * Update hojas options based on selected product type
 */
function updateHojasOptions() {
    const producto = productoSelect.value;
    
    // Clear current options
    hojasSelect.innerHTML = '';
    
    if (producto === 'PUERTA') {
        // Doors: only 1 or 2 hojas
        hojasLabel.textContent = 'HOJAS (puerta)';
        
        const option1 = document.createElement('option');
        option1.value = '1';
        option1.textContent = '1 HOJA (Simple)';
        hojasSelect.appendChild(option1);
        
        const option2 = document.createElement('option');
        option2.value = '2';
        option2.textContent = '2 HOJAS (Doble)';
        hojasSelect.appendChild(option2);
        
        tableTitle.textContent = 'PUERTA COMERCIAL TRADICIONAL';
    } else {
        // Windows: 2, 3, or 4 hojas
        hojasLabel.textContent = 'HOJAS';
        
        const option2 = document.createElement('option');
        option2.value = '2';
        option2.textContent = '2 HOJAS';
        hojasSelect.appendChild(option2);
        
        const option3 = document.createElement('option');
        option3.value = '3';
        option3.textContent = '3 HOJAS';
        hojasSelect.appendChild(option3);
        
        const option4 = document.createElement('option');
        option4.value = '4';
        option4.textContent = '4 HOJAS';
        hojasSelect.appendChild(option4);
        
        tableTitle.textContent = `VENTANA ${producto}`;
    }
}

/**
 * Get the appropriate calculator based on selected product
 */
function getCalculator() {
    const producto = productoSelect.value;
    return productCalculators[producto];
}

/**
 * Renders the cutting table from accumulated data
 */
function renderTable() {
    const rows = Calculator.getRows();
    
    if (rows.length === 0) {
        tableBody.innerHTML = `<tr class="empty-row"><td colspan="12">— Antre mezi yo epi klike AGREGAR —</td></tr>`;
        return;
    }
    
    let html = '';
    rows.forEach(row => {
        // Format each value with proper spacing
        const anchoFmt = row.ancho.includes(' ') ? row.ancho.replace(' ', ' ') : row.ancho + '  ';
        const altoFmt = row.alto.includes(' ') ? row.alto.replace(' ', ' ') : row.alto + '  ';
        
        // Format hojas display
        let hojasDisplay = '';
        if (row.producto === 'PUERTA') {
            hojasDisplay = row.hojas === 1 ? '1 (Simple)' : '2 (Doble)';
        } else {
            hojasDisplay = `${row.hojas} hojas`;
        }
        
        html += `
            <tr>
                <td>${row.hueco}</td>
                <td>${row.producto === 'PUERTA' ? 'PUERTA' : row.producto}</td>
                <td>${hojasDisplay}</td>
                <td>${anchoFmt}</td>
                <td>${altoFmt}</td>
                <td>${row.cabAlf}</td>
                <td>${row.jambas}</td>
                <td>${row.cabRiel}</td>
                <td>${row.latMarco}</td>
                <td>${row.vidrioAncho}</td>
                <td>${row.vidrioAlto}</td>
                <td>${row.vidrioMedio || '   '}</td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

/**
 * Handles the AGREGAR button click
 */
function handleAgregar() {
    try {
        const hueco = parseInt(huecoInput.value, 10) || currentHueco;
        const producto = productoSelect.value;
        const anchoRaw = anchoInput.value.trim();
        const altoRaw = altoInput.value.trim();
        const hojas = parseInt(hojasSelect.value, 10);
        
        console.log('Agregar clicked:', { hueco, producto, anchoRaw, altoRaw, hojas });
        
        if (!anchoRaw) {
            alert('Antre ANCHO (egzanp: 39 7/8)');
            anchoInput.focus();
            return;
        }
        
        if (!altoRaw) {
            alert('Antre ALTO (egzanp: 85 3/4)');
            altoInput.focus();
            return;
        }
        
        const anchoDec = FractionUtils.parseFraction(anchoRaw);
        const altoDec = FractionUtils.parseFraction(altoRaw);
        
        if (anchoDec <= 0 || altoDec <= 0) {
            alert('Mezi yo dwe pi gran pase 0');
            return;
        }
        
        // Validate hojas for doors
        if (producto === 'PUERTA' && (hojas < 1 || hojas > 2)) {
            alert('Pou puerta, hojas dwe 1 (simple) oswa 2 (doble)');
            return;
        }
        
        // Get the correct calculator for selected product
        const calculator = getCalculator();
        console.log('Using calculator:', calculator);
        
        // Calculate parts
        const parts = Calculator.calculateItem(
            hueco,
            producto,
            anchoRaw,
            altoRaw,
            anchoDec,
            altoDec,
            hojas,
            calculator
        );
        
        console.log('Calculated parts:', parts);
        
        if (!parts) {
            alert('Erè nan kalkil la. Tcheke konsol la.');
            return;
        }
        
        Calculator.addItem(parts);
        renderTable();
        
        // Increment hueco for next item
        currentHueco = hueco + 1;
        huecoInput.value = currentHueco;
        anchoInput.value = '';
        altoInput.value = '';
        
        const now = new Date();
        const productDisplay = producto === 'PUERTA' ? 'PUERTA' : producto;
        printFooter.textContent = `Dokiman kreye: ${now.toLocaleDateString()} - DESGLOSE ${productDisplay}`;
        
    } catch (error) {
        console.error('Error in handleAgregar:', error);
        alert('Fòma mezi pa bon. Itilize fòma tankou: 39 7/8');
    }
}

/**
 * Handles the RESET button click
 */
function handleReset() {
    Calculator.reset();
    renderTable();
    
    currentHueco = 1;
    huecoInput.value = '1';
    productoSelect.value = 'P65';
    anchoInput.value = '';
    altoInput.value = '';
    
    updateHojasOptions();
    printFooter.textContent = '';
}

/**
 * Handles product change
 */
function handleProductChange() {
    updateHojasOptions();
}

/**
 * Handles the PRINT button click
 */
function handlePrint() {
    const rows = Calculator.getRows();
    if (rows.length === 0) {
        alert('Pa gen done pou enprime. Antre mezi ou an premye.');
        return;
    }
    
    const now = new Date();
    printFooter.textContent = `DESGLOSE - ${now.toLocaleDateString()}`;
    window.print();
}

/**
 * Handles the EXPORT PDF button click
 */
function handlePdf() {
    const rows = Calculator.getRows();
    if (rows.length === 0) {
        alert('Pa gen done pou ekspòte. Antre mezi ou an premye.');
        return;
    }
    
    const element = document.querySelector('.container');
    const clone = element.cloneNode(true);
    
    const inputCard = clone.querySelector('.input-card');
    if (inputCard) inputCard.remove();
    
    const now = new Date();
    const footerDiv = document.createElement('div');
    footerDiv.style.textAlign = 'right';
    footerDiv.style.marginTop = '2rem';
    footerDiv.style.fontSize = '0.9rem';
    footerDiv.style.color = '#333';
    footerDiv.style.borderTop = '1px solid #ccc';
    footerDiv.style.paddingTop = '1rem';
    footerDiv.innerHTML = `
        <strong>DESGLOSE VENTANAS Y PUERTAS</strong><br>
        Dat: ${now.toLocaleDateString()} | Atelye D'Aliminyòm
    `;
    clone.appendChild(footerDiv);
    
    const options = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'desglose-completo.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' }
    };
    
    html2pdf().set(options).from(clone).save();
}

// Event Listeners
agregarBtn.addEventListener('click', handleAgregar);
resetBtn.addEventListener('click', handleReset);
productoSelect.addEventListener('change', handleProductChange);
printBtn.addEventListener('click', handlePrint);
pdfBtn.addEventListener('click', handlePdf);

[anchoInput, altoInput].forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAgregar();
        }
    });
});

// Initialize
updateHojasOptions();
renderTable();

// Pour debug - expose Calculator to window
window.Calculator = Calculator;