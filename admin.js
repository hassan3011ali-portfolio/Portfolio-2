// =========================================================
// HASSAN PORTFOLIO — Admin Panel
// Everything here reads/writes through site-data.js's
// getSiteData()/saveSiteData() so changes are instantly
// reflected on the public pages (same browser/device).
// =========================================================

let ADMIN_DATA = null;

/* ---------------------------------------------------------
   AUTH
--------------------------------------------------------- */

const SESSION_KEY = 'hassanAdminSession';

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

function login(username, password) {
  const data = getSiteData();
  if (username === data.credentials.username && password === data.credentials.password) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.reload();
}

function boot() {
  applyTheme(getSiteData().theme);

  const loginScreen = document.getElementById('login-screen');
  const shell = document.getElementById('admin-shell');

  if (isLoggedIn()) {
    loginScreen.style.display = 'none';
    shell.classList.add('active');
    initDashboard();
  } else {
    loginScreen.style.display = 'flex';
    shell.classList.remove('active');
  }

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('login-username').value.trim();
    const p = document.getElementById('login-password').value;
    if (login(u, p)) {
      document.getElementById('login-screen').style.display = 'none';
      document.getElementById('admin-shell').classList.add('active');
      initDashboard();
    } else {
      const err = document.getElementById('login-error');
      err.classList.add('show');
      err.textContent = 'Incorrect username or password. Try again.';
    }
  });
}

/* ---------------------------------------------------------
   TOAST
--------------------------------------------------------- */

