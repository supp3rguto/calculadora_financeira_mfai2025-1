import { showError, formatResult, harmonizarTempo, harmonizarTempoReverso } from './utils.js';

export function initializeSimpleInterestListeners() {
    const s_resultDiv = 's-resultado';

    document.getElementById('s-calcVf').addEventListener('click', () => {
        const vp = parseFloat(document.getElementById('s-vp').value), i = parseFloat(document.getElementById('s-taxa').value) / 100, n = parseFloat(document.getElementById('s-tempo').value);
        if (!vp || !i || !n) { showError(s_resultDiv, 'Preencha VP, Taxa e Tempo.'); return; }
        const n_harmonizado = harmonizarTempo(n, document.getElementById('s-tempoUnidade').value, document.getElementById('s-taxaUnidade').value);
        formatResult(s_resultDiv, 'Valor Futuro (VF)', vp * (1 + i * n_harmonizado));
    });

    document.getElementById('s-calcVp').addEventListener('click', () => {
        const vf = parseFloat(document.getElementById('s-vf').value), i = parseFloat(document.getElementById('s-taxa').value) / 100, n = parseFloat(document.getElementById('s-tempo').value);
        if (!vf || !i || !n) { showError(s_resultDiv, 'Preencha VF, Taxa e Tempo.'); return; }
        const n_harmonizado = harmonizarTempo(n, document.getElementById('s-tempoUnidade').value, document.getElementById('s-taxaUnidade').value);
        formatResult(s_resultDiv, 'Valor Presente (VP)', vf / (1 + i * n_harmonizado));
    });

    document.getElementById('s-calcJuros').addEventListener('click', () => {
        const vp = parseFloat(document.getElementById('s-vp').value);
        const vf = parseFloat(document.getElementById('s-vf').value);
        const i = parseFloat(document.getElementById('s-taxa').value) / 100;
        const n = parseFloat(document.getElementById('s-tempo').value);

        if (vp && vf) {
            formatResult(s_resultDiv, 'Juros (J)', vf - vp);
        } else if (vp && i > 0 && n > 0) {
            const n_harmonizado = harmonizarTempo(n, document.getElementById('s-tempoUnidade').value, document.getElementById('s-taxaUnidade').value);
            const juros = vp * i * n_harmonizado;
            formatResult(s_resultDiv, 'Juros (J)', juros);
        } else {
            showError(s_resultDiv, 'Para Juros, preencha (VP e VF) ou (VP, Taxa e Tempo).');
        }
    });

    document.getElementById('s-calcTaxa').addEventListener('click', () => {
        const vp = parseFloat(document.getElementById('s-vp').value), juros = parseFloat(document.getElementById('s-juros').value), n = parseFloat(document.getElementById('s-tempo').value);
        if (!vp || !juros || !n) { showError(s_resultDiv, 'Preencha VP, Juros e Tempo.'); return; }
        const n_harmonizado = harmonizarTempo(n, document.getElementById('s-tempoUnidade').value, document.getElementById('s-taxaUnidade').value);
        const i = juros / (vp * n_harmonizado);
        formatResult(s_resultDiv, 'Taxa de Juros (i)', i, `a.${document.getElementById('s-taxaUnidade').value}`);
    });

    document.getElementById('s-calcTempo').addEventListener('click', () => {
        const vp = parseFloat(document.getElementById('s-vp').value), juros = parseFloat(document.getElementById('s-juros').value), i = parseFloat(document.getElementById('s-taxa').value) / 100;
        if (!vp || !juros || !i) { showError(s_resultDiv, 'Preencha VP, Juros e Taxa.'); return; }
        const n_calculado = juros / (vp * i);
        const n_final = harmonizarTempoReverso(n_calculado, document.getElementById('s-taxaUnidade').value, document.getElementById('s-tempoUnidade').value);
        formatResult(s_resultDiv, 'Tempo (n)', n_final, document.getElementById('s-tempoUnidade').value);
    });

    document.getElementById('calcTaxaEfetivaSimples').addEventListener('click', () => {
        const ic = parseFloat(document.getElementById('d-taxa').value) / 100, n = parseFloat(document.getElementById('d-tempo').value);
        if (!ic || !n) { showError('d-resultado', 'Preencha Taxa e Tempo.'); return; }
        document.getElementById('d-resultado').innerHTML = `Taxa Efetiva: ${((ic / (1 - ic * n)) * 100).toFixed(4).replace('.', ',')}%`;
    });

    document.getElementById('calcTaxaComercial').addEventListener('click', () => {
        const i = parseFloat(document.getElementById('d-taxa').value) / 100, n = parseFloat(document.getElementById('d-tempo').value);
        if (!i || !n) { showError('d-resultado', 'Preencha Taxa e Tempo.'); return; }
        document.getElementById('d-resultado').innerHTML = `Desconto: ${((i / (1 + i * n)) * 100).toFixed(4).replace('.', ',')}%`;
    });
}