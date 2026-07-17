  /* ===================== COMPORTAMENTO (JS) =====================
     Aqui fica a lógica: dados, estado e as reações a clique. 
     O JS lê a estrutura (HTML) e aplica classes já definidas no CSS */

  // "Banco de dados" do painel. No SharePoint real, isso viria de
  // uma lista do SharePoint (via API REST) em vez de estar fixo aqui.
  const comunicados = [
    { id: 1, canal: 'email',    titulo: 'Nova política de envio', texto: 'A partir de agosto, o horário padrão de disparo muda para 8h.' },
    { id: 2, canal: 'whatsapp', titulo: 'Manutenção programada',   texto: 'O canal de WhatsApp ficará indisponível no sábado, das 2h às 4h.' },
    { id: 3, canal: 'intranet', titulo: 'Novo manual de marca',    texto: 'O guia de identidade visual atualizado já está disponível na intranet.' },
    { id: 4, canal: 'email',    titulo: 'Métricas do mês',         texto: 'O relatório de aberturas e cliques de julho já está na pasta compartilhada.' }
  ];

  // Estado: quais IDs já foram marcados como lidos e qual filtro está ativo
  let lidos = new Set();
  let filtroAtual = 'todos';

  const lista = document.getElementById('lista-comunicados');
  const resumo = document.getElementById('resumo');
  const filtros = document.getElementById('filtros');

  function renderizar() {
    lista.innerHTML = '';

    const visiveis = comunicados.filter(c => filtroAtual === 'todos' || c.canal === filtroAtual);

    visiveis.forEach(c => {
      const jaLido = lidos.has(c.id);

      const card = document.createElement('div');
      card.className = 'comunicado';
      card.innerHTML = `
        <span class="tag">${c.canal}</span>
        <h3>${c.titulo}</h3>
        <p>${c.texto}</p>
        <button class="marcar-lido ${jaLido ? 'lido' : ''}" data-id="${c.id}">
          ${jaLido ? '✓ Lido' : 'Marcar como lido'}
        </button>
      `;
      lista.appendChild(card);
    });

    // Reação ao clique: liga o botão recém-criado ao estado
    lista.querySelectorAll('.marcar-lido').forEach(botao => {
      botao.addEventListener('click', () => {
        const id = Number(botao.dataset.id);
        if (lidos.has(id)) {
          lidos.delete(id);
        } else {
          lidos.add(id);
        }
        renderizar();
      });
    });

    resumo.innerHTML = `<strong>${lidos.size}</strong> de <strong>${comunicados.length}</strong> comunicados lidos.`;
  }

  // Reação ao clique nos filtros
  filtros.querySelectorAll('.filtro').forEach(botao => {
    botao.addEventListener('click', () => {
      filtroAtual = botao.dataset.canal;
      filtros.querySelectorAll('.filtro').forEach(b => b.classList.remove('ativo'));
      botao.classList.add('ativo');
      renderizar();
    });
  });

  renderizar();