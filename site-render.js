// =========================================================
// HASSAN PORTFOLIO — Site Renderer
// Runs on every public page (before main.js). Pulls data from
// site-data.js (localStorage, falling back to defaults) and
// paints it into the page: theme, editable text, dynamic
// service/project/achievement lists, images, and contact links.
// =========================================================

(function () {

  function resolvePath(obj, path) {
    return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
  }

  function iconSvg(key) {
    return ICONS[key] || ICONS.grid;
  }

  function renderTextFields(data) {
    document.querySelectorAll('[data-field]').forEach((el) => {
      const val = resolvePath(data, el.getAttribute('data-field'));
      if (val !== undefined && val !== null) el.textContent = val;
    });
  }

  function renderSiteName(data) {
    const name = data.site.name || 'Hassan';
    document.querySelectorAll('[data-site-name]').forEach((el) => { el.textContent = name; });
    document.querySelectorAll('[data-site-name-dot]').forEach((el) => { el.textContent = name + '.'; });
  }

  function renderProfilePhoto(data) {
    const img = document.getElementById('hero-photo');
    if (img && data.images.profilePhoto) {
      img.src = data.images.profilePhoto;
    }
  }

  /* ---------- Services (teaser cards on Home, full cards on Services page) ---------- */

  function renderServiceTeaser(container, services) {
    container.innerHTML = services.map((s, i) => `
      <div class="service-card reveal reveal-delay-${(i % 3)}">
        <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${iconSvg(s.icon)}</svg></div>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.description)}</p>
      </div>
    `).join('');
  }

  function renderServiceDetail(container, services) {
    container.innerHTML = services.map((s, i) => `
      <div class="service-detail-card reveal reveal-delay-${(i % 3)}">
        <div class="service-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">${iconSvg(s.icon)}</svg></div>
        <h3>${escapeHtml(s.title)}</h3>
        <p class="desc">${escapeHtml(s.description)}</p>
        <div class="card-foot">
          <span class="price-tag"><span class="price-amount">$${escapeHtml(s.price)}</span> <span class="price-unit">${escapeHtml(s.unit)}</span></span>
          <a href="contact.html" class="service-link" aria-label="Get started with ${escapeHtml(s.title)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </a>
        </div>
      </div>
    `).join('');
  }

  /* ---------- Projects (featured on Home, full grid on Portfolio) ---------- */

  function projectImg(p) {
    if (p.image) return p.image;
    const map = { 'data-entry': 'thumb-data.svg', 'document': 'thumb-document.svg', 'research': 'thumb-research.svg', 'design': 'thumb-design.svg' };
    return map[p.category] || 'thumb-data.svg';
  }

  function renderFeaturedWork(container, projects) {
    const items = projects.slice(0, 3);
    container.innerHTML = items.map((p, i) => `
      <a class="work-card reveal reveal-delay-${i}" href="portfolio.html">
        <div class="work-thumb">
          <img src="${projectImg(p)}" alt="${escapeHtml(p.title)}">
          <div class="thumb-overlay"><span>View full portfolio →</span></div>
        </div>
        <div class="work-body">
          <span class="work-cat">${escapeHtml(CATEGORY_LABELS[p.category] || '')}</span>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.shortDesc)}</p>
        </div>
      </a>
    `).join('');
  }

  function renderPortfolioGrid(container, projects) {
    container.innerHTML = projects.map((p) => `
      <article class="project-card"
        data-category="${p.category}"
        data-category-label="${escapeHtml(CATEGORY_LABELS[p.category] || '')}"
        data-title="${escapeHtml(p.title)}"
        data-desc="${escapeHtml(p.fullDesc)}">
        <div class="work-thumb">
          <img src="${projectImg(p)}" alt="${escapeHtml(p.title)}">
          <div class="thumb-overlay"><span>View project →</span></div>
        </div>
        <div class="work-body">
          <span class="work-cat">${escapeHtml(CATEGORY_LABELS[p.category] || '')}</span>
          <h3>${escapeHtml(p.title)}</h3>
          <p>${escapeHtml(p.shortDesc)}</p>
        </div>
      </article>
    `).join('');

    // update the filter tab counts
    ['data-entry', 'document', 'research', 'design'].forEach((cat) => {
      const count = projects.filter((p) => p.category === cat).length;
      const tab = document.querySelector(`.filter-tab[data-filter="${cat}"] .filter-count`);
      if (tab) tab.textContent = `(${count})`;
    });
  }

  /* ---------- Achievements (Awards page) ---------- */

  function renderAchievements(container, achievements) {
    container.innerHTML = achievements.map((a, i) => `
      <div class="achievement-card reveal reveal-delay-${(i % 3)}">
        <div class="achievement-badge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9">${iconSvg(a.icon)}</svg></div>
        <div>
          <div class="achievement-meta-row">
            <span class="meta-org">${escapeHtml(a.org)}</span>
            <span>${escapeHtml(a.duration)}</span>
          </div>
          <h3>${escapeHtml(a.title)}</h3>
          <p class="why">${escapeHtml(a.description)}</p>
        </div>
      </div>
    `).join('');
  }

  /* ---------- Contact info + footer/social links (every page) ---------- */

  function renderContactLinks(data) {
    const c = data.contact;

    document.querySelectorAll('[data-contact="email-text"]').forEach((el) => { el.textContent = c.email; });
    document.querySelectorAll('[data-contact="email-href"]').forEach((el) => { el.href = 'mailto:' + c.email; });
    document.querySelectorAll('[data-contact="whatsapp-text"]').forEach((el) => { el.textContent = c.whatsappText; });
    document.querySelectorAll('[data-contact="response-time"]').forEach((el) => { el.textContent = c.responseTime; });
    document.querySelectorAll('[data-contact="fiverr-href"]').forEach((el) => { el.href = c.fiverrUrl; });
    document.querySelectorAll('[data-contact="linkedin-href"]').forEach((el) => { el.href = c.linkedinUrl; });
  }

  function populateProjectTypeOptions(services) {
    const select = document.getElementById('project-type');
    if (!select) return;
    const current = select.value;
    const opts = ['<option value="" disabled selected>Select a service</option>']
      .concat(services.map((s) => `<option value="${s.id}">${escapeHtml(s.title)}</option>`))
      .concat(['<option value="other">Something else</option>']);
    select.innerHTML = opts.join('');
    if (current) select.value = current;
  }

  /* ---------- utility ---------- */

  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- main ---------- */

  function render() {
    const data = getSiteData();

    applyTheme(data.theme);
    renderSiteName(data);
    renderTextFields(data);
    renderProfilePhoto(data);
    renderContactLinks(data);

    const teaserGrid = document.getElementById('services-teaser-grid');
    if (teaserGrid) renderServiceTeaser(teaserGrid, data.services);

    const fullServicesGrid = document.getElementById('services-full-grid');
    if (fullServicesGrid) renderServiceDetail(fullServicesGrid, data.services);

    const featuredGrid = document.getElementById('featured-work-grid');
    if (featuredGrid) renderFeaturedWork(featuredGrid, data.projects);

    const portfolioGrid = document.getElementById('portfolio-grid');
    if (portfolioGrid) renderPortfolioGrid(portfolioGrid, data.projects);

    const achievementsGrid = document.getElementById('achievements-grid');
    if (achievementsGrid) renderAchievements(achievementsGrid, data.achievements);

    populateProjectTypeOptions(data.services);
  }

  // Run as early as possible so main.js (which wires up filters,
  // reveal observers, and the lightbox) sees the final DOM.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }

})();
