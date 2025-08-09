export function formatResult(resultDivId, label, value, unit = '') {
    const resultDiv = document.getElementById(resultDivId);
    let formattedValue;
    if (typeof value === 'number') {
        if (label.toLowerCase().includes('taxa') || label.toLowerCase().includes('desconto')) {
            formattedValue = (value * 100).toFixed(4).replace('.', ',') + '%';
        } else if (label.toLowerCase().includes('tempo')) {
            formattedValue = value.toFixed(2).replace('.', ',');
        } else {
            formattedValue = value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        }
    } else {
        formattedValue = value;
    }
    resultDiv.innerHTML = `<div class="text-center"><p class="text-lg text-gray-600">${label}</p><p class="text-3xl font-bold text-blue-600">${formattedValue} ${unit}</p></div>`;
}

export function showError(resultDivId, message) {
    document.getElementById(resultDivId).innerHTML = `<p class="text-red-500 font-semibold text-center">${message}</p>`;
}

export function harmonizarTempo(tempo, tempoUnidade, taxaUnidade) {
    const conversao = {
        anos: { mes: 12, dia: 360 },
        meses: { ano: 1 / 12, dia: 30 },
        dias: { ano: 1 / 360, mes: 1 / 30 }
    };
    const tempoUnidadeSingular = tempoUnidade.endsWith('s') ? tempoUnidade.slice(0, -1) : tempoUnidade;

    if (tempoUnidadeSingular === taxaUnidade) return tempo;

    return (conversao[tempoUnidade] && conversao[tempoUnidade][taxaUnidade]) ? tempo * conversao[tempoUnidade][taxaUnidade] : tempo;
}

export function harmonizarTempoReverso(tempo, taxaUnidade, tempoUnidade) {
    const conversao = {
        ano: { meses: 12, dias: 360 },
        mes: { anos: 1 / 12, dias: 30 },
        dia: { anos: 1 / 360, meses: 1 / 30 }
    };

    const tempoUnidadeSingular = tempoUnidade.endsWith('s') ? tempoUnidade.slice(0, -1) : tempoUnidade;
    if (taxaUnidade === tempoUnidadeSingular) return tempo;

    return (conversao[taxaUnidade] && conversao[taxaUnidade][tempoUnidade]) ? tempo * conversao[taxaUnidade][tempoUnidade] : tempo;
}