function toast(msg) {
  const el = document.getElementById('admin-toast');
  el.querySelector('span').textContent = msg;
  el.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------------------------------------------------------
   DASHBOARD BOOTSTRAP
--------------------------------------------------------- */

function initDashboard() {
  ADMIN_DATA = getSiteData();

  document.querySelectorAll('.admin-nav-btn').forEach((btn) => {
    btn.addEventListener('click', () => showPanel(btn.dataset.panel));
  });
  document.getElementById('logout-btn').addEventListener('click', logout);

  renderOverview();
  renderHomeForm();
  renderAboutForm();
  renderContactForm();
  renderPageHeroForms();
  renderServicesEditor();
  renderPortfolioEditor();
  renderAwardsEditor();
  renderImagesForm();
  renderThemePicker();
  renderSettingsForm();
  initGitHubPublisher();

  showPanel('overview');
}

function showPanel(key) {
  document.querySelectorAll('.admin-panel').forEach((p) => p.classList.toggle('active', p.dataset.panel === key));
  document.querySelectorAll('.admin-nav-btn').forEach((b) => b.classList.toggle('active', b.dataset.panel === key));
  document.getElementById('admin-main').scrollTop = 0;
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function persist(successMsg) {
  saveSiteData(ADMIN_DATA);
  toast(successMsg || 'Saved — live on the site now.');
  renderOverview();
}

/* ---------------------------------------------------------
   OVERVIEW
--------------------------------------------------------- */

function renderOverview() {
  const el = document.getElementById('panel-overview');
  el.innerHTML = `
    <div class="admin-panel-head">
      <h2>Welcome back, ${escapeHtml(ADMIN_DATA.site.name)}.</h2>
      <p>Changes are saved in this browser. Use Settings → Publish Changes to GitHub to update your public website.</p>
    </div>
    <div class="overview-grid">
      <div class="overview-card"><div class="num">${ADMIN_DATA.services.length}</div><div class="label">Services listed</div></div>
      <div class="overview-card"><div class="num">${ADMIN_DATA.projects.length}</div><div class="label">Portfolio projects</div></div>
      <div class="overview-card"><div class="num">${ADMIN_DATA.achievements.length}</div><div class="label">Awards &amp; achievements</div></div>
    </div>
    <div class="admin-card">
      <h3>Quick tips</h3>
      <p class="hint">A few things worth knowing while you're getting started.</p>
      <ul style="color:var(--text-secondary); font-size:0.92rem; line-height:1.9; padding-left:20px;">
        <li>Changes save to <em>this browser</em>. Use <strong>Publish Changes to GitHub</strong> in Settings to update the public site.</li>
        <li>Use the sidebar to jump straight to the page or feature you want to edit.</li>
        <li>The theme switcher previews changes instantly. Publish from Settings to update the public GitHub site.</li>
        <li>Visit <strong>Settings</strong> to change your login password before the site goes live.</li>
      </ul>
    </div>
    <a href="index.html" target="_blank" class="admin-secondary-btn" style="display:inline-flex; align-items:center; gap:8px;">
      View Live Site
      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17 17 7M7 7h10v10"/></svg>
    </a>
  `;
}

/* ---------------------------------------------------------
   HOME PAGE TEXT
--------------------------------------------------------- */

function renderHomeForm() {
  const d = ADMIN_DATA.home;
  const el = document.getElementById('panel-home');
  el.innerHTML = `
    <div class="admin-panel-head">
      <h2>Home Page</h2>
      <p>Edit the hero text, key stats, and closing call-to-action shown on your homepage.</p>
    </div>

    <div class="admin-card">
      <h3>Hero</h3>
      <p class="hint">Your site name updates the header, footer, and hero heading everywhere.</p>
      <div class="admin-form-row">
        <div class="admin-form-group"><label>Your Name</label><input id="f-site-name" value="${escapeAttr(ADMIN_DATA.site.name)}"></div>
        <div class="admin-form-group"><label>Role / Title</label><input id="f-hero-role" value="${escapeAttr(d.heroRole)}"></div>
      </div>
      <div class="admin-form-group"><label>Tagline</label><textarea id="f-hero-tagline">${escapeHtml(d.heroTagline)}</textarea></div>
      <button class="admin-save-btn" id="save-home-hero">Save Hero</button>
    </div>

    <div class="admin-card">
      <h3>Key Stats</h3>
      <p class="hint">Shown just below the hero call-to-action buttons.</p>
      ${d.stats.map((s, i) => `
        <div class="admin-form-row">
          <div class="admin-form-group"><label>Stat ${i + 1} Value</label><input class="stat-value" data-i="${i}" value="${escapeAttr(s.value)}"></div>
          <div class="admin-form-group"><label>Stat ${i + 1} Label</label><input class="stat-label" data-i="${i}" value="${escapeAttr(s.label)}"></div>
        </div>
      `).join('')}
      <button class="admin-save-btn" id="save-home-stats">Save Stats</button>
    </div>

    <div class="admin-card">
      <h3>Closing Call-To-Action</h3>
      <div class="admin-form-group"><label>Heading</label><input id="f-cta-heading" value="${escapeAttr(d.ctaHeading)}"></div>
      <div class="admin-form-group"><label>Text</label><textarea id="f-cta-text">${escapeHtml(d.ctaText)}</textarea></div>
      <button class="admin-save-btn" id="save-home-cta">Save CTA</button>
    </div>
  `;

  document.getElementById('save-home-hero').addEventListener('click', () => {
    ADMIN_DATA.site.name = document.getElementById('f-site-name').value.trim() || 'Hassan';
    d.heroRole = document.getElementById('f-hero-role').value;
    d.heroTagline = document.getElementById('f-hero-tagline').value;
    persist('Hero saved.');
  });

  document.getElementById('save-home-stats').addEventListener('click', () => {
    document.querySelectorAll('.stat-value').forEach((inp) => { d.stats[inp.dataset.i].value = inp.value; });
    document.querySelectorAll('.stat-label').forEach((inp) => { d.stats[inp.dataset.i].label = inp.value; });
    persist('Stats saved.');
  });

  document.getElementById('save-home-cta').addEventListener('click', () => {
    d.ctaHeading = document.getElementById('f-cta-heading').value;
    d.ctaText = document.getElementById('f-cta-text').value;
    persist('Call-to-action saved.');
  });
}

/* ---------------------------------------------------------
   ABOUT PAGE TEXT
--------------------------------------------------------- */

function renderAboutForm() {
  const d = ADMIN_DATA.about;
  const el = document.getElementById('panel-about');
  el.innerHTML = `
    <div class="admin-panel-head">
      <h2>About Page</h2>
      <p>Edit your story, exactly as it appears on the About page.</p>
    </div>
    <div class="admin-card">
      <div class="admin-form-group"><label>Subheading (under the page title)</label><textarea id="f-about-subtitle">${escapeHtml(d.heroSubtitle)}</textarea></div>
      <div class="admin-form-group"><label>Story — Paragraph 1</label><textarea id="f-about-intro">${escapeHtml(d.storyIntro)}</textarea></div>
      <div class="admin-form-group"><label>Story — Paragraph 2</label><textarea id="f-about-body">${escapeHtml(d.storyBody)}</textarea></div>
      <div class="admin-form-group"><label>Highlighted Mission Quote</label><textarea id="f-about-quote">${escapeHtml(d.missionQuote)}</textarea></div>
      <div class="admin-form-group"><label>Story — Closing Paragraph</label><textarea id="f-about-close">${escapeHtml(d.storyClose)}</textarea></div>
      <button class="admin-save-btn" id="save-about">Save About Page</button>
    </div>
  `;

  document.getElementById('save-about').addEventListener('click', () => {
    d.heroSubtitle = document.getElementById('f-about-subtitle').value;
    d.storyIntro = document.getElementById('f-about-intro').value;
    d.storyBody = document.getElementById('f-about-body').value;
    d.missionQuote = document.getElementById('f-about-quote').value;
    d.storyClose = document.getElementById('f-about-close').value;
    persist('About page saved.');
  });
}

/* ---------------------------------------------------------
   SERVICES / PORTFOLIO / AWARDS / CONTACT page hero subtitles
   (grouped into one small panel each lives inside its manager)
--------------------------------------------------------- */

function renderPageHeroForms() {
  // Services page subtitle lives inside the Services panel
  const sEl = document.getElementById('services-hero-form');
  sEl.innerHTML = `
    <div class="admin-form-group"><label>Page Subheading</label><textarea id="f-services-subtitle">${escapeHtml(ADMIN_DATA.servicesPage.heroSubtitle)}</textarea></div>
    <button class="admin-save-btn" id="save-services-hero">Save</button>
  `;
  document.getElementById('save-services-hero').addEventListener('click', () => {
    ADMIN_DATA.servicesPage.heroSubtitle = document.getElementById('f-services-subtitle').value;
    persist('Services page heading saved.');
  });

  const pEl = document.getElementById('portfolio-hero-form');
  pEl.innerHTML = `
    <div class="admin-form-group"><label>Page Subheading</label><textarea id="f-portfolio-subtitle">${escapeHtml(ADMIN_DATA.portfolioPage.heroSubtitle)}</textarea></div>
    <button class="admin-save-btn" id="save-portfolio-hero">Save</button>
  `;
  document.getElementById('save-portfolio-hero').addEventListener('click', () => {
    ADMIN_DATA.portfolioPage.heroSubtitle = document.getElementById('f-portfolio-subtitle').value;
    persist('Portfolio page heading saved.');
  });

  const aEl = document.getElementById('awards-hero-form');
  aEl.innerHTML = `
    <div class="admin-form-group"><label>Page Subheading</label><textarea id="f-awards-subtitle">${escapeHtml(ADMIN_DATA.awardsPage.heroSubtitle)}</textarea></div>
    <button class="admin-save-btn" id="save-awards-hero">Save</button>
  `;
  document.getElementById('save-awards-hero').addEventListener('click', () => {
    ADMIN_DATA.awardsPage.heroSubtitle = document.getElementById('f-awards-subtitle').value;
    persist('Awards page heading saved.');
  });

  const cEl = document.getElementById('contact-hero-form');
  cEl.innerHTML = `
    <div class="admin-form-group"><label>Page Subheading</label><textarea id="f-contact-subtitle">${escapeHtml(ADMIN_DATA.contact.heroSubtitle)}</textarea></div>
    <button class="admin-save-btn" id="save-contact-hero">Save</button>
  `;
  document.getElementById('save-contact-hero').addEventListener('click', () => {
    ADMIN_DATA.contact.heroSubtitle = document.getElementById('f-contact-subtitle').value;
    persist('Contact page heading saved.');
  });
}

/* ---------------------------------------------------------
   SERVICES MANAGER
--------------------------------------------------------- */

const ICON_OPTIONS = ['grid', 'doc', 'user', 'mic', 'search', 'layers', 'trophy', 'handshake', 'archive', 'star', 'design', 'audio'];

function iconOptionsHtml(selected) {
  return ICON_OPTIONS.map((k) => `<option value="${k}" ${k === selected ? 'selected' : ''}>${k}</option>`).join('');
}

function renderServicesEditor() {
  const el = document.getElementById('services-list');

  function draw() {
    el.innerHTML = ADMIN_DATA.services.map((s, i) => `
      <div class="admin-list-item" data-id="${s.id}">
        <div class="admin-list-item-head">
          <span class="tag">Service ${i + 1}</span>
          <button class="admin-remove-btn" data-remove="${s.id}" title="Remove">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="admin-form-row">
          <div class="admin-form-group"><label>Title</label><input class="svc-title" value="${escapeAttr(s.title)}"></div>
          <div class="admin-form-group"><label>Icon</label><select class="svc-icon">${iconOptionsHtml(s.icon)}</select></div>
        </div>
        <div class="admin-form-group"><label>Description</label><textarea class="svc-desc">${escapeHtml(s.description)}</textarea></div>
        <div class="admin-form-row">
          <div class="admin-form-group"><label>Starting Price ($)</label><input class="svc-price" value="${escapeAttr(s.price)}"></div>
          <div class="admin-form-group"><label>Unit</label><input class="svc-unit" value="${escapeAttr(s.unit)}" placeholder="/ hour, / project..."></div>
        </div>
      </div>
    `).join('');

    el.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ADMIN_DATA.services = ADMIN_DATA.services.filter((s) => s.id !== btn.dataset.remove);
        draw();
      });
    });
  }

  draw();

  document.getElementById('add-service-btn').onclick = () => {
    ADMIN_DATA.services.push({ id: uid('s'), icon: 'grid', title: 'New Service', description: 'Describe what this service includes.', price: '10', unit: '/ hour' });
    draw();
  };

  document.getElementById('save-services-btn').onclick = () => {
    const items = el.querySelectorAll('.admin-list-item');
    ADMIN_DATA.services = Array.from(items).map((item, i) => ({
      id: ADMIN_DATA.services[i] ? ADMIN_DATA.services[i].id : uid('s'),
      icon: item.querySelector('.svc-icon').value,
      title: item.querySelector('.svc-title').value,
      description: item.querySelector('.svc-desc').value,
      price: item.querySelector('.svc-price').value,
      unit: item.querySelector('.svc-unit').value
    }));
    persist('Services saved — Home and Services pages updated.');
    draw();
  };
}

