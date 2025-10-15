// Mobile menu toggle
const menuButton = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('menu');
if (menuButton && mobileMenu) {
  menuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
}

// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href').slice(1);
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Fetch server status (demo placeholder)
async function loadStatus() {
  const el = document.getElementById('server-status');
  if (!el) return;
  try {
    const response = await fetch('/api.php');
    const data = await response.json();
    el.textContent = data?.message || 'Server dang hoat dong';
  } catch {
    el.textContent = 'Khong the tai trang thai may chu.';
  }
}
loadStatus();

// Apply config values to DOM
function applyConfig() {
  const cfg = window.PKC_CONFIG || {};
  const seasonEl = document.getElementById('pkc-season');
  const expEl = document.getElementById('pkc-exp');
  const dropEl = document.getElementById('pkc-drop');
  if (seasonEl && cfg.server?.season) seasonEl.textContent = cfg.server.season;
  if (expEl && cfg.server?.exp) expEl.textContent = cfg.server.exp;
  if (dropEl && cfg.server?.drop) dropEl.textContent = cfg.server.drop;

  const clientLink = document.getElementById('pkc-download-client');
  const launcherLink = document.getElementById('pkc-download-launcher');
  if (clientLink && cfg.links?.downloadClient) clientLink.href = cfg.links.downloadClient;
  if (launcherLink && cfg.links?.downloadLauncher) launcherLink.href = cfg.links.downloadLauncher;

  const contact = cfg.contact || {};
  const setLink = (id, info) => {
    const el = document.getElementById(id);
    if (!el || !info) return;
    el.href = info.href;
    el.textContent = info.label || info.href;
  };
  setLink('pkc-contact-facebook', contact.facebook);
  setLink('pkc-contact-zalo', contact.zalo);
  setLink('pkc-contact-discord', contact.discord);
  setLink('pkc-contact-email', contact.email);
  setLink('pkc-contact-phone', contact.phone);
}
applyConfig();

// WordPress helpers
const wpCategoryIdCache = new Map();
const wpPostsCache = new Map();

function getWpConfig() {
  const cfg = window.PKC_CONFIG?.wordpress || {};
  const baseUrl = cfg.baseUrl ? cfg.baseUrl.replace(/\/$/, '') : '';
  if (!baseUrl) return null;
  return { baseUrl, useProxy: Boolean(cfg.useProxy) };
}

async function resolveWpCategoryId(slug, baseUrl) {
  if (!slug) return null;
  if (wpCategoryIdCache.has(slug)) return wpCategoryIdCache.get(slug);
  try {
    const url = new URL(`${baseUrl}/wp-json/wp/v2/categories`);
    url.searchParams.set('slug', slug);
    const response = await fetch(url.toString());
    const data = await response.json();
    const id = Array.isArray(data) && data[0]?.id ? data[0].id : null;
    wpCategoryIdCache.set(slug, id);
    return id;
  } catch {
    wpCategoryIdCache.set(slug, null);
    return null;
  }
}

async function fetchWpPosts({ slug = '', perPage = 6 } = {}) {
  const cfg = getWpConfig();
  if (!cfg) return [];
  const cacheKey = `${slug}|${perPage}`;
  if (wpPostsCache.has(cacheKey)) return wpPostsCache.get(cacheKey);

  const url = new URL(`${cfg.baseUrl}/wp-json/wp/v2/posts`);
  url.searchParams.set('per_page', String(perPage));
  url.searchParams.set('_embed', '1');
  if (slug) {
    const categoryId = await resolveWpCategoryId(slug, cfg.baseUrl);
    if (categoryId) url.searchParams.set('categories', categoryId);
  }

  try {
    const response = await fetch(url.toString());
    const json = await response.json();
    const list = Array.isArray(json) ? json : [];
    wpPostsCache.set(cacheKey, list);
    return list;
  } catch {
    wpPostsCache.set(cacheKey, []);
    return [];
  }
}

const sanitizeWpText = (str = '') =>
  str.toString().replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const shortenText = (str = '', limit = 140) => {
  if (str.length <= limit) return str;
  const trimmed = str.slice(0, limit).trimEnd();
  return trimmed.replace(/[.,;:-]?$/, '') + '...';
};

const formatWpDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateStr.slice(0, 10);
  }
};

const getPrimaryCategory = (post) => {
  try {
    const term = post?._embedded?.['wp:term'];
    if (Array.isArray(term)) {
      for (const group of term) {
        if (!Array.isArray(group)) continue;
        const match = group.find(item => item?.taxonomy === 'category');
        if (match?.name) return match.name;
      }
    }
  } catch {
    // ignore
  }
  return '';
};

function renderHomepagePosts(posts, containerId) {
  const container = document.getElementById(containerId);
  if (!container || !Array.isArray(posts)) return;
  container.innerHTML = posts.map(post => {
    const title = sanitizeWpText(post?.title?.rendered || 'Khong co tieu de');
    const link = post?.link || '#';
    const date = formatWpDate(post?.date);
    const excerpt = shortenText(sanitizeWpText(post?.excerpt?.rendered || ''), 150);
    const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    return `<article class="rounded-2xl border border-white/10 p-6 bg-slate-900/40 hover:border-white/25 transition">
      <a href="${link}" target="_blank" rel="noopener" class="block space-y-3">
        ${img ? `<img src="${img}" alt="" class="w-full aspect-[16/9] object-cover rounded-xl border border-white/5">` : ''}
        <h3 class="text-lg font-semibold leading-snug">${title}</h3>
        <p class="text-slate-400 text-sm">${date}</p>
        <p class="text-slate-300 text-sm leading-relaxed">${excerpt}</p>
      </a>
    </article>`;
  }).join('');
}

function renderNewsPageCards(posts, container) {
  if (!container) return;
  if (!Array.isArray(posts) || !posts.length) {
    container.innerHTML = '<div class="text-slate-500 text-sm">Dang cap nhat...</div>';
    return;
  }
  container.innerHTML = posts.map(post => {
    const title = sanitizeWpText(post?.title?.rendered || 'Khong co tieu de');
    const link = post?.link || '#';
    const date = formatWpDate(post?.date);
    const excerpt = shortenText(sanitizeWpText(post?.excerpt?.rendered || ''), 160);
    const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    const category = getPrimaryCategory(post);
    const meta = [category, date].filter(Boolean).join(' | ');
    return `<a href="${link}" target="_blank" rel="noopener" class="news-page-card">
      ${img ? `<img src="${img}" alt="">` : ''}
      <div class="card-meta">${meta}</div>
      <h3>${title}</h3>
      <p>${excerpt}</p>
    </a>`;
  }).join('');
}

async function loadWpPosts() {
  const latestTarget = document.getElementById('wp-latest');
  const newsTarget = document.getElementById('wp-news');
  if (!latestTarget && !newsTarget) return;
  try {
    if (latestTarget) {
      const latest = await fetchWpPosts({ perPage: 3 });
      renderHomepagePosts(latest, 'wp-latest');
    }
    if (newsTarget) {
      const news = await fetchWpPosts({ perPage: 10 });
      renderHomepagePosts(news, 'wp-news');
    }
  } catch {
    if (newsTarget) newsTarget.innerHTML = '<div class="text-slate-400 text-sm">Khong the tai bai viet.</div>';
  }
}

