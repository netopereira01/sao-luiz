// Dados iniciais
const estoque = {
  algodao: { quantidade: 100, minimo: 100, preco: 5, consumido: 0 },
  mortalhas: { quantidade: 100, minimo: 100, preco: 10, consumido: 0 },
  caixao: { quantidade: 100, minimo: 100, preco: 100, consumido: 0 },
};

// Função para trocar abas
function switchTab(tabId) {
  document.querySelectorAll('.content').forEach((tab) => {
    tab.classList.add('hidden');
  });
  document.getElementById(tabId).classList.remove('hidden');
  if (tabId === 'reposicao') {
    verificarReposicao();
  }
}

// Função para salvar o gráfico como imagem
function salvarGrafico() {
  const canvas = document.getElementById('graficoConsumo');
  const link = document.createElement('a');
  link.download = 'grafico_consumo.png'; // Nome do arquivo
  link.href = canvas.toDataURL(); // Converte o canvas em URL
  link.click(); // Simula o clique para baixar
}

// Função para usar um item
function usarAlgodao() {
  atualizarEstoque('algodao', -1);
}

function usarMortalha() {
  atualizarEstoque('mortalhas', -1);
}

function usarCaixoes() {
  atualizarEstoque('caixao', -1);
}

// Atualizar estoque e validar valores
function atualizarEstoque(item, quantidade) {
  const itemData = estoque[item];
  if (itemData.quantidade + quantidade < 0) {
    alert(`Estoque de ${item} insuficiente!`);
    return;
  }
  itemData.quantidade += quantidade;
  if (quantidade < 0) {
    itemData.consumido += Math.abs(quantidade);
  }
  document.getElementById(`Estoque-${item}`).textContent = itemData.quantidade;
  atualizarGraficos();
}

// Alterar estoque manualmente
function alterarEstoque(spanId, inputId) {
  const novaQuantidade = parseInt(document.getElementById(inputId).value);
  if (isNaN(novaQuantidade) || novaQuantidade < 0) {
    alert('Por favor, insira uma quantidade válida.');
    return;
  }
  const item = spanId.split('-')[1];
  estoque[item].quantidade = novaQuantidade;
  document.getElementById(spanId).textContent = novaQuantidade;
  atualizarGraficos();
}

// Verificar itens para reposição
function verificarReposicao() {
  const listaReposicao = document.getElementById('lista-reposicao');
  listaReposicao.innerHTML = ''; // Limpa a lista
  let custoTotal = 0;

  for (const item in estoque) {
    const itemData = estoque[item];
    if (itemData.quantidade < itemData.minimo) {
      const reposicaoNecessaria = itemData.minimo - itemData.quantidade;
      custoTotal += reposicaoNecessaria * itemData.preco;

      const li = document.createElement('li');
      li.textContent = `${item.charAt(0).toUpperCase() + item.slice(1)}: Faltam ${reposicaoNecessaria} unidades`;
      listaReposicao.appendChild(li);
    }
  }

  document.getElementById('custo-total').textContent = custoTotal.toFixed(2);
}

// Gráficos com Chart.js
let graficoConsumo;

function criarGraficos() {
  const ctx = document.getElementById('graficoConsumo').getContext('2d');
  graficoConsumo = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Algodão', 'Mortalhas', 'Caixão'],
      datasets: [
        {
          label: 'Estoque Atual',
          data: [
            estoque.algodao.quantidade,
            estoque.mortalhas.quantidade,
            estoque.caixao.quantidade,
          ],
          backgroundColor: ['#0056f5', '#00c853', '#f74'],
        },
        {
          label: 'Itens Consumidos',
          data: [
            estoque.algodao.consumido,
            estoque.mortalhas.consumido,
            estoque.caixao.consumido,
          ],
          backgroundColor: ['#f50057', '#ff9800', '#ff0000'],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          formatter: (value) => `${value} unidades`, // Exibe a quantidade consumida nas barras
          font: {
            weight: 'bold',
            size: 14,
          },
        },
      },
    },
    plugins: [ChartDataLabels], // Habilitar o plugin de datalabels
  });
}

function atualizarGraficos() {
  graficoConsumo.data.datasets[0].data = [
    estoque.algodao.quantidade,
    estoque.mortalhas.quantidade,
    estoque.caixao.quantidade,
  ];
  graficoConsumo.data.datasets[1].data = [
    estoque.algodao.consumido,
    estoque.mortalhas.consumido,
    estoque.caixao.consumido,
  ];
  graficoConsumo.update();
}

// Inicializar gráficos ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  criarGraficos();
});
