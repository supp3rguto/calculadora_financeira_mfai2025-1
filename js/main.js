import { initializeSimpleInterestListeners } from './simpleInterest.js';
import { initializeCompoundInterestListeners } from './compoundInterest.js';
import { initializeRateConversionListeners } from './rateConversion.js';

document.addEventListener('DOMContentLoaded', () => {
    generateAllTabsContent();
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
    });
    document.querySelector('.tab-content.active').style.display = 'block';
    attachEventListeners();
});

function generateAllTabsContent() {

    const createCapitalizationTabHTML = (type, title, formulasHTML) => {
        const prefix = type.slice(0, 1); // 's' ou 'c'
        return `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">${title}</h2>
                    <div class="space-y-4">
                        <div><label for="${prefix}-vp" class="block text-sm font-medium text-gray-600">Valor Presente (VP) - Capital</label><input type="number" id="${prefix}-vp" placeholder="Ex: 10000" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
                        <div><label for="${prefix}-vf" class="block text-sm font-medium text-gray-600">Valor Futuro (VF) - Montante</label><input type="number" id="${prefix}-vf" placeholder="Ex: 12000" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
                        <div><label for="${prefix}-juros" class="block text-sm font-medium text-gray-600">Juros (J)</label><input type="number" id="${prefix}-juros" placeholder="Ex: 2000" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label for="${prefix}-taxa" class="block text-sm font-medium text-gray-600">Taxa (i) (%)</label><input type="number" id="${prefix}-taxa" placeholder="Ex: 2.5" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
                            <div><label for="${prefix}-taxaUnidade" class="block text-sm font-medium text-gray-600">Unidade da Taxa</label><select id="${prefix}-taxaUnidade" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"><option value="mes">Ao Mês</option><option value="ano">Ao Ano</option><option value="dia">Ao Dia</option></select></div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label for="${prefix}-tempo" class="block text-sm font-medium text-gray-600">Tempo (n)</label><input type="number" id="${prefix}-tempo" placeholder="Ex: 12" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"></div>
                            <div><label for="${prefix}-tempoUnidade" class="block text-sm font-medium text-gray-600">Unidade do Tempo</label><select id="${prefix}-tempoUnidade" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"><option value="meses">Meses</option><option value="anos">Anos</option><option value="dias">Dias</option></select></div>
                        </div>
                    </div>
                </div>
                <div>
                    <h2 class="text-xl font-semibold mb-4 text-gray-700">Resultados</h2>
                    <div id="${prefix}-resultado" class="bg-gray-100 p-6 rounded-lg min-h-[200px] flex items-center justify-center"><p class="text-gray-500 text-center">Preencha os campos e clique em um botão para calcular.</p></div>
                    ${type === 'simples' ? `
                    <div class="p-4 border rounded-lg mt-6">
                        <h3 class="font-semibold text-lg mb-4 text-gray-700">Taxa de Desconto Comercial vs Efetiva</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div><label for="d-taxa" class="block text-sm font-medium text-gray-600">Taxa (%)</label><input type="number" id="d-taxa" placeholder="Ex: 5" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"></div>
                            <div><label for="d-tempo" class="block text-sm font-medium text-gray-600">Tempo (n)</label><input type="number" id="d-tempo" placeholder="Ex: 3" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"></div>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                            <button id="calcTaxaEfetivaSimples" class="p-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600">Calcular Taxa Efetiva (i)</button>
                            <button id="calcTaxaComercial" class="p-2 bg-green-500 text-white rounded-md text-sm hover:bg-green-600">Calcular Desconto (ic)</button>
                        </div>
                        <div id="d-resultado" class="mt-4 text-center font-semibold text-lg h-10"></div>
                    </div>` : ''}
                </div>
            </div>
            <div class="mt-8">
                <div class="grid grid-cols-2 lg:grid-cols-5 gap-4">
                    <button id="${prefix}-calcJuros" class="p-3 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600 transition">Calcular Juros</button>
                    <button id="${prefix}-calcVp" class="p-3 bg-green-500 text-white rounded-md shadow-sm hover:bg-green-600 transition">Calcular VP</button>
                    <button id="${prefix}-calcVf" class="p-3 bg-purple-500 text-white rounded-md shadow-sm hover:bg-purple-600 transition">Calcular VF</button>
                    <button id="${prefix}-calcTaxa" class="p-3 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600 transition">Calcular Taxa</button>
                    <button id="${prefix}-calcTempo" class="p-3 bg-teal-500 text-white rounded-md shadow-sm hover:bg-teal-600 transition">Calcular Tempo</button>
                </div>
            </div>
            <div class="mt-10 pt-6 border-t grid grid-cols-1 md:grid-cols-2 gap-8">
                <div><h3 class="font-semibold text-lg mb-2">Fórmulas Utilizadas (${title.split('de ')[1]})</h3><ul class="text-gray-600 space-y-1 text-sm">${formulasHTML}</ul></div>
                <div><h3 class="font-semibold text-lg mb-2">Instruções</h3><ul class="list-disc list-inside text-gray-600 space-y-1 text-sm"><li>Preencha os campos conhecidos para o cálculo desejado.</li><li>Deixe em branco o campo que deseja descobrir.</li><li>Escolha as unidades de tempo e taxa corretamente. O sistema as converte para a mesma base antes de calcular.</li><li>Clique no botão correspondente ao valor que deseja calcular.</li></ul></div>
            </div>
        `;
    };

    const formulasSimples = `
        <li><b>Juros (J):</b> \\( J = VP \\cdot i \\cdot n \\)</li>
        <li><b>Montante (VF):</b> \\( VF = VP \\cdot (1 + i \\cdot n) \\)</li>
        <li><b>Capital (VP):</b> \\( VP = \\frac{VF}{(1 + i \\cdot n)} \\)</li>
        <li><b>Taxa (i):</b> \\( i = \\frac{J}{VP \\cdot n} \\)</li>
        <li><b>Tempo (n):</b> \\( n = \\frac{J}{VP \\cdot i} \\)</li>
        <li><b>Taxa Efetiva (i):</b> \\( i = \\frac{i_c}{1 - i_c \\cdot n} \\)</li>
        <li><b>Desconto Comercial (ic):</b> \\( i_c = \\frac{i}{1 + i \\cdot n} \\)</li>
    `;
    
    const formulasComposto = `
        <li><b>Montante (VF):</b> \\( VF = VP \\cdot (1 + i)^n \\)</li>
        <li><b>Capital (VP):</b> \\( VP = \\frac{VF}{(1 + i)^n} \\)</li>
        <li><b>Juros (J) com VF:</b> \\( J = VF - VP \\)</li>
        <li><b>Juros (J) com VP:</b> \\( J = VP \\cdot [(1+i)^n - 1] \\)</li>
        <li><b>Taxa (i):</b> \\( i = \\left( \\frac{VF}{VP} \\right)^{1/n} - 1 \\)</li>
        <li><b>Tempo (n):</b> \\( n = \\frac{\\log(VF/VP)}{\\log(1+i)} \\)</li>
    `;

    const conversaoTabHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="p-4 border rounded-lg">
                <h3 class="font-semibold text-lg mb-4 text-gray-700">Conversão: Nominal <> Efetiva (J. Composto)</h3>

                <div class="space-y-4 p-4 border-b">
                    <p class="text-sm font-semibold text-gray-600">1. Descobrir a Taxa Efetiva/Proporcional</p>
                    <div><label for="taxaNominal" class="block text-sm font-medium text-gray-600">Taxa Nominal (anual, %)</label><input type="number" id="taxaNominal" placeholder="Ex: 24" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"></div>
                    <div><label for="periodoNominal" class="block text-sm font-medium text-gray-600">Capitalizada em Período</label><select id="periodoNominal" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"><option value="12">Mensal</option><option value="2">Semestral</option><option value="4">Trimestral</option><option value="360">Diária</option></select></div>
                    <button id="conv-calcTaxaEfetiva" class="w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Calcular Taxa Efetiva do Período</button>
                </div>

                <div class="space-y-4 p-4">
                    <p class="text-sm font-semibold text-gray-600">2. Descobrir a Taxa Nominal Anual</p>
                     <div><label for="taxaEfetiva" class="block text-sm font-medium text-gray-600">Taxa Efetiva do Período (%)</label><input type="number" id="taxaEfetiva" placeholder="Ex: 2" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"></div>
                     <div><label for="periodoEfetivo" class="block text-sm font-medium text-gray-600">Período da Taxa Efetiva</label><select id="periodoEfetivo" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"><option value="12">Mensal</option><option value="2">Semestral</option><option value="4">Trimestral</option><option value="360">Diária</option></select></div>
                     <button id="conv-calcTaxaNominal" class="w-full p-3 bg-cyan-500 text-white rounded-md hover:bg-cyan-600">Calcular Taxa Nominal Anual</button>
                </div>
                
                <div id="conv-resultadoEfetiva" class="mt-2 text-center font-semibold text-lg h-12 flex items-center justify-center"></div>
            </div>

            <div class="p-4 border rounded-lg">
                <h3 class="font-semibold text-lg mb-4">Taxas Equivalentes (J. Composto)</h3>
                <div class="space-y-4">
                    <div><label for="taxaEquivalente" class="block text-sm font-medium text-gray-600">Taxa (%)</label><input type="number" id="taxaEquivalente" placeholder="Ex: 2" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"></div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label for="periodoAtual" class="block text-sm font-medium text-gray-600">Período da Taxa</label><select id="periodoAtual" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"><option value="mes">Mensal</option><option value="ano">Anual</option><option value="semestre">Semestral</option><option value="trimestre">Trimestral</option><option value="dia">Diário</option></select></div>
                        <div><label for="periodoDesejado" class="block text-sm font-medium text-gray-600">Converter para</label><select id="periodoDesejado" class="mt-1 block w-full p-2 border border-gray-300 rounded-md"><option value="ano">Anual</option><option value="mes">Mensal</option><option value="semestre">Semestral</option><option value="trimestre">Trimestral</option><option value="dia">Diário</option></select></div>
                    </div>
                    <button id="conv-calcTaxaEquivalente" class="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600">Converter para Equivalente</button>
                    <div id="conv-resultadoEquivalente" class="mt-4 text-center font-semibold text-lg h-10"></div>
                </div>
            </div>
        </div>`;

    document.getElementById('content-simples').innerHTML = createCapitalizationTabHTML('simples', 'Cálculo de Juros Simples', formulasSimples);
    document.getElementById('content-composto').innerHTML = createCapitalizationTabHTML('composto', 'Cálculo de Juros Compostos', formulasComposto);
    document.getElementById('content-conversao').innerHTML = conversaoTabHTML;

    if (window.MathJax) {
        window.MathJax.typeset();
    }
}

function attachEventListeners() {
    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    initializeSimpleInterestListeners();
    initializeCompoundInterestListeners();
    initializeRateConversionListeners();
    
    document.getElementById('limpar-tudo').addEventListener('click', () => {
        document.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
        document.querySelectorAll('[id$="-resultado"]').forEach(div => {
            if (div.id.startsWith('d-') || div.id.startsWith('conv-')) {
                div.innerHTML = '';
            } else {
                div.innerHTML = '<p class="text-gray-500 text-center">Preencha os campos e clique em um botão para calcular.</p>';
            }
        });
    });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.display = 'none';
        content.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(`content-${tabId}`).style.display = 'block';
    document.getElementById(`content-${tabId}`).classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
}