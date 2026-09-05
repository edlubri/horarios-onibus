let linhas = [];
const list = document.querySelector('#linhas');
const busca = document.querySelector('#busca');
const contador = document.querySelector('#contador');
const erro = document.querySelector('#erro');

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, c => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    "'":'&#39;',
    '"':'&quot;'
  }[c]));
}

function render(filtro = '') {
  const q = filtro.trim().toLowerCase();

  const encontrados = linhas.filter(l =>
    `${l.codigo} ${l.titulo} ${l.trajeto}`.toLowerCase().includes(q)
  );

  contador.textContent = '';

  list.innerHTML = encontrados.map(l => `
    <a class="line-card" href="linha.html?id=${encodeURIComponent(l.id)}">
      <div class="line-info">
        <strong>
          <span class="line-number">${escapeHtml(l.codigo)}</span>
          ${escapeHtml(l.titulo.replace(/^Linha\s+\d+\s*[-â€“]?\s*/i, ''))}
        </strong>
        <span>${escapeHtml(l.dias)}</span>
      </div>
    </a>
  `).join('') || '<p class="empty">Nenhuma linha encontrada.</p>';
}

fetch('data/linhas.json')
  .then(r => {
    if (!r.ok) throw new Error('Não foi possível carregar os dados.');
    return r.json();
  })
  .then(data => {
    linhas = data.linhas || [];
    render();
  })
  .catch(e => {
    erro.hidden = false;
    erro.textContent = e.message;
  });

busca.addEventListener('input', e => render(e.target.value));