/* ---------------------------------------------------------
   PORTFOLIO MANAGER
--------------------------------------------------------- */

function readImageResized(file, maxWidth, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxWidth / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      callback(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function renderPortfolioEditor() {
  const el = document.getElementById('portfolio-list');

  function draw() {
    el.innerHTML = ADMIN_DATA.projects.map((p, i) => `
      <div class="admin-list-item" data-id="${p.id}">
        <div class="admin-list-item-head">
          <span class="tag">Project ${i + 1}</span>
          <button class="admin-remove-btn" data-remove="${p.id}" title="Remove">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="admin-image-upload" style="margin-bottom:18px;">
          <img class="admin-image-preview proj-preview" src="${p.image || (p.category === 'document' ? 'thumb-document.svg' : p.category === 'research' ? 'thumb-research.svg' : p.category === 'design' ? 'thumb-design.svg' : 'thumb-data.svg')}" alt="">
          <label class="admin-upload-btn">Upload Thumbnail
            <input type="file" accept="image/*" class="proj-image-input">
          </label>
        </div>
        <div class="admin-form-row">
          <div class="admin-form-group"><label>Title</label><input class="proj-title" value="${escapeAttr(p.title)}"></div>
          <div class="admin-form-group"><label>Category</label>
            <select class="proj-category">
              <option value="data-entry" ${p.category === 'data-entry' ? 'selected' : ''}>Data Entry &amp; Excel</option>
              <option value="document" ${p.category === 'document' ? 'selected' : ''}>Document Conversion &amp; Transcription</option>
              <option value="research" ${p.category === 'research' ? 'selected' : ''}>Research &amp; Specialized</option>
              <option value="design" ${p.category === 'design' ? 'selected' : ''}>Design &amp; Creative</option>
            </select>
          </div>
        </div>
        <div class="admin-form-group"><label>Short Description (shown on the card)</label><textarea class="proj-short">${escapeHtml(p.shortDesc)}</textarea></div>
        <div class="admin-form-group"><label>Full Description (shown in lightbox)</label><textarea class="proj-full">${escapeHtml(p.fullDesc)}</textarea></div>
      </div>
    `).join('');

    el.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ADMIN_DATA.projects = ADMIN_DATA.projects.filter((p) => p.id !== btn.dataset.remove);
        draw();
      });
    });

    el.querySelectorAll('.proj-image-input').forEach((input) => {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        readImageResized(file, 900, (dataUrl) => {
          const item = input.closest('.admin-list-item');
          item.querySelector('.proj-preview').src = dataUrl;
          item.dataset.newImage = dataUrl;
        });
      });
    });
  }

  draw();

  document.getElementById('add-project-btn').onclick = () => {
    ADMIN_DATA.projects.push({ id: uid('p'), category: 'data-entry', title: 'New Project', shortDesc: 'Short one-line description.', fullDesc: 'Full project description shown in the lightbox.', image: null });
    draw();
  };

  document.getElementById('save-portfolio-btn').onclick = () => {
    const items = el.querySelectorAll('.admin-list-item');
    ADMIN_DATA.projects = Array.from(items).map((item, i) => ({
      id: ADMIN_DATA.projects[i] ? ADMIN_DATA.projects[i].id : uid('p'),
      category: item.querySelector('.proj-category').value,
      title: item.querySelector('.proj-title').value,
      shortDesc: item.querySelector('.proj-short').value,
      fullDesc: item.querySelector('.proj-full').value,
      image: item.dataset.newImage || (ADMIN_DATA.projects[i] ? ADMIN_DATA.projects[i].image : null)
    }));
    persist('Portfolio saved — Home and Portfolio pages updated.');
    draw();
  };
}