async function loadNewsPageSections() {
  const container = document.getElementById('news-page-content');
  if (!container) return;
  const filtersRoot = document.getElementById('news-page-filters');
  const cfg = getWpConfig();
  if (!cfg) {
    container.innerHTML = '<div class="text-slate-400 text-sm">Chua cau hinh WordPress.</div>';
    return;
  }

  const cat = window.PKC_CONFIG?.wordpress?.categories || {};
  const baseUrl = cfg.baseUrl;
  const sections = [
    {
      key: 'tin_tuc',
      slug: cat.tin_tuc || cat.cap_nhat || 'tin-tuc-cap-nhat',
      label: 'Tin tuc & Cap nhat',
      description: 'Thong bao, lich bao tri va cac phien ban moi nhat cua may chu.',
      limit: 6,
      cols: 'cols-3'
    },
    {
      key: 'pkclear',
      slug: cat.pk_clear || 'muonline-pkclear',
      label: 'PK CLEAR',
      description: 'Cau chuyen cong dong, linh vat va cac diem nhan trong tam PK CLEAR.',
      limit: 6,
      cols: 'cols-3'
    },
    {
      key: 'events',
      slug: cat.su_kien || 'su-kien',
      label: 'Su kien',
      description: 'Tong hop su kien ingame, phan thuong va thong bao tu ban quan tri.',
      limit: 6,
      cols: 'cols-3'
    },
    {
      key: 'huongdan',
      slug: cat.huong_dan || 'huong-dan',
      label: 'Huong dan',
      description: 'Kien thuc ho tro tan thu, meo nang cao va tong hop build class.',
      children: [
        { key: 'co_ban', slug: cat.co_ban || 'co-ban', label: 'Co ban', limit: 3, cols: 'cols-3' },
        { key: 'meo_nang_cao', slug: cat.meo_nang_cao || 'meo-nang-cao', label: 'Meo & Nang cao', limit: 3, cols: 'cols-3' },
        { key: 'trang_bi', slug: cat.trang_bi || 'trang-bi', label: 'Trang bi', limit: 3, cols: 'cols-3' }
      ]
    }
  ];

  if (filtersRoot) {
    filtersRoot.classList.add('news-page-filters');
    const buttons = ['all', ...sections.map(s => s.key)].map(key => {
      const label = key === 'all' ? 'Tat ca' : sections.find(s => s.key === key)?.label || key;
      const active = key === 'all' ? 'active' : '';
      return `<button type="button" class="${active}" data-filter="${key}">${label}</button>`;
    }).join('');
    filtersRoot.innerHTML = buttons;
  }

  container.innerHTML = sections.map(section => {
    const link = section.slug ? `${baseUrl}/category/${section.slug}/` : baseUrl;
    if (section.children && section.children.length) {
      const sub = section.children.map(child => {
        const childLink = child.slug ? `${baseUrl}/category/${child.slug}/` : baseUrl;
        return `<div class="space-y-4" data-subsection="${child.key}">
          <div class="flex items-center justify-between gap-3 flex-wrap">
            <h3 class="text-xl font-semibold">${child.label}</h3>
            <a class="text-sm text-cyan-300 hover:text-cyan-100 transition" href="${childLink}" target="_blank" rel="noopener">Xem them</a>
          </div>
          <div class="news-page-grid ${child.cols || 'cols-3'}" id="news-grid-${child.key}"></div>
        </div>`;
      }).join('');
      return `<section class="news-page-section" data-section="${section.key}">
        <div class="section-head">
          <div>
            <h2>${section.label}</h2>
            <p>${section.description}</p>
          </div>
          <a href="${link}" target="_blank" rel="noopener">Toi danh muc</a>
        </div>
        <div class="space-y-10">${sub}</div>
      </section>`;
    }
    return `<section class="news-page-section" data-section="${section.key}">
      <div class="section-head">
        <div>
          <h2>${section.label}</h2>
          <p>${section.description}</p>
        </div>
        <a href="${link}" target="_blank" rel="noopener">Toi danh muc</a>
      </div>
      <div class="news-page-grid ${section.cols || 'cols-3'}" id="news-grid-${section.key}"></div>
    </section>`;
  }).join('');

  const sectionElements = Array.from(container.querySelectorAll('.news-page-section'));
  if (filtersRoot) {
    const buttons = Array.from(filtersRoot.querySelectorAll('button'));
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.filter || 'all';
        buttons.forEach(b => b.classList.toggle('active', b === btn));
        sectionElements.forEach(section => {
          if (target === 'all') {
            section.classList.remove('hidden');
          } else {
            section.classList.toggle('hidden', section.dataset.section !== target);
          }
        });
      });
    });
  }

  for (const section of sections) {
    if (section.children && section.children.length) {
      await Promise.all(section.children.map(async child => {
        const target = document.getElementById(`news-grid-${child.key}`);
        const posts = await fetchWpPosts({ slug: child.slug, perPage: child.limit || 3 });
        renderNewsPageCards(posts, target);
      }));
    } else {
      const target = document.getElementById(`news-grid-${section.key}`);
      const posts = await fetchWpPosts({ slug: section.slug, perPage: section.limit || 6 });
      renderNewsPageCards(posts, target);
    }
  }
}

loadWpPosts();
loadNewsPageSections();
