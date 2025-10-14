// Mobile menu toggle
const btn = document.getElementById('menu-btn');
const menu = document.getElementById('menu');
if (btn && menu) btn.addEventListener('click', () => menu.classList.toggle('hidden'));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if (el) { e.preventDefault(); el.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// Fetch server status (demo)
async function loadStatus(){
  const el = document.getElementById('server-status'); if(!el) return;
  try{ const res = await fetch('/api.php'); const data = await res.json(); el.textContent = data?.message || 'Máy chủ đang hoạt động'; }
  catch{ el.textContent = 'Không thể tải trạng thái máy chủ.'; }
}
loadStatus();

// Apply config to DOM
function applyConfig(){
  const cfg = window.PKC_CONFIG || {};
  const seasonEl = document.getElementById('pkc-season');
  const expEl = document.getElementById('pkc-exp');
  const dropEl = document.getElementById('pkc-drop');
  if (seasonEl && cfg.server?.season) seasonEl.textContent = cfg.server.season;
  if (expEl && cfg.server?.exp) expEl.textContent = cfg.server.exp;
  if (dropEl && cfg.server?.drop) dropEl.textContent = cfg.server.drop;

  const cl = document.getElementById('pkc-download-client');
  const ll = document.getElementById('pkc-download-launcher');
  if (cl && cfg.links?.downloadClient) cl.href = cfg.links.downloadClient;
  if (ll && cfg.links?.downloadLauncher) ll.href = cfg.links.downloadLauncher;

  const c = cfg.contact || {};
  const setLink = (id, obj) => { const el = document.getElementById(id); if(!el||!obj) return; el.href = obj.href; el.textContent = obj.label || obj.href; };
  setLink('pkc-contact-facebook', c.facebook);
  setLink('pkc-contact-zalo', c.zalo);
  setLink('pkc-contact-discord', c.discord);
  setLink('pkc-contact-email', c.email);
  setLink('pkc-contact-phone', c.phone);
}
applyConfig();

// Load WordPress posts
async function loadWpPosts(){
  const cfg = window.PKC_CONFIG?.wordpress || {}; if (!cfg?.baseUrl) return;
  const buildUrl = (n)=>{ const u=new URL((cfg.baseUrl.replace(/\/$/,'')+'/wp-json/wp/v2/posts')); u.searchParams.set('per_page',n); u.searchParams.set('_embed','1'); return u.toString(); };
  async function fetchJson(n){ if(cfg.useProxy){ const r = await fetch(`/api.php?action=wp_posts&site=${encodeURIComponent(cfg.baseUrl)}&per_page=${n}`); return await r.json(); } else { const r = await fetch(buildUrl(n)); return await r.json(); } }
  function render(list, id){ const m=document.getElementById(id); if(!m||!Array.isArray(list)) return; m.innerHTML=list.map(p=>{ const t=p?.title?.rendered||'Không tiêu đề'; const l=p?.link||'#'; const d=(p?.date||'').slice(0,10); const ex=(p?.excerpt?.rendered||'').replace(/<[^>]+>/g,'').slice(0,140); const img=p?._embedded?.['wp:featuredmedia']?.[0]?.source_url||''; return `<article class="rounded-2xl border border-white/10 p-6 hover:border-white/20 transition"><a href="${l}" target="_blank" rel="noopener" class="block">${img?`<img src="${img}" alt="" class="w-full aspect-[16/9] object-cover rounded-xl mb-4">`:''}<h3 class="text-lg font-semibold">${t}</h3><p class="text-slate-400 text-sm mt-1">${d}</p><p class="mt-2 text-slate-300">${ex}...</p></a></article>`; }).join(''); }
  try{ render(await fetchJson(3), 'wp-latest'); }catch{}
  try{ render(await fetchJson(10), 'wp-news'); }catch(e){ const el=document.getElementById('wp-news'); if(el) el.textContent='Không tải được bài viết WordPress.'; }
}
loadWpPosts();