/* ---------------------------------------------------------
   AWARDS MANAGER
--------------------------------------------------------- */

function renderAwardsEditor() {
  const el = document.getElementById('awards-list');

  function draw() {
    el.innerHTML = ADMIN_DATA.achievements.map((a, i) => `
      <div class="admin-list-item" data-id="${a.id}">
        <div class="admin-list-item-head">
          <span class="tag">Achievement ${i + 1}</span>
          <button class="admin-remove-btn" data-remove="${a.id}" title="Remove">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="admin-form-row">
          <div class="admin-form-group"><label>Title</label><input class="ach-title" value="${escapeAttr(a.title)}"></div>
          <div class="admin-form-group"><label>Icon</label><select class="ach-icon">${iconOptionsHtml(a.icon)}</select></div>
        </div>
        <div class="admin-form-row">
          <div class="admin-form-group"><label>Associated With</label><input class="ach-org" value="${escapeAttr(a.org)}"></div>
          <div class="admin-form-group"><label>Year / Duration</label><input class="ach-duration" value="${escapeAttr(a.duration)}"></div>
        </div>
        <div class="admin-form-group"><label>Why It Matters</label><textarea class="ach-desc">${escapeHtml(a.description)}</textarea></div>
      </div>
    `).join('');

    el.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        ADMIN_DATA.achievements = ADMIN_DATA.achievements.filter((a) => a.id !== btn.dataset.remove);
        draw();
      });
    });
  }

  draw();

  document.getElementById('add-award-btn').onclick = () => {
    ADMIN_DATA.achievements.push({ id: uid('a'), icon: 'star', title: 'New Achievement', org: 'Client / Organization', duration: 'Year', description: 'Why this achievement matters.' });
    draw();
  };

  document.getElementById('save-awards-btn').onclick = () => {
    const items = el.querySelectorAll('.admin-list-item');
    ADMIN_DATA.achievements = Array.from(items).map((item, i) => ({
      id: ADMIN_DATA.achievements[i] ? ADMIN_DATA.achievements[i].id : uid('a'),
      icon: item.querySelector('.ach-icon').value,
      title: item.querySelector('.ach-title').value,
      org: item.querySelector('.ach-org').value,
      duration: item.querySelector('.ach-duration').value,
      description: item.querySelector('.ach-desc').value
    }));
    persist('Awards saved.');
    draw();
  };
}

