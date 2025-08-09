export function initializeRateConversionListeners() {
    // Cálculo de Nominal para Efetiva
    document.getElementById('conv-calcTaxaEfetiva').addEventListener('click', () => {
        const taxaNominal = parseFloat(document.getElementById('taxaNominal').value);
        const periodo = parseInt(document.getElementById('periodoNominal').value);
        const resultDiv = document.getElementById('conv-resultadoEfetiva');
        
        if (!taxaNominal || !periodo) {
            resultDiv.innerHTML = `<p class="text-red-500">Insira a taxa nominal.</p>`;
            return;
        }

        const taxaEfetiva = (taxaNominal / 100) / periodo;
        const periodoLabel = document.getElementById('periodoNominal').options[document.getElementById('periodoNominal').selectedIndex].text.toLowerCase();
        
        resultDiv.innerHTML = `Taxa Efetiva: <span class="text-blue-600">${(taxaEfetiva * 100).toFixed(4).replace('.', ',')}%</span> ao ${periodoLabel}`;
    });

    document.getElementById('conv-calcTaxaNominal').addEventListener('click', () => {
        const taxaEfetiva = parseFloat(document.getElementById('taxaEfetiva').value);
        const periodo = parseInt(document.getElementById('periodoEfetivo').value);
        const resultDiv = document.getElementById('conv-resultadoEfetiva');

        if (!taxaEfetiva || !periodo) {
            resultDiv.innerHTML = `<p class="text-red-500">Insira a taxa efetiva.</p>`;
            return;
        }

        const taxaNominal = (taxaEfetiva / 100) * periodo;
        const periodoLabel = document.getElementById('periodoEfetivo').options[document.getElementById('periodoEfetivo').selectedIndex].text.toLowerCase();
        
        resultDiv.innerHTML = `Taxa Nominal: <span class="text-cyan-600">${(taxaNominal * 100).toFixed(2).replace('.', ',')}%</span> a.a. (cap. ${periodoLabel})`;
    });
    
    document.getElementById('conv-calcTaxaEquivalente').addEventListener('click', () => {
        const taxa = parseFloat(document.getElementById('taxaEquivalente').value);
        const periodoAtual = document.getElementById('periodoAtual').value;
        const periodoDesejado = document.getElementById('periodoDesejado').value;
        const resultDiv = document.getElementById('conv-resultadoEquivalente');

        if (!taxa) {
            resultDiv.innerHTML = `<p class="text-red-500">Insira a taxa.</p>`;
            return;
        }
        
        const periodosEmDias = { dia: 1, mes: 30, trimestre: 90, semestre: 180, ano: 360 };

        const i = taxa / 100;
        const n1 = periodosEmDias[periodoDesejado];
        const n2 = periodosEmDias[periodoAtual];
        const taxaEquivalente = (Math.pow(1 + i, n1 / n2) - 1) * 100;
        const periodoLabel = document.getElementById('periodoDesejado').options[document.getElementById('periodoDesejado').selectedIndex].text.toLowerCase();
        
        resultDiv.innerHTML = `Taxa Equivalente: <span class="text-green-600">${taxaEquivalente.toFixed(4).replace('.', ',')}%</span> ao ${periodoLabel}`;
    });
}