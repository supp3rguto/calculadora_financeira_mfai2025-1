import { showError, formatResult } from './utils.js';

export function initializeAmortizationVplListeners() {
    document.getElementById('calc-amortizacao').addEventListener('click', () => {
        const vp = parseFloat(document.getElementById('amort-vp').value);
        const i = parseFloat(document.getElementById('amort-taxa').value) / 100;
        const n = parseInt(document.getElementById('amort-tempo').value);
        const resultDiv = document.getElementById('amort-resultado');

        if (!vp || !i || !n || vp <= 0 || i <= 0 || n <= 0) {
            showError(resultDiv.id, 'Preencha todos os campos com valores positivos.');
            return;
        }

        const pmt = vp * ( (i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1) );

        let saldoDevedor = vp;
        let tabelaHTML = `<div class="overflow-x-auto"><table class="min-w-full divide-y divide-gray-200 border">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Período</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Prestação</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Juros</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amortização</th>
                    <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Saldo Devedor</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">`;

        for (let periodo = 1; periodo <= n; periodo++) {
            const juros = saldoDevedor * i;
            const amortizacao = pmt - juros;
            saldoDevedor -= amortizacao;

            if (periodo === n) {
                saldoDevedor = 0;
            }

            tabelaHTML += `
                <tr>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">${periodo}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">${pmt.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">${juros.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm">${amortizacao.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm font-semibold">${saldoDevedor.toLocaleString('pt-BR', {style:'currency', currency: 'BRL'})}</td>
                </tr>`;
        }

        tabelaHTML += `</tbody></table></div>`;
        resultDiv.innerHTML = tabelaHTML;
    });

    document.getElementById('calc-vpl').addEventListener('click', () => {
        const investimento = parseFloat(document.getElementById('vpl-investimento').value);
        const taxa = parseFloat(document.getElementById('vpl-taxa').value) / 100;
        const fluxosStr = document.getElementById('vpl-fluxos').value;
        const valorResidual = parseFloat(document.getElementById('vpl-residual').value) || 0;
        const periodoResidual = parseInt(document.getElementById('vpl-periodo-residual').value) || 0;
        const resultDiv = document.getElementById('vpl-resultado');

        if (isNaN(investimento) || isNaN(taxa) || !fluxosStr) {
            showError(resultDiv.id, 'Preencha Investimento, Taxa e Fluxos de Caixa.');
            return;
        }
        
        const fluxos = fluxosStr.split(/[\n,;]+/).map(val => parseFloat(val.trim())).filter(val => !isNaN(val));

        if(fluxos.length === 0) {
            showError(resultDiv.id, 'Formato dos fluxos de caixa inválido.');
            return;
        }

        let vpl = -investimento;

        fluxos.forEach((fluxo, index) => {
            const periodo = index + 1;
            vpl += fluxo / Math.pow(1 + taxa, periodo);
        });

        if (valorResidual > 0 && periodoResidual > 0) {
             vpl += valorResidual / Math.pow(1 + taxa, periodoResidual);
        }

        formatResult(resultDiv.id, 'Valor Presente Líquido (VPL)', vpl);
    });
}