/* ---------------------------------------------------------
   CONTACT & SOCIALS
--------------------------------------------------------- */

function renderContactForm() {
  const d = ADMIN_DATA.contact;
  const el = document.getElementById('panel-contact');
  el.innerHTML = `
    <div class="admin-panel-head">
      <h2>Contact &amp; Social Links</h2>
      <p>Updates the Contact page and the footer on every page.</p>
    </div>
    <div class="admin-card">
      <div id="contact-hero-form"></div>
    </div>
    <div class="admin-card">
      <h3>Contact Details</h3>
      <div class="admin-form-row">
        <div class="admin-form-group"><label>Email</label><input id="f-email" value="${escapeAttr(d.email)}"></div>
        <div class="admin-form-group"><label>Response Time</label><input id="f-response" value="${escapeAttr(d.responseTime)}"></div>
      </div>
      <div class="admin-form-group"><label>WhatsApp</label><input id="f-whatsapp" value="${escapeAttr(d.whatsappText)}" placeholder="A number, or 'Available on request'"></div>
      <div class="admin-form-row">
        <div class="admin-form-group"><label>Fiverr Profile URL</label><input id="f-fiverr" value="${escapeAttr(d.fiverrUrl)}"></div>
        <div class="admin-form-group"><label>LinkedIn URL</label><input id="f-linkedin" value="${escapeAttr(d.linkedinUrl)}"></div>
      </div>
      <button class="admin-save-btn" id="save-contact-btn">Save Contact Info</button>
    </div>
  `;

  document.getElementById('save-contact-btn').addEventListener('click', () => {
    d.email = document.getElementById('f-email').value.trim();
    d.responseTime = document.getElementById('f-response').value;
    d.whatsappText = document.getElementById('f-whatsapp').value;
    d.fiverrUrl = document.getElementById('f-fiverr').value.trim();
    d.linkedinUrl = document.getElementById('f-linkedin').value.trim();
    persist('Contact info saved — updated everywhere it appears.');
  });
}

