(function () {
  const select = (selector) => document.querySelector(selector);
  const selectAll = (selector) => Array.from(document.querySelectorAll(selector));
  const statusEl = select('#rank-status');
  const headEl = select('#rank-head');
  const bodyEl = select('#rank-body');
  const tabButtons = selectAll('.tab[data-type]');

  if (!headEl || !bodyEl || !statusEl || !tabButtons.length) {
    return;
  }

  const templates = {
    ranking: `<tr>
      <th class="px-4 py-3">#</th>
      <th class="px-4 py-3">Nhân vật</th>
      <th class="px-4 py-3">Level</th>
      <th class="px-4 py-3">Reset</th>
      <th class="px-4 py-3">Master</th>
      <th class="px-4 py-3">Guild</th>
      <th class="px-4 py-3">Trạng thái</th>
    </tr>`,
    guild: `<tr>
      <th class="px-4 py-3">#</th>
      <th class="px-4 py-3">Guild</th>
      <th class="px-4 py-3">Guild Master</th>
      <th class="px-4 py-3">Điểm cống hiến</th>
      <th class="px-4 py-3">Thành viên</th>
      <th class="px-4 py-3">Điểm</th>
    </tr>`,
    boss: `<tr>
      <th class="px-4 py-3">#</th>
      <th class="px-4 py-3">Nhân vật</th>
      <th class="px-4 py-3">Số Boss</th>
      <th class="px-4 py-3">Điểm</th>
    </tr>`
  };

  const escapeHtml = (value = '') =>
    value.toString().replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[char] || char);

  const renderHead = (type) => {
    headEl.innerHTML = templates[type] || '';
  };

  const renderEmpty = (message) => {
    bodyEl.innerHTML = `<tr><td class="px-4 py-6" colspan="7">${message}</td></tr>`;
  };

  const fetchRankings = async (type) => {
    const url = new URL('/api.php', window.location.origin);
    url.searchParams.set('action', 'rankings');
    url.searchParams.set('type', type);

    const response = await fetch(url.toString());
    return response.json();
  };

  const renderRows = (type, rows) => {
    bodyEl.innerHTML = rows
      .map((row, index) => {
        if (type === 'ranking') {
          return `<tr class="border-t border-white/5">
            <td class="px-4 py-3">${row.ranking ?? index + 1}</td>
            <td class="px-4 py-3">${escapeHtml(row.name)}</td>
            <td class="px-4 py-3">${row.level ?? ''}</td>
            <td class="px-4 py-3">${row.reset ?? ''}</td>
            <td class="px-4 py-3">${row.master_reset ?? ''}</td>
            <td class="px-4 py-3">${escapeHtml(row.guild || '')}</td>
            <td class="px-4 py-3">${escapeHtml(row.status || '')}</td>
          </tr>`;
        }

        if (type === 'guild') {
          return `<tr class="border-t border-white/5">
            <td class="px-4 py-3">${row.ranking ?? index + 1}</td>
            <td class="px-4 py-3">${escapeHtml(row.guild_name)}</td>
            <td class="px-4 py-3">${escapeHtml(row.master)}</td>
            <td class="px-4 py-3">${row.TotalDevote ?? row.devote ?? ''}</td>
            <td class="px-4 py-3">${row.MemberCount ?? row.members ?? ''}</td>
            <td class="px-4 py-3">${row.G_Score ?? row.score ?? ''}</td>
          </tr>`;
        }

        return `<tr class="border-t border-white/5">
          <td class="px-4 py-3">${index + 1}</td>
          <td class="px-4 py-3">${escapeHtml(row.CharacterName || row.name || '')}</td>
          <td class="px-4 py-3">${row.KillCount ?? row.count ?? ''}</td>
          <td class="px-4 py-3">${row.TotalPoint ?? row.point ?? ''}</td>
        </tr>`;
      })
      .join('');
  };

  const loadRankings = async (type = 'ranking') => {
    renderHead(type);
    statusEl.textContent = 'Đang tải...';

    try {
      const data = await fetchRankings(type);
      if (data?.error) {
        renderEmpty(`Không tải được BXH: ${escapeHtml(data.error)}`);
        statusEl.textContent = '';
        return;
      }

      if (!Array.isArray(data) || !data.length) {
        renderEmpty('Không có dữ liệu.');
        statusEl.textContent = '';
        return;
      }

      renderRows(type, data);
      statusEl.textContent = '';
    } catch (error) {
      console.error('Không thể tải BXH', error);
      renderEmpty('Không tải được BXH.');
      statusEl.textContent = '';
    }
  };

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      tabButtons.forEach((btn) => btn.classList.remove('bg-white/5'));
      button.classList.add('bg-white/5');
      loadRankings(button.dataset.type);
    });
  });

  loadRankings('ranking');
})();
