(function(){
  const root = document.getElementById('news-slider');
  if(!root) return;

  const stage = root.querySelector('.news-slider-stage');
  const layer = root.querySelector('.news-slider-layer');
  const mainImg = root.querySelector('#news-featured-img');
  const metaEl = document.getElementById('news-featured-meta');
  const titleEl = document.getElementById('news-featured-title');
  const excerptEl = document.getElementById('news-featured-excerpt');
  const ctaBtn = document.getElementById('news-featured-view');
  const prevGhost = root.querySelector('#news-prev-card');
  const nextGhost = root.querySelector('#news-next-card');
  const blurLayer = root.querySelector('.news-slider-blur');
  const glowLayer = root.querySelector('.news-slider-glow');
  const dotsWrap = root.querySelector('.news-dots');
  const prevBtn = document.getElementById('news-prev');
  const nextBtn = document.getElementById('news-next');

  if(stage) stage.style.cursor = 'grab';

  const listEl = document.getElementById('news-items');
  const tabButtons = Array.from(document.querySelectorAll('[data-tab]'));

  const cfg = window.PKC_CONFIG?.wordpress || {};
  const baseUrl = cfg.baseUrl ? cfg.baseUrl.replace(/\/$/, '') : '';
  if(!baseUrl) return;

  const catMap = {
    featured: cfg.categories?.featured || 'noi-bat',
    events: cfg.categories?.su_kien || cfg.categories?.events || 'su-kien',
    pkclear: cfg.categories?.pk_clear || cfg.categories?.pkclear || 'muonline-pkclear',
    updates: cfg.categories?.tin_tuc || cfg.categories?.cap_nhat || 'tin-tuc-cap-nhat',
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

  const escapeHtml = (str = '') => str.toString().replace(/[&<>"]/g, m => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[m]));
  const sanitize = (str = '') => str.toString().replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const shorten = (str = '', limit = 180) => {
    if(str.length <= limit) return str;
    const sliced = str.slice(0, limit).trimEnd();
    return sliced.replace(/[.,;:-]?$/, '') + '...';
  };
  const formatDate = (dateStr) => {
    if(!dateStr) return '';
    try{
      return new Date(dateStr).toLocaleDateString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric' });
    }catch{
      return dateStr.slice(0, 10);
    }
  };
  const getPrimaryCategory = (post) => {
    try{
      const term = post?._embedded?.['wp:term'];
      if(Array.isArray(term)){
        for(const group of term){
          const found = Array.isArray(group) ? group.find(item => item?.taxonomy === 'category') : null;
          if(found?.name) return found.name;
        }
      }
    }catch{/* ignore */}
    return '';
  };
  const setBackdrop = (img) => {
    const value = img ? `url(${img})` : 'none';
    if(blurLayer){
      blurLayer.style.backgroundImage = value;
      blurLayer.style.opacity = img ? '0.28' : '0';
    }
    if(glowLayer){
      glowLayer.style.backgroundImage = value;
      glowLayer.style.opacity = img ? '0.45' : '0';
    }
  };
  const applyRafTransform = (value) => {
    if(!layer) return;
    if(rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => { layer.style.transform = `translateX(${value}px)`; });
  };

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
    url.searchParams.set('per_page', '6');
    url.searchParams.set('_embed', '1');
    try{
      if(slug){
        const id = await resolveCategoryId(slug);
        if(id) url.searchParams.set('categories', id);
      }
      const res = await fetch(url.toString());
      const json = await res.json();
      const list = Array.isArray(json) ? json : [];
      postCache.set(key, list);
      return list;
    }catch{
      postCache.set(key, []);
      return [];
    }
  }

  function updateGhost(el, img){
    if(!el) return;
    if(img){
      el.style.backgroundImage = `url(${img})`;
      el.style.opacity = '0.35';
    }else{
      el.style.backgroundImage = 'none';
      el.style.opacity = '0';
    }
  }

  function updateSlider(){
    if(!sliderPosts.length) return;
    const post = sliderPosts[current] || {};
    const img = post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
    const title = sanitize(post?.title?.rendered || '');
    const link = post?.link || '#';
    const excerpt = shorten(sanitize(post?.excerpt?.rendered || ''), 210);
    const category = getPrimaryCategory(post);
    const meta = [category, formatDate(post?.date)].filter(Boolean).join(' | ');

    if(mainImg){
      if(img){
        mainImg.src = img;
        mainImg.alt = title || 'Bai viet noi bat';
        setBackdrop(img);
      }else{
        mainImg.removeAttribute('src');
        mainImg.alt = 'Bai viet noi bat';
        setBackdrop('');
      }
    }
    if(metaEl) metaEl.textContent = meta;
    if(titleEl){
      titleEl.textContent = title || 'Dang cap nhat';
      titleEl.href = link;
    }
    if(excerptEl) excerptEl.textContent = excerpt;
    if(ctaBtn) ctaBtn.href = link;

    const prev = sliderPosts[(current - 1 + sliderPosts.length) % sliderPosts.length];
    const next = sliderPosts[(current + 1) % sliderPosts.length];
    updateGhost(prevGhost, prev?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '');
    updateGhost(nextGhost, next?._embedded?.['wp:featuredmedia']?.[0]?.source_url || '');

    if(dotsWrap){
      dotsWrap.innerHTML = sliderPosts.map((_, i) => {
        const active = i === current ? 'active' : '';
        return `<button data-index="${i}" class="${active}" aria-label="Xem slide ${i + 1}"></button>`;
      }).join('');
      dotsWrap.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => setCurrent(parseInt(btn.dataset.index, 10)));
      });
    }
    if(layer) layer.style.transform = 'translateX(0)';
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
    timer = setInterval(() => setCurrent(current + 1), 7000);
  }

  async function renderList(key){
    const posts = await fetchPostsByKey(key);
    const items = Array.isArray(posts) ? posts.slice(0, 6) : [];
    if(listEl){
      const fragments = items.map(post => {
        const title = sanitize(post?.title?.rendered || 'Khong co tieu de');
        const link = post?.link || '#';
        const meta = [getPrimaryCategory(post), formatDate(post?.date)].filter(Boolean).join(' | ');
        return `<li><a class="news-list-link" href="${link}" target="_blank" rel="noopener"><span class="truncate">${escapeHtml(title)}</span><span class="news-meta">${escapeHtml(meta)}</span></a></li>`;
      });
      while(fragments.length < 6){
        fragments.push('<li class="news-placeholder"><div class="news-list-link">Dang cap nhat...</div></li>');
      }
      listEl.innerHTML = fragments.join('');
    }
    return posts;
  }

  function bindTabs(){
    tabButtons.forEach(btn => {
      btn.addEventListener('click', async () => {
        const key = btn.dataset.tab || 'featured';
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        root.dataset.activeTab = key;
        const posts = await renderList(key);
        if(posts.length){
          sliderPosts = posts;
          current = 0;
          updateSlider();
          restartAuto();
        }else if(key !== 'featured'){
          const fallback = await fetchPostsByKey('featured');
          if(fallback.length){
            sliderPosts = fallback;
            current = 0;
            updateSlider();
            restartAuto();
          }
        }
      });
    });
    const defaultTab = tabButtons.find(btn => btn.dataset.tab === 'featured') || tabButtons[0];
    if(defaultTab){
      defaultTab.classList.add('active');
      root.dataset.activeTab = defaultTab.dataset.tab || 'featured';
    }
  }

  function bindSliderControls(){
    if(prevBtn) prevBtn.addEventListener('click', () => setCurrent(current - 1));
    if(nextBtn) nextBtn.addEventListener('click', () => setCurrent(current + 1));
    if(stage){
      stage.addEventListener('pointerdown', e => {
        if(!sliderPosts.length) return;
        dragging = true;
        activePointer = e.pointerId;
        dragStartX = e.clientX;
        dragDx = 0;
        stage.setPointerCapture?.(activePointer);
        stage.style.cursor = 'grabbing';
        if(timer) clearInterval(timer);
      });
      stage.addEventListener('pointermove', e => {
        if(!dragging || e.pointerId !== activePointer) return;
        dragDx = e.clientX - dragStartX;
        const limited = Math.max(Math.min(dragDx, 160), -160);
        applyRafTransform(limited * 0.12);
      });
      const release = e => {
        if(!dragging || (e.pointerId !== undefined && e.pointerId !== activePointer)) return;
        applyRafTransform(0);
        stage.style.cursor = 'grab';
        if(activePointer !== null) stage.releasePointerCapture?.(activePointer);
        dragging = false;
        const delta = dragDx;
        dragDx = 0;
        activePointer = null;
        if(Math.abs(delta) > 80){
          if(delta < 0) setCurrent(current + 1);
          else setCurrent(current - 1);
        }else{
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
    if(sliderPosts.length){
      current = 0;
      updateSlider();
      restartAuto();
    }
    await renderList('featured');
  }

  init();
})();
