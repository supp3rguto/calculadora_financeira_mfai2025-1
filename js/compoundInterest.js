import { showError, formatResult, harmonizarTempo, harmonizarTempoReverso } from './utils.js';

export function initializeCompoundInterestListeners() {
    const c_resultDiv = 'c-resultado';

    document.getElementById('c-calcVf').addEventListener('click', () => {
        const vp = parseFloat(document.getElementById('c-vp').value), i = parseFloat(document.getElementById('c-taxa').value) / 100, n = parseFloat(document.getElementById('c-tempo').value);
        if (!vp || !i || !n) { showError(c_resultDiv, 'Preencha VP, Taxa e Tempo.'); return; }
        const n_harmonizado = harmonizarTempo(n, document.getElementById('c-tempoUnidade').value, document.getElementById('c-taxaUnidade').value);
        formatResult(c_resultDiv, 'Valor Futuro (VF)', vp * Math.pow((1 + i), n_harmonizado));
    });

    document.getElementById('c-calcVp').addEventListener('click', () => {
        const vf = parseFloat(document.getElementById('c-vf').value), i = parseFloat(document.getElementById('c-taxa').value) / 100, n = parseFloat(document.getElementById('c-tempo').value);
        if (!vf || !i || !n) { showError(c_resultDiv, 'Preencha VF, Taxa e Tempo.'); return; }
        const n_harmonizado = harmonizarTempo(n, document.getElementById('c-tempoUnidade').value, document.getElementById('c-taxaUnidade').value);
        formatResult(c_resultDiv, 'Valor Presente (VP)', vf / Math.pow((1 + i), n_harmonizado));
    });

    document.getElementById('c-calcJuros').addEventListener('click', () => {
        const vp = parseFloat(document.getElementById('c-vp').value);
        const vf = parseFloat(document.getElementById('c-vf').value);
        const i = parseFloat(document.getElementById('c-taxa').value) / 100;
        const n = parseFloat(document.getElementById('c-tempo').value);

        if (vp && vf) {
            formatResult(c_resultDiv, 'Juros (J)', vf - vp);
        } else if (vp && i > 0 && n > 0) {
            const n_harmonizado = harmonizarTempo(n, document.getElementById('c-tempoUnidade').value, document.getElementById('c-taxaUnidade').value);
            const juros = vp * (Math.pow(1 + i, n_harmonizado) - 1);
            formatResult(c_resultDiv, 'Juros (J)', juros);
        } else {
            showError(c_resultDiv, 'Para Juros, preencha (VP e VF) ou (VP, Taxa e Tempo).');
        }
    });

    document.getElementById('c-calcTaxa').addEventListener('click', () => {
        const vp = parseFloat(document.getElementById('c-vp').value), vf = parseFloat(document.getElementById('c-vf').value), n = parseFloat(document.getElementById('c-tempo').value);
        if (!vp || !vf || !n) { showError(c_resultDiv, 'Preencha VP, VF e Tempo.'); return; }
        const n_harmonizado = harmonizarTempo(n, document.getElementById('c-tempoUnidade').value, document.getElementById('c-taxaUnidade').value);
        const i = Math.pow((vf / vp), (1 / n_harmonizado)) - 1;
        formatResult(c_resultDiv, 'Taxa de Juros (i)', i, `a.${document.getElementById('c-taxaUnidade').value}`);
    });

    document.getElementById('c-calcTempo').addEventListener('click', () => {
        const vp = parseFloat(document.getElementById('c-vp').value), vf = parseFloat(document.getElementById('c-vf').value), i = parseFloat(document.getElementById('c-taxa').value) / 100;
        if (!vp || !vf || !i) { showError(c_resultDiv, 'Preencha VP, VF e Taxa.'); return; }
        const n_calculado = Math.log(vf / vp) / Math.log(1 + i);
        const n_final = harmonizarTempoReverso(n_calculado, document.getElementById('c-taxaUnidade').value, document.getElementById('c-tempoUnidade').value);
        formatResult(c_resultDiv, 'Tempo (n)', n_final, document.getElementById('c-tempoUnidade').value);
    });
}