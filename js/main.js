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

const HERO_DEFAULTS = {
  title: 'Mu Online',
  accent: 'PK CLEAR',
  pill: 'Server kiểm duyệt • Không mở đăng ký công khai',
  description: 'Máy chủ PK tốc độ mượt, cân bằng class, sự kiện dày đặc, anti-cheat mạnh. Tham gia ngay để khẳng định đẳng cấp chiến binh!',
  primaryText: 'Tải Game',
  primaryHref: '/pages/download.php',
  secondaryText: 'Liên hệ Admin',
  secondaryHref: '/pages/contact.php',
  tertiaryText: 'Tin tức',
  tertiaryHref: '/pages/news.php'
};

const escapeHtml = (str = '') =>
  str.toString().replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char] || char);

function renderHeroSections() {
  const mounts = document.querySelectorAll('[data-hero]');
  if (!mounts.length) return;

  mounts.forEach(mount => {
    const data = mount.dataset || {};
    const title = data.heroTitle || HERO_DEFAULTS.title;
    const accent = data.heroAccent || HERO_DEFAULTS.accent;
    const pill = data.heroPill || HERO_DEFAULTS.pill;
    const description = data.heroDescription || HERO_DEFAULTS.description;

    const primaryText = data.heroPrimaryText || HERO_DEFAULTS.primaryText;
    const primaryHref = data.heroPrimaryHref || HERO_DEFAULTS.primaryHref;

    const secondaryText = data.heroSecondaryText || HERO_DEFAULTS.secondaryText;
    const secondaryHref = data.heroSecondaryHref || HERO_DEFAULTS.secondaryHref;

    const tertiaryDefined = Object.prototype.hasOwnProperty.call(data, 'heroTertiaryText');
    const tertiaryText = tertiaryDefined ? data.heroTertiaryText : HERO_DEFAULTS.tertiaryText;
    const tertiaryHref = data.heroTertiaryHref || HERO_DEFAULTS.tertiaryHref;
    const showTertiary = tertiaryText && tertiaryText.trim().length > 0;

    mount.classList.add('relative', 'overflow-hidden');
    mount.innerHTML = `
      <div class="absolute inset-0 bg-gradient-to-b from-purple-800/30 via-transparent to-slate-950"></div>
      <div class="absolute inset-0 bg-grid"></div>
      <div class="mx-auto max-w-7xl px-4 pt-16 pb-20 relative">
        <div class="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 class="font-display text-4xl md:text-6xl font-extrabold leading-tight">${escapeHtml(title)} <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-300">${escapeHtml(accent)}</span></h1>
            <div class="mt-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs text-purple-200">${escapeHtml(pill)}</div>
            <p class="mt-4 text-slate-300 text-lg max-w-xl">${escapeHtml(description)}</p>
            <div class="mt-8 flex flex-wrap gap-3">
              <a href="${escapeHtml(primaryHref)}" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-cyan-400 text-slate-900 font-semibold glow">${escapeHtml(primaryText)}</a>
              <a href="${escapeHtml(secondaryHref)}" class="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20">${escapeHtml(secondaryText)}</a>
              ${showTertiary ? `<a href="${escapeHtml(tertiaryHref)}" class="px-6 py-3 rounded-2xl border border-white/10 hover:border-white/20">${escapeHtml(tertiaryText)}</a>` : ''}
            </div>
            <div class="mt-6 text-sm text-slate-400">Trạng thái máy chủ: <span id="server-status" class="text-slate-200">Đang tải...</span></div>
          </div>
          <div class="relative">
            <div class="absolute -inset-1 rounded-full blur-3xl bg-gradient-to-r from-purple-600/20 to-cyan-400/20"></div>
            <img src="/assets/logo.png" alt="PK CLEAR logo" class="relative mx-auto h-56 md:h-72 w-auto"/>
            <div class="mt-6 grid grid-cols-3 gap-4 text-center">
              <div class="rounded-2xl border border-white/10 p-4">
                <div class="text-2xl font-bold">Season</div>
                <div id="pkc-season" class="text-slate-400">Sx.x</div>
              </div>
              <div class="rounded-2xl border border-white/10 p-4">
                <div class="text-2xl font-bold">Exp</div>
                <div id="pkc-exp" class="text-slate-400">xXXX</div>
              </div>
              <div class="rounded-2xl border border-white/10 p-4">
                <div class="text-2xl font-bold">Drop</div>
                <div id="pkc-drop" class="text-slate-400">xXX%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
}

// Fetch server status (demo placeholder)
async function loadStatus() {
  const el = document.getElementById('server-status');
  if (!el) return;
  try {
    const response = await fetch('/api.php');
    const data = await response.json();
    el.textContent = data?.message || 'Server dang hoat dong';
  } catch {
    el.textContent = 'Không thể tải trạng thái máy chủ.';
  }
}

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
    const title = sanitizeWpText(post?.title?.rendered || 'Không có tiêu đề');
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
    container.innerHTML = '<div class="text-slate-500 text-sm">Đang cập nhật...</div>';
    return;
  }
  container.innerHTML = posts.map(post => {
    const title = sanitizeWpText(post?.title?.rendered || 'Không có tiêu đề');
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
    if (newsTarget) newsTarget.innerHTML = '<div class="text-slate-400 text-sm">Không thể tải bài viết.</div>';
  }
}

async function loadNewsPageSections() {
  const container = document.getElementById('news-page-content');
  if (!container) return;
  const filtersRoot = document.getElementById('news-page-filters');
  const cfg = getWpConfig();
  if (!cfg) {
    container.innerHTML = '<div class="text-slate-400 text-sm">Chưa cấu hình WordPress.</div>';
    return;
  }

  const cat = window.PKC_CONFIG?.wordpress?.categories || {};
  const baseUrl = cfg.baseUrl;
  const sections = [
    {
      key: 'tin_tuc',
      slug: cat.tin_tuc || cat.cap_nhat || 'tin-tuc-cap-nhat',
      label: 'Tin tức & Cập nhật',
      description: 'Thông báo, lịch bảo trì và các phiên bản mới nhất của máy chủ.',
      limit: 6,
      cols: 'cols-3'
    },
    {
      key: 'pkclear',
      slug: cat.pk_clear || 'muonline-pkclear',
      label: 'PK CLEAR',
      description: 'Câu chuyện cộng đồng, linh vật và các điểm nhấn trọng tâm PK CLEAR.',
      limit: 6,
      cols: 'cols-3'
    },
    {
      key: 'events',
      slug: cat.su_kien || 'su-kien',
      label: 'Sự kiện',
      description: 'Tổng hợp sự kiện ingame, phần thưởng và thông báo từ ban quản trị.',
      limit: 6,
      cols: 'cols-3'
    },
    {
      key: 'huongdan',
      slug: cat.huong_dan || 'huong-dan',
      label: 'Hướng dẫn',
      description: 'Kiến thức hỗ trợ tân thủ, mẹo nâng cao và tổng hợp build class.',
      children: [
        { key: 'co_ban', slug: cat.co_ban || 'co-ban', label: 'Cơ bản', limit: 3, cols: 'cols-3' },
        { key: 'meo_nang_cao', slug: cat.meo_nang_cao || 'meo-nang-cao', label: 'Mẹo & Nâng cao', limit: 3, cols: 'cols-3' },
        { key: 'trang_bi', slug: cat.trang_bi || 'trang-bi', label: 'Trang bị', limit: 3, cols: 'cols-3' }
      ]
    }
  ];

  if (filtersRoot) {
    filtersRoot.classList.add('news-page-filters');
    const buttons = ['all', ...sections.map(s => s.key)].map(key => {
      const label = key === 'all' ? 'Tất cả' : sections.find(s => s.key === key)?.label || key;
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
            <a class="text-sm text-cyan-300 hover:text-cyan-100 transition" href="${childLink}" target="_blank" rel="noopener">Xem thêm</a>
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
          <a href="${link}" target="_blank" rel="noopener">Tới danh mục</a>
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
        <a href="${link}" target="_blank" rel="noopener">Tới danh mục</a>
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

renderHeroSections();
loadStatus();
applyConfig();
loadWpPosts();
loadNewsPageSections();