/* ---------------------------------------------------------
   IMAGES
--------------------------------------------------------- */

function renderImagesForm() {
  const el = document.getElementById('panel-images');
  el.innerHTML = `
    <div class="admin-panel-head">
      <h2>Images</h2>
      <p>Your profile photo appears in the Home page hero. Project thumbnails are managed inside the Portfolio Manager, since each one belongs to a specific project.</p>
    </div>
    <div class="admin-card">
      <h3>Profile Photo</h3>
      <div class="admin-image-upload">
        <img class="admin-image-preview" id="profile-preview" src="${ADMIN_DATA.images.profilePhoto || 'headshot-placeholder.svg'}" alt="">
        <label class="admin-upload-btn">Upload New Photo
          <input type="file" accept="image/*" id="profile-image-input">
        </label>
      </div>
      <p class="hint" style="margin-top:16px;">Square-ish photos work best. Images are automatically resized for the web when you upload them.</p>
      <button class="admin-save-btn" id="save-profile-btn" style="margin-top:10px;">Save Photo</button>
    </div>
    <div class="admin-card">
      <h3>Portfolio Thumbnails</h3>
      <p class="hint">Go to <strong>Portfolio Manager</strong> in the sidebar — each project there has its own thumbnail upload.</p>
      <button class="admin-secondary-btn" id="jump-to-portfolio-btn">Open Portfolio Manager</button>
    </div>
  `;

  let pendingPhoto = null;

  document.getElementById('profile-image-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    readImageResized(file, 800, (dataUrl) => {
      document.getElementById('profile-preview').src = dataUrl;
      pendingPhoto = dataUrl;
    });
  });

  document.getElementById('save-profile-btn').addEventListener('click', () => {
    if (pendingPhoto) ADMIN_DATA.images.profilePhoto = pendingPhoto;
    persist('Profile photo saved.');
  });

  document.getElementById('jump-to-portfolio-btn').addEventListener('click', () => showPanel('portfolio'));
}

