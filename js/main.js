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

// Trang chủ: Tin tức hai cột (slider + tabs)
async function initHomeNewsSection(){
  const root = document.getElementById('home-news-root');
  if(!root) return; // không ở trang chủ
  const cfg = window.PKC_CONFIG?.wordpress || {}; if (!cfg?.baseUrl) return;
  const base = cfg.baseUrl.replace(/\/$/, '');

  const cats = cfg.categories || {};
  const SLUGS = {
    featured: cats.featured || 'noi-bat',
    su_kien: cats.su_kien || 'su-kien',
    cap_nhat: cats.cap_nhat || 'cap-nhat',
    huong_dan: cats.huong_dan || 'huong-dan'
  };

  const cacheCatId = new Map();
  async function categoryIdBySlug(slug){
    if(cacheCatId.has(slug)) return cacheCatId.get(slug);
    try{
      const url = `${base}/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}`;
      const res = await fetch(url); const js = await res.json();
      const id = Array.isArray(js) && js[0]?.id ? js[0].id : null;
      cacheCatId.set(slug,id); return id;
    }catch{ return null; }
  }

  async function fetchPosts({perPage=6, catSlug=null}){
    const u = new URL(`${base}/wp-json/wp/v2/posts`);
    u.searchParams.set('per_page', perPage);
    u.searchParams.set('_embed', '1');
    if (catSlug){
      const id = await categoryIdBySlug(catSlug); if(id) u.searchParams.set('categories', id);
    }
    const res = await fetch(u.toString()); return await res.json();
  }

  function esc(s){ return (s??'').toString().replace(/[&<>\"]/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;' }[m])); }

  // Slider Featured (trái)
  const sImage = document.getElementById('news-featured-img');
  const sTitle = document.getElementById('news-featured-title');
  const sView  = document.getElementById('news-featured-view');
  const sPrev  = document.getElementById('news-prev');
  const sNext  = document.getElementById('news-next');
  const sDots  = document.getElementById('news-featured-dots');
  let sData = []; let idx = 0; let timer = null;

  function goPrev(){ if(!sData.length) return; stopAuto(); renderFeatured(idx-1); startAuto(); }
  function goNext(){ if(!sData.length) return; stopAuto(); renderFeatured(idx+1); startAuto(); }
  function renderFeatured(i){
    if(!sData.length) return;
    idx = (i + sData.length) % sData.length;
    const p = sData[idx];
    const img = p?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    if(sImage) { sImage.src = img || ''; sImage.alt = esc(p?.title?.rendered||''); }
    if(sView)  { sView.href = p?.link || '#'; }
    if(sTitle) { sTitle.textContent = (p?.title?.rendered||'').replace(/<[^>]+>/g,''); sTitle.href = p?.link || '#'; }
    if(sDots){
      sDots.innerHTML = sData.map((_,k)=>`<button data-k="${k}" class="${k===idx?'active':''}"></button>`).join('');
      sDots.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{ stopAuto(); renderFeatured(parseInt(b.dataset.k,10)); startAuto(); }));
    }
  }
  function startAuto(){ stopAuto(); timer = setInterval(()=>renderFeatured(idx+1), 6000); }
  function stopAuto(){ if(timer){ clearInterval(timer); timer=null; } }
  if(sPrev) sPrev.addEventListener('click', goPrev);
  if(sNext) sNext.addEventListener('click', goNext);


  // Tab list (phải)
  const tabs = document.querySelectorAll('#news-tabs [data-cat]');
  const list = document.getElementById('news-list');
  async function loadList(slug){
    if(!list) return; list.innerHTML = '<li class="text-slate-400">Đang tải...</li>';
    try{
      const posts = await fetchPosts({perPage:8, catSlug:slug});
      if(!Array.isArray(posts)) throw 0;
      list.innerHTML = posts.map(p=>{
        const t=(p?.title?.rendered||'').replace(/<[^>]+>/g,''); const l=p?.link||'#'; const d=(p?.date||'').slice(0,10);
        let cat='';
        try{
          const terms=p?._embedded?.['wp:term'];
          if(Array.isArray(terms) && Array.isArray(terms[0]) && terms[0][0]?.name) cat=terms[0][0].name;
        }catch{}
        const meta = [cat,d].filter(Boolean).join(' / ');
        return `<li><a class="news-list-link" href="${l}" target="_blank" rel="noopener"><span class="truncate">${esc(t)}</span><span class="news-meta">${esc(meta)}</span></a></li>`;
      }).join('');
    }catch{ list.innerHTML = '<li class="text-slate-400">Không tải được bài viết.</li>'; }
  }
  tabs.forEach(b=>b.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('news-tab--active'));
    b.classList.add('news-tab--active');
    loadList(b.dataset.cat);
  }));

  // Khởi tạo dữ liệu
  try { sData = await fetchPosts({perPage:5, catSlug:SLUGS.featured}); } catch {}
  if(Array.isArray(sData) && sData.length){ renderFeatured(0); startAuto(); }
  const firstTab = document.querySelector('#news-tabs [data-cat]');
  if(firstTab) { firstTab.classList.add('news-tab--active'); loadList(firstTab.dataset.cat); }
}
initHomeNewsSection();
