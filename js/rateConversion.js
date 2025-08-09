export function initializeRateConversionListeners() {
    document.getElementById('conv-calcTaxaEfetiva').addEventListener('click', () => {
        const taxaNominal = parseFloat(document.getElementById('taxaNominal').value);
        const periodo = parseInt(document.getElementById('periodoNominal').value);
        const resultDiv = document.getElementById('conv-resultadoEfetiva');
        if(!taxaNominal) { resultDiv.innerHTML = `<p class="text-red-500">Insira a taxa nominal.</p>`; return; }
        const taxaEfetiva = (taxaNominal / 100) / periodo;
        const periodoLabel = document.getElementById('periodoNominal').options[document.getElementById('periodoNominal').selectedIndex].text.toLowerCase();
        resultDiv.innerHTML = `Taxa Efetiva: ${(taxaEfetiva * 100).toFixed(4).replace('.',',')}% ${periodoLabel}`;
    });
    
    document.getElementById('conv-calcTaxaEquivalente').addEventListener('click', () => {
        const taxa = parseFloat(document.getElementById('taxaEquivalente').value);
        const periodoAtual = document.getElementById('periodoAtual').value;
        const periodoDesejado = document.getElementById('periodoDesejado').value;
        const resultDiv = document.getElementById('conv-resultadoEquivalente');
        if(!taxa) { resultDiv.innerHTML = `<p class="text-red-500">Insira a taxa.</p>`; return; }
        
        // CORREÇÃO 4: Lógica do calendário alterada para comercial (30/360)
        const periodosEmDias = { dia: 1, mes: 30, trimestre: 90, semestre: 180, ano: 360 };

        const i = taxa / 100;
        const n1 = periodosEmDias[periodoDesejado];
        const n2 = periodosEmDias[periodoAtual];
        const taxaEquivalente = (Math.pow(1 + i, n1 / n2) - 1) * 100;
        const periodoLabel = document.getElementById('periodoDesejado').options[document.getElementById('periodoDesejado').selectedIndex].text.toLowerCase();
        resultDiv.innerHTML = `Taxa Equivalente: ${taxaEquivalente.toFixed(4).replace('.',',')}% ${periodoLabel}`;
    });
}