/* ---------------------------------------------------------
   THEME
--------------------------------------------------------- */

function renderThemePicker() {
  const el = document.getElementById('panel-theme');
  const keys = Object.keys(THEMES);
  el.innerHTML = `
    <div class="admin-panel-head">
      <h2>Color Theme</h2>
      <p>Pick a theme — it applies instantly across every page of the live site.</p>
    </div>
    <div class="admin-card">
      <div class="theme-grid" id="theme-grid">
        ${keys.map((key) => {
          const t = THEMES[key];
          return `
            <div class="theme-option ${ADMIN_DATA.theme === key ? 'active' : ''}" data-theme="${key}">
              <div class="theme-swatch-row">
                ${t.swatch.map((c) => `<div class="theme-swatch" style="background:${c}"></div>`).join('')}
              </div>
              <div class="theme-name">${t.label}</div>
              <div class="theme-check">✓ Active now</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  el.querySelectorAll('.theme-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      const key = opt.dataset.theme;
      ADMIN_DATA.theme = key;
      applyTheme(key);
      saveSiteData(ADMIN_DATA);
      el.querySelectorAll('.theme-option').forEach((o) => o.classList.remove('active'));
      opt.classList.add('active');
      toast(`Theme changed to ${THEMES[key].label} — live everywhere now.`);
    });
  });
}

/* ---------------------------------------------------------
   SETTINGS (password + reset)
--------------------------------------------------------- */

function renderSettingsForm() {
  const el = document.getElementById('panel-settings');
  el.innerHTML = `
    <div class="admin-panel-head">
      <h2>Settings</h2>
      <p>Manage your login and reset options.</p>
    </div>
    <div class="admin-card">
      <h3>Change Login Credentials</h3>
      <p class="hint">Do this before the site goes live — the panel ships with a known default password.</p>
      <div class="admin-form-row">
        <div class="admin-form-group"><label>Username</label><input id="f-username" value="${escapeAttr(ADMIN_DATA.credentials.username)}"></div>
        <div class="admin-form-group"><label>New Password</label><input id="f-password" type="text" value="${escapeAttr(ADMIN_DATA.credentials.password)}"></div>
      </div>
      <button class="admin-save-btn" id="save-credentials-btn">Update Credentials</button>
    </div>
    <div class="admin-card" id="github-publish-card">
      <h3>Publish Changes to GitHub</h3>
      <p class="hint">Make and save your edits in the Admin Panel, then click Publish. The publisher updates <strong>published-data.js</strong> in your Portfolio-2 repository. Your token is kept only in this browser session and is never written into the website files.</p>
      <div class="admin-form-row">
        <div class="admin-form-group"><label>GitHub Username</label><input id="gh-owner" value="hassan3011ali-portfolio" autocomplete="off"></div>
        <div class="admin-form-group"><label>Repository</label><input id="gh-repo" value="Portfolio-2" autocomplete="off"></div>
      </div>
      <div class="admin-form-row">
        <div class="admin-form-group"><label>Branch</label><input id="gh-branch" value="main" autocomplete="off"></div>
        <div class="admin-form-group"><label>Fine-grained GitHub Token</label><input id="gh-token" type="password" placeholder="Paste token here" autocomplete="new-password"></div>
      </div>
      <button class="admin-save-btn" id="publish-github-btn">Publish Current Changes to GitHub</button>
      <div id="github-publish-status" class="hint" style="margin-top:12px;"></div>
      <p class="hint" style="margin-top:16px;">
        First time only: create a GitHub fine-grained token with <strong>Contents: Read and write</strong>
        access for this repository. Do not share the token with anyone.
      </p>
    </div>
    <div class="admin-card">
      <h3>Reset All Content</h3>
      <p class="hint">Wipes every edit made in this browser and restores the site's original built-in content. This cannot be undone.</p>
      <button class="admin-danger-btn" id="reset-data-btn">Reset to Defaults</button>
    </div>
  `;

  document.getElementById('save-credentials-btn').addEventListener('click', () => {
    const u = document.getElementById('f-username').value.trim();
    const p = document.getElementById('f-password').value;
    if (!u || !p) { toast('Username and password cannot be empty.'); return; }
    ADMIN_DATA.credentials.username = u;
    ADMIN_DATA.credentials.password = p;
    persist('Login credentials updated.');
  });

  document.getElementById('reset-data-btn').addEventListener('click', () => {
    if (confirm('This will erase every change made in the Admin Panel and restore the original content. Continue?')) {
      resetSiteData();
      window.location.reload();
    }
  });
}

