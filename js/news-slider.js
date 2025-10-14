(function(){
  const root = document.getElementById('news-slider');
  if(!root) return;

  const stage = root.querySelector('.news-slider-stage');
  const layer = root.querySelector('.news-slider-layer');
  const mainImg = stage.querySelector('.news-card-img');
  const titleEl = root.querySelector('.news-card-title');
  const ctaBtn = root.querySelector('.news-card-cta');
  const prevGhost = root.querySelector('#news-prev-card');
  const nextGhost = root.querySelector('#news-next-card');
  const dotsWrap = root.querySelector('.news-dots');
  const prevBtn = root.querySelector('.prev');
  const nextBtn = root.querySelector('.next');

  const listEl = document.getElementById('news-items');
  const tabButtons = Array.from(document.querySelectorAll('[data-tab]'));

  const cfg = window.PKC_CONFIG?.wordpress || {};
  const baseUrl = cfg.baseUrl ? cfg.baseUrl.replace(/\/$/, '') : '';
  if(!baseUrl) return;

  const catMap = {
    featured: cfg.categories?.featured || 'noi-bat',
    events: cfg.categories?.su_kien || 'su-kien',
    updates: cfg.categories?.cap_nhat || 'cap-nhat',
    guides: cfg.categories?.huong_dan || 'huong-dan'
  };

  const catIdCache = new Map();
  const postCache = new Map();
  let sliderPosts = [];
  let current = 0;
  let timer = null;
  let dragging = false;
  let dragStartX = 0;
  let dragDx = 0;
  let activePointer = null;
  let rafId = null;

  function esc(str){ return (str??'').toString().replace(/[&<>\"]/g, m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;' }[m])); }

  async function resolveCategoryId(slug){
    if(!slug) return null;
    if(catIdCache.has(slug)) return catIdCache.get(slug);
    try{
      const res = await fetch(`${baseUrl}/wp-json/wp/v2/categories?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      const id = Array.isArray(data) && data[0]?.id ? data[0].id : null;
      catIdCache.set(slug, id);
      return id;
    }catch{
      catIdCache.set(slug, null);
      return null;
    }
  }

  async function fetchPostsByKey(key){
    if(postCache.has(key)) return postCache.get(key);
    const slug = catMap[key] || '';
    const url = new URL(`${baseUrl}/wp-json/wp/v2/posts`);
    url.searchParams.set('per_page','6');
    url.searchParams.set('_embed','1');
    try{
      if(slug){
        const id = await resolveCategoryId(slug);
        if(id) url.searchParams.set('categories', id);
      }
      const res = await fetch(url.toString());
      const json = await res.json();
      if(Array.isArray(json)){ postCache.set(key,json); return json; }
      postCache.set(key,[]); return [];
    }catch{
      postCache.set(key,[]); return [];
    }
  }

  function applyRafTransform(value){
    if(!layer) return;
    if(rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(()=>{ layer.style.transform = `translateX(${value}px)`; });
  }

  function updateSlider(){
    if(!sliderPosts.length) return;
    const post = sliderPosts[current];
    const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    const title = post?.title?.rendered || 'Đang cập nhật';
    const link = post?.link || '#';

    if(img){
      mainImg.src = img;
      mainImg.alt = esc(title);
    }
    if(titleEl){
      titleEl.textContent = esc(title).replace(/&amp;/g,'&');
      titleEl.href = link;
    }
    if(ctaBtn){ ctaBtn.href = link; }

    const prev = sliderPosts[(current - 1 + sliderPosts.length) % sliderPosts.length];
    const next = sliderPosts[(current + 1) % sliderPosts.length];
    const prevImg = prev?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    const nextImg = next?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    if(prevGhost){ prevGhost.style.backgroundImage = prevImg ? `url(${prevImg})` : 'none'; prevGhost.style.opacity = prevImg ? '0.3' : '0'; }
    if(nextGhost){ nextGhost.style.backgroundImage = nextImg ? `url(${nextImg})` : 'none'; nextGhost.style.opacity = nextImg ? '0.3' : '0'; }

    if(dotsWrap){
      dotsWrap.innerHTML = sliderPosts.map((_,i)=>`<button data-index="${i}" class="${i===current?'active':''}"></button>`).join('');
      dotsWrap.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>setCurrent(parseInt(btn.dataset.index,10))));
    }
  }

  function setCurrent(index){
    if(!sliderPosts.length) return;
    current = (index + sliderPosts.length) % sliderPosts.length;
    updateSlider();
    restartAuto();
  }

  function restartAuto(){
    if(timer) clearInterval(timer);
    if(!sliderPosts.length) return;
    timer = setInterval(()=>setCurrent(current+1), 7000);
  }

  async function renderList(key){
    const posts = await fetchPostsByKey(key);
    const items = Array.isArray(posts) ? posts.slice(0,6) : [];
    const fragments = items.map(post=>{
      const title = (post?.title?.rendered||'Không tiêu đề').replace(/<[^>]+>/g,'');
      const link = post?.link || '#';
      const date = (post?.date||'').slice(0,10);
      let category = '';
      try{
        const term = post?._embedded?.['wp:term'];
        if(Array.isArray(term) && term[0]?.[0]?.name) category = term[0][0].name;
      }catch{}
      const meta = [category,date].filter(Boolean).join(' • ');
      return `<li><a class="news-list-link" href="${link}" target="_blank" rel="noopener"><span class="truncate">${esc(title)}</span><span class="news-meta">${esc(meta)}</span></a></li>`;
    });
    while(fragments.length < 6){
      fragments.push('<li class="news-placeholder"><div class="news-list-link">Đang cập nhật...</div></li>');
    }
    if(listEl) listEl.innerHTML = fragments.join('');
  }

  function bindTabs(){
    tabButtons.forEach(btn=>{
      btn.addEventListener('click', async ()=>{
        tabButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.dataset.tab || 'featured';
        renderList(key);
        if(key==='featured' && sliderPosts.length>0) return;
        if(key==='featured'){
          sliderPosts = await fetchPostsByKey('featured');
          if(!sliderPosts.length) sliderPosts = [];
          current = 0;
          updateSlider();
        }
      });
    });
    const defaultTab = tabButtons.find(btn=>btn.dataset.tab==='featured') || tabButtons[0];
    if(defaultTab){ defaultTab.classList.add('active'); }
  }

  function bindSliderControls(){
    if(prevBtn) prevBtn.addEventListener('click', ()=>setCurrent(current-1));
    if(nextBtn) nextBtn.addEventListener('click', ()=>setCurrent(current+1));
    if(stage){
      stage.addEventListener('pointerdown', e=>{
        if(!sliderPosts.length) return;
        dragging = true;
        activePointer = e.pointerId;
        dragStartX = e.clientX;
        dragDx = 0;
        stage.setPointerCapture?.(activePointer);
        stage.style.cursor = 'grabbing';
        if(timer) clearInterval(timer);
      });
      stage.addEventListener('pointermove', e=>{
        if(!dragging || e.pointerId !== activePointer) return;
        dragDx = e.clientX - dragStartX;
        const limited = Math.max(Math.min(dragDx, 160), -160);
        applyRafTransform(limited * 0.12);
      });
      const release = e=>{
        if(!dragging || (e.pointerId !== undefined && e.pointerId !== activePointer)) return;
        applyRafTransform(0);
        stage.style.cursor = 'grab';
        if(activePointer !== null) stage.releasePointerCapture?.(activePointer);
        dragging = false;
        const delta = dragDx;
        dragDx = 0;
        activePointer = null;
        if(Math.abs(delta) > 80){
          if(delta < 0) setCurrent(current+1); else setCurrent(current-1);
        } else {
          restartAuto();
        }
      };
      stage.addEventListener('pointerup', release);
      stage.addEventListener('pointercancel', release);
      stage.addEventListener('pointerleave', release);
    }
  }

  async function init(){
    bindTabs();
    bindSliderControls();
    sliderPosts = await fetchPostsByKey('featured');
    if(!Array.isArray(sliderPosts) || !sliderPosts.length){
      sliderPosts = [];
      if(mainImg) mainImg.src = '';
    }
    if(sliderPosts.length){
      current = 0;
      updateSlider();
      restartAuto();
    }
    renderList('featured');
  }

  init();
})();