/* ---------------------------------------------------------
   utility
--------------------------------------------------------- */

function escapeHtml(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', boot);


/* ---------------------------------------------------------
   GITHUB PUBLISHER
--------------------------------------------------------- */
function initGitHubPublisher() {
  const tokenInput = document.getElementById('gh-token');
  const savedToken = sessionStorage.getItem('hassanGithubPublishToken');
  if (tokenInput && savedToken) tokenInput.value = savedToken;
  const btn = document.getElementById('publish-github-btn');
  if (btn) btn.addEventListener('click', publishCurrentDataToGitHub);
}

function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

async function publishCurrentDataToGitHub() {
  const owner = document.getElementById('gh-owner').value.trim();
  const repo = document.getElementById('gh-repo').value.trim();
  const branch = document.getElementById('gh-branch').value.trim() || 'main';
  const token = document.getElementById('gh-token').value.trim();
  const status = document.getElementById('github-publish-status');
  const btn = document.getElementById('publish-github-btn');
  if (!owner || !repo || !token) { status.textContent = 'Please enter your GitHub username, repository, branch, and token.'; return; }
  sessionStorage.setItem('hassanGithubPublishToken', token);
  btn.disabled = true; btn.textContent = 'Publishing...'; status.textContent = 'Uploading your changes...';
  try {
    const url = `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/contents/published-data.js`;
    const headers = { 'Accept':'application/vnd.github+json', 'Authorization':`Bearer ${token}`, 'X-GitHub-Api-Version':'2022-11-28', 'Content-Type':'application/json' };
    let sha = null;
    const existing = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, {headers});
    if (existing.ok) sha = (await existing.json()).sha;
    else if (existing.status !== 404) { const e = await existing.json().catch(()=>({})); throw new Error(e.message || `GitHub returned ${existing.status}.`); }
    // Never publish Admin login credentials into a public JavaScript file.
    // Only portfolio/site content is sent to GitHub.
    const publicData = JSON.parse(JSON.stringify(ADMIN_DATA));
    delete publicData.credentials;
    const published = `// Generated by Hassan Portfolio Admin Panel.\\n// Do not edit manually.\\nwindow.PUBLISHED_SITE_DATA = ${JSON.stringify(publicData, null, 2)};\\n`;
    const body = { message:'Update portfolio from Admin Panel', content:utf8ToBase64(published), branch };
    if (sha) body.sha = sha;
    const response = await fetch(url,{method:'PUT',headers,body:JSON.stringify(body)});
    const result = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(result.message || `GitHub returned ${response.status}.`);
    status.textContent = 'Published successfully. Your GitHub Pages site should update within a minute or two.';
    toast('Published to GitHub successfully.');
  } catch (err) {
    console.error(err); status.textContent = `Publish failed: ${err.message}`; toast('GitHub publish failed.');
  } finally { btn.disabled=false; btn.textContent='Publish Current Changes to GitHub'; }
}
