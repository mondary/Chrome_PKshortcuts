/* PK Shortcuts promo. All browser scenes use fictitious tabs. URLCleaner is production code. */
(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  let lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
  const t = (fr, en) => lang === 'en' ? en : fr;
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  let userReduced = false;
  const reduced = () => userReduced || motionQuery.matches;
  const hasGSAP = !!window.gsap;
  if (hasGSAP && window.ScrollTrigger && window.Flip) gsap.registerPlugin(ScrollTrigger, Flip);
  const originals = new Map();
  $$('[data-en]').forEach(el => originals.set(el, el.innerHTML));
  $$('[data-en-label]').forEach(el => originals.set(el, el.getAttribute('aria-label')));
  $$('[data-en-placeholder]').forEach(el => originals.set(el, el.getAttribute('placeholder')));

  const seed = () => [
    { id: 1, fr: 'Projet Atlas', en: 'Project Atlas', url: 'https://example.org/atlas', kind: 'notes' },
    { id: 2, fr: 'Field Notes', en: 'Field Notes', url: 'https://example.com/notes?utm_source=mail', kind: 'article' },
    { id: 3, fr: 'Recherche', en: 'Research', url: 'https://example.net/research', kind: 'notes' },
    { id: 4, fr: 'Field Notes', en: 'Field Notes', url: 'https://example.com/notes', kind: 'article' },
    { id: 5, fr: 'Inspiration', en: 'Inspiration', url: 'https://example.org/inspiration', kind: 'article' }
  ];
  let tabs = seed(), activeId = 2, demo = 'navigate', split = false, detached = false, groupsCollapsed = false, translation = false;
  let storyStep = 0, mode = 'balanced', gallery = 'features', tourTimer = null, mm = null;

  function browserMarkup(items, active, { secondary = false, interactive = false, collapsed = false } = {}) {
    const current = items.find(tab => tab.id === active) || items[0];
    const showNotes = current?.kind === 'notes';
    const visibleItems = collapsed ? items.filter(tab => (tab.id < 4) === (active < 4) || tab.pinned) : items;
    return `<div class="chrome-top"><span class="traffic" aria-hidden="true"><i></i><i></i><i></i></span><div class="tab-strip" role="tablist" aria-label="${t('Onglets de démonstration','Demo tabs')}">${visibleItems.map(tab => `<button class="fake-tab${tab.pinned ? ' pinned' : ''}" role="tab" aria-selected="${tab.id === active}" data-tab="${tab.id}" tabindex="${interactive && tab.id === active ? 0 : -1}" aria-label="${tab[lang]}"><span class="tab-dot"></span><span>${tab[lang]}${tab.muted ? ' ♫̸' : ''}</span></button>`).join('')}</div></div>
      <div class="address-row"><span aria-hidden="true">‹ &nbsp; › &nbsp; ↻</span><span class="address">${secondary ? 'example.org/atlas' : (current?.url || 'https://example.com/notes').replace('https://','').split('?')[0]}</span><span class="audio-indicator" aria-hidden="true">☆</span><span class="browser-extension"><img src="assets/icon.png" alt="PK"><b>${items.length}</b></span><span aria-hidden="true">⋮</span></div>
      <div class="group-strip"><span>${t('Recherche','Research')} ${collapsed && active >= 4 ? '▸' : '▾'}</span><span>${t('Personnel','Personal')} ${collapsed && active < 4 ? '▸' : '▾'}</span><small>${t('Espace de démonstration','Demo workspace')}</small></div>
      ${showNotes ? `<div class="browser-article notes-page"><div class="article-text"><div class="article-kicker"><span>ATLAS / STUDIO</span><span>2026</span></div><h3>${t('De la place<br>pour la suite.','Room for<br>what’s next.')}</h3><p>${t('Un projet, quelques idées, et une nouvelle perspective.','A project, a few ideas, and a fresh perspective.')}</p><div class="note-item"><i></i>${t('Explorer de nouvelles pistes','Explore a new direction')}</div><div class="note-item"><i></i>${t('Garder les bonnes références','Keep the good references')}</div></div><div class="article-photo"><img src="assets/landscape.webp" alt="" width="960" height="540"><span class="photo-caption">ATLAS — ${t('CARNET DE RECHERCHE','RESEARCH JOURNAL')}</span></div></div>` : `<div class="browser-article"><div class="article-text"><div class="article-kicker"><span>FIELD NOTES</span><span>VOL. 04</span></div><h3>${t('Un peu de<br>perspective.<br>Tout change.','A little<br>perspective.<br>Everything changes.')}</h3><p>${t('Prendre le temps de regarder ailleurs.<br>Et revenir avec une idée nouvelle.','Take a moment to look elsewhere.<br>Come back with a fresh idea.')}</p><button class="read-article" ${interactive ? 'data-action="split"' : 'tabindex="-1"'}>${t('Ouvrir le carnet','Open the notebook')} ↗</button></div><div class="article-photo"><img src="assets/landscape.webp" alt="${t('Paysage illustré de montagnes au coucher du soleil','Illustrated mountains at sunset')}" width="960" height="540"><span class="photo-caption">45° 55′ N &nbsp; 06° 52′ E &nbsp; / &nbsp; ${t('ILLUSTRATION','ILLUSTRATION')}</span></div></div>`}
      <div class="article-foot"><span>${t('UNE AUTRE FAÇON DE VOIR.','ANOTHER WAY TO SEE.')}</span><span>${t('Contenu fictif · Démonstration','Fictional content · Demo')}</span></div>`;
  }

  function renderScene(root, items, active, opts = {}) {
    const mainItems = opts.detached ? items.filter(item => item.id !== active) : items;
    const secondItems = opts.detached ? items.filter(item => item.id === active) : [{ id: 10, fr: 'Projet Atlas', en: 'Project Atlas', url: 'https://example.org/atlas', kind: 'notes' }];
    root.innerHTML = `<div class="browser primary-browser" data-flip-id="${root.id}-main">${browserMarkup(mainItems, opts.detached ? mainItems[0].id : active, opts)}</div><div class="browser secondary-browser" aria-hidden="true" inert>${browserMarkup(secondItems, secondItems[0].id, { secondary: true })}</div>`;
    $$('[data-tab]', root).forEach(tab => { tab.dataset.flipId = `${root.id}-tab-${tab.dataset.tab}`; });
    root.classList.toggle('is-split', !!opts.split);
    root.classList.toggle('is-detached', !!opts.detached);
    const second = $('.secondary-browser', root);
    second.setAttribute('aria-hidden', String(!opts.split && !opts.detached));
    // Decorative scenes do not add dozens of nonfunctional buttons to the tab order.
    if (!opts.interactive) root.setAttribute('inert', '');
  }

  function renderHero() { renderScene($('#hero-scene'), seed(), 2); }
  function setStory(step, animate = false) {
    storyStep = step;
    const root = $('#story-scene');
    const items = seed();
    if (step >= 1) items.splice(3, 1);
    renderScene(root, items, step === 0 ? 2 : 1, { split: step === 2, collapsed: step >= 1 });
    $$('[data-step]').forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.step === step)));
    $('#story-key').textContent = ['→', '✓', '↗'][step];
    if (animate && hasGSAP && !reduced()) gsap.fromTo(root, { opacity: .4, y: 14 }, { opacity: 1, y: 0, duration: .45, clearProps: 'opacity,transform' });
  }

  function productionBubble(host, dismiss) {
    const shadow = host.shadowRoot || host.attachShadow({ mode: 'open' });
    shadow.innerHTML = window.PK_TRANSLATION_TEMPLATE(true);
    const popup = shadow.querySelector('.pk-popup');
    popup.hidden = false;
    popup.classList.add('visible');
    // Position within the demo rather than over the user's actual document selection.
    popup.style.cssText = 'position:relative;opacity:1;transform:none;min-width:0;max-width:none;width:100%;box-shadow:none';
    shadow.querySelector('.pk-lang').textContent = 'EN → FR';
    const text = shadow.querySelector('.pk-text'); text.className = 'pk-text'; text.textContent = 'Un peu de perspective change tout.';
    shadow.querySelector('.pk-source').textContent = t('exemple préenregistré', 'pre-recorded example');
    const close = shadow.querySelector('.pk-close'); close.setAttribute('aria-label', t('Fermer la traduction','Close translation'));
    if (dismiss) close.addEventListener('click', dismiss); else close.hidden = true;
  }

  const configurations = () => ({
    navigate: { label: t('NAVIGATION','NAVIGATION'), caption: t('Changez d’onglet. Déplacez-le. Gardez-le tout près.','Switch tabs. Move one over. Keep it close.'), actions: [['prev','←'],['next','→'],['move',t('Déplacer','Move')],['pin',t('Épingler','Pin')],['mute',t('Son','Sound')]] },
    organize: { label: t('UN PEU D’ORDRE','A LITTLE ORDER'), caption: t('Les doublons ont la même URL, même avec du tracking.','Duplicates share a URL, even with tracking parameters.'), actions: [['dedup',t('Retirer les doublons','Remove duplicates')],['groups',t('Replier les groupes','Collapse groups')]] },
    split: { label: t('DEUX FENÊTRES','TWO WINDOWS'), caption: t('⌘ ⌥ clic : un lien s’ouvre à côté. Deux fenêtres, une vue d’ensemble.','⌘ ⌥ click: open a link alongside. Two windows, one bigger picture.'), actions: [['split',split ? t('Réunir','Bring back') : t('Ouvrir à côté','Open alongside')],['detach',detached ? t('Rattacher','Reattach') : t('Détacher','Detach')]] },
    translate: { label: t('UNE SÉLECTION SUFFIT','JUST A SELECTION'), caption: t('Une bulle issue de l’extension. Traduction enregistrée pour cette démo.','The actual extension bubble. A saved translation for this demo.'), actions: [['translate',t('Traduire la sélection','Translate selection')],['autocopy',t('Simuler la copie','Simulate auto-copy')]] }
  });
  function renderPlay(animate = false) {
    const focus = document.activeElement;
    const focusAction = $('#demo-actions').contains(focus) ? focus.dataset.action : null;
    const flipState = animate && window.Flip && !reduced() ? Flip.getState('#play-scene .primary-browser, #play-scene .fake-tab') : null;
    renderScene($('#play-scene'), tabs, activeId, { interactive: true, split, detached, collapsed: groupsCollapsed });
    $('#demo-count').textContent = tabs.length;
    $$('[data-demo]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.demo === demo)));
    const config = configurations()[demo];
    $('#demo-label').textContent = config.label;
    $('#demo-caption').textContent = config.caption;
    $('#demo-actions').innerHTML = config.actions.map(([action, label]) => `<button data-action="${action}" ${action === 'prev' ? `aria-label="${t('Onglet précédent','Previous tab')}"` : action === 'next' ? `aria-label="${t('Onglet suivant','Next tab')}"` : ''}>${label}</button>`).join('');
    if (translation) {
      const host = document.createElement('div'); host.className = 'demo-translation';
      $('#play-scene').append(host);
      productionBubble(host, () => { translation = false; renderPlay(); });
    }
    if (flipState) Flip.from(flipState, { targets: '#play-scene .primary-browser, #play-scene .fake-tab', duration: .4, ease: 'power2.out', nested: true });
    if (focusAction) $(`#demo-actions [data-action="${focusAction}"]`)?.focus({ preventScroll: true });
  }
  let copyTimer;
  function act(action) {
    clearTimeout(copyTimer);
    const index = tabs.findIndex(x => x.id === activeId);
    let message = '';
    if (action === 'prev' || action === 'next') {
      activeId = tabs[(index + (action === 'next' ? 1 : -1) + tabs.length) % tabs.length].id;
      message = t('Onglet actif : ', 'Active tab: ') + tabs.find(x => x.id === activeId)[lang];
    } else if (action === 'move') {
      const tab = tabs.splice(index, 1)[0]; tabs.splice(Math.min(index + 1, tabs.length), 0, tab);
      message = t('Onglet déplacé vers la droite.','Tab moved to the right.');
    } else if (action === 'pin') {
      const tab = tabs[index]; tab.pinned = !tab.pinned;
      if (tab.pinned) { tabs.splice(index, 1); tabs.unshift(tab); }
      message = tab.pinned ? t('Onglet épinglé.','Tab pinned.') : t('Onglet désépinglé.','Tab unpinned.');
    } else if (action === 'mute') {
      tabs[index].muted = !tabs[index].muted;
      message = tabs[index].muted ? t('Son coupé dans la simulation.','Sound muted in the simulation.') : t('Son réactivé dans la simulation.','Sound restored in the simulation.');
    } else if (action === 'dedup') {
      const before = tabs.length, groups = new Map();
      tabs.forEach(tab => { const key = URLCleaner.normalizeForDedup(tab.url); if (!groups.has(key) || tab.id === activeId) groups.set(key, tab); });
      tabs = tabs.filter(tab => [...groups.values()].includes(tab));
      message = `${before - tabs.length} ${t('doublon retiré. Vos vrais onglets restent intacts.','duplicate removed. Your real tabs stay untouched.')}`;
    } else if (action === 'groups') {
      groupsCollapsed = !groupsCollapsed;
      message = groupsCollapsed ? t('Le groupe inactif est replié.','The inactive group is collapsed.') : t('Les groupes sont dépliés.','Groups expanded.');
    } else if (action === 'split' || action === 'detach') {
      if (action === 'detach') { detached = !detached; split = false; }
      else { split = !split; detached = false; }
      message = split || detached ? (detached ? t('Onglet détaché dans une fenêtre de démonstration.','Tab detached into a demo window.') : t('Deux fenêtres côte à côte — simulation.','Two windows side by side — simulation.')) : t('Retour à une fenêtre.','Back to one window.');
    } else if (action === 'translate') {
      translation = !translation;
      message = t('Traduction préenregistrée. Aucun texte envoyé.','Pre-recorded translation. No text sent.');
    } else if (action === 'autocopy') {
      $('#demo-status').textContent = t('Sélection… la copie intervient après 1,5 seconde.','Selected… auto-copy happens after 1.5 seconds.');
      copyTimer = setTimeout(() => { $('#demo-status').textContent = t('Copie simulée ✓ Votre presse-papiers n’a pas été modifié.','Simulated copy ✓ Your clipboard was not changed.'); }, 1500);
      return;
    }
    renderPlay(true);
    $('#demo-status').textContent = message;
  }
  function stopTour() {
    clearInterval(tourTimer); tourTimer = null;
    $('#tour-button').textContent = t('▷ Visite guidée','▷ Guided tour');
  }
  function selectDemo(value) { clearTimeout(copyTimer); demo = value; split = false; detached = false; translation = false; renderPlay(true); }
  $('#playground').addEventListener('click', e => {
    const action = e.target.closest('[data-action]');
    if (action) { stopTour(); act(action.dataset.action); }
    const choice = e.target.closest('[data-demo]');
    if (choice) { stopTour(); selectDemo(choice.dataset.demo); }
    const tab = e.target.closest('[data-tab]');
    if (tab && $('#play-scene').contains(tab)) { activeId = +tab.dataset.tab; translation = false; renderPlay(); }
  });
  $('#play-scene').addEventListener('keydown', e => {
    if (e.target.matches('[role=tab]') && ['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) {
      e.preventDefault(); stopTour();
      if (e.key === 'Home' || e.key === 'End') { activeId = tabs[e.key === 'Home' ? 0 : tabs.length - 1].id; renderPlay(); }
      else act(e.key === 'ArrowRight' ? 'next' : 'prev');
      $(`[data-tab="${activeId}"]`, $('#play-scene'))?.focus();
    }
  });
  $('#reset-demo').addEventListener('click', () => {
    stopTour(); clearTimeout(copyTimer); tabs = seed(); activeId = 2; split = false; detached = false; groupsCollapsed = false; translation = false;
    renderPlay(true); $('#demo-status').textContent = t('Démo réinitialisée. À vous de jouer.','Demo reset. Your turn.');
  });
  $('#tour-button').addEventListener('click', () => {
    if (tourTimer) { stopTour(); return; }
    tabs = seed(); activeId = 2; groupsCollapsed = false;
    const steps = [['navigate','next'],['navigate','pin'],['organize','dedup'],['organize','groups'],['split','split'],['translate','translate']];
    let i = 0;
    function next() {
      const [scene, action] = steps[i++]; selectDemo(scene); act(action);
      $('#tour-button').textContent = t('Ⅱ Arrêter la visite','Ⅱ Stop tour');
      if (i >= steps.length) stopTour();
    }
    next(); tourTimer = setInterval(next, 2500);
  });

  function clean() {
    const input = $('#url-input').value.trim();
    const hints = {
      light: t('Retire une sélection de paramètres de suivi courants.','Removes a selection of common tracking parameters.'),
      balanced: t('Retire le tracking connu. Garde les paramètres fonctionnels.','Removes known tracking. Keeps functional parameters.'),
      strict: t('Retire toute la query et le fragment, même utiles au site.','Removes the entire query and fragment, including useful parameters.'),
      custom: t('Seuls les paramètres listés ci-dessus seront retirés.','Only the parameter names listed above will be removed.')
    };
    $('#mode-hint').textContent = hints[mode];
    $('#custom-label').hidden = mode !== 'custom';
    $$('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    try {
      const url = new URL(input);
      if (!['https:', 'http:'].includes(url.protocol)) throw Error('protocol');
      const output = URLCleaner.clean(input, { mode, customSources: [], customParams: $('#custom-params').value });
      $('#url-result').textContent = output;
      const removed = Math.max(0, [...url.searchParams].length - [...new URL(output).searchParams].length);
      $('#cleaner-status').textContent = `${removed} ${t('paramètre(s) retiré(s)','parameter(s) removed')}`;
      $('#copy-url').disabled = false; $('#url-input').removeAttribute('aria-invalid');
    } catch {
      $('#url-result').textContent = '—'; $('#copy-url').disabled = true;
      $('#cleaner-status').textContent = t('Saisissez une URL http:// ou https:// valide.','Enter a valid http:// or https:// URL.');
      $('#url-input').setAttribute('aria-invalid','true');
    }
  }
  $$('[data-mode]').forEach(b => b.addEventListener('click', () => { mode = b.dataset.mode; clean(); }));
  $('#url-input').addEventListener('input', clean); $('#custom-params').addEventListener('input', clean);
  $('#copy-url').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#url-result').textContent); $('#cleaner-status').textContent = t('Lien copié ✓','Link copied ✓'); }
    catch { $('#cleaner-status').textContent = t('Sélectionnez le résultat pour le copier manuellement.','Select the result to copy it manually.'); }
  });

  const shots = {
    features: [['01-features-dark', 'Le quotidien, en sombre', 'Everyday, in dark mode'], ['02-features-light', 'La même interface, en clair', 'The same interface, in light mode']],
    cleaner: [['03-url-cleaner','Nettoyer et prévisualiser','Clean and preview'],['04-custom-cleaner','Choisir ses sources','Choose your sources']],
    dedup: [['05-duplicates-before','Choisir l’onglet à garder','Choose the tab to keep'],['06-duplicates-after','Après le nettoyage','After cleanup']],
    translate: [['07-translation','Langue, déclencheur et moteur','Language, trigger and engine']],
    backup: [['08-backup','Vos réglages, dans un fichier','Your settings, in one file']],
    about: [['09-about','Version, raccourcis et soutien','Version, shortcuts and support']]
  };
  function renderGallery() {
    const list = shots[gallery];
    $('#gallery-grid').classList.toggle('single', list.length === 1);
    $('#gallery-grid').innerHTML = list.map(([file, fr, en]) => `<figure><a href="screenshots/${file}.png" data-caption="${t(fr, en)}"><img src="assets/${file}.webp" alt="${t(fr, en)} — ${t('vue de production','production view, original French UI')}" width="1600" height="${file.includes('cleaner') ? 1400 : 1000}" loading="lazy"></a><figcaption><span>${t(fr,en)}</span><span>${t('Agrandir','Enlarge')} ↗</span></figcaption></figure>`).join('');
    $$('[data-gallery]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.gallery === gallery)));
  }
  $$('[data-gallery]').forEach(b => b.addEventListener('click', () => { gallery = b.dataset.gallery; renderGallery(); }));
  const dialog = $('#image-dialog');
  let imageTrigger;
  $('#gallery-grid').addEventListener('click', e => {
    const a = e.target.closest('a'); if (!a || !dialog.showModal) return;
    e.preventDefault(); imageTrigger = a;
    $('#full-image').src = a.href; $('#full-image').alt = $('img',a).alt;
    $('#image-caption').textContent = a.dataset.caption;
    dialog.showModal();
  });
  $('#close-image').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog && e.clientX < dialog.getBoundingClientRect().left) dialog.close(); });
  dialog.addEventListener('close', () => imageTrigger?.focus());
  function renderCommands() {
    const term = $('#command-search').value.toLocaleLowerCase(lang);
    const commands = (window.PK_COMMANDS || []).filter(c => (c[lang] + ' ' + c.id).toLocaleLowerCase(lang).includes(term));
    $('#command-list').replaceChildren(...commands.map(c => {
      const row = document.createElement('div'); row.className = 'command-row';
      const name = document.createElement('span'); name.textContent = c[lang];
      const kind = document.createElement('small'); kind.textContent = c.native ? t('Mémo Chrome','Chrome reference') : t('Action extension','Extension action');
      const key = document.createElement('kbd'); key.textContent = c.shortcut || (c.native ? '—' : t('À configurer','Configure'));
      row.append(name, kind, key); return row;
    }));
    $('#command-count').textContent = `${commands.length} ${t('entrées','entries')}`;
  }
  $('#command-search').addEventListener('input', renderCommands);

  function applyLanguage(value) {
    lang = value; document.documentElement.lang = lang;
    try { sessionStorage.setItem('pk-promo-lang', lang); } catch {}
    $$('[data-en]').forEach(el => { el.innerHTML = lang === 'en' ? el.dataset.en : originals.get(el); });
    $$('[data-en-label]').forEach(el => el.setAttribute('aria-label', lang === 'en' ? el.dataset.enLabel : originals.get(el)));
    $$('[data-en-placeholder]').forEach(el => el.setAttribute('placeholder', lang === 'en' ? el.dataset.enPlaceholder : originals.get(el)));
    $$('[data-lang]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    document.title = t('PK Shortcuts — Chrome, au bout des doigts.', 'PK Shortcuts — Chrome, at your fingertips.');
    $('meta[name=description]').content = t('Pilotez Chrome au clavier. Onglets, split, liens propres et traduction. Essayez la démo interactive.', 'Control Chrome from the keyboard. Tabs, split windows, clean links and translation. Try the interactive demo.');
    renderHero(); setStory(storyStep); renderPlay(); clean(); renderGallery(); renderCommands();
    productionBubble($('.translation-example'));
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }
  $$('[data-lang]').forEach(b => b.addEventListener('click', () => { stopTour(); applyLanguage(b.dataset.lang); }));
  $$('[data-step]').forEach(b => b.addEventListener('click', () => setStory(+b.dataset.step, true)));

  function setupMotion() {
    mm?.revert(); mm = null;
    document.documentElement.dataset.motion = reduced() ? 'reduce' : 'full';
    $('#motion-toggle').setAttribute('aria-pressed', String(reduced()));
    window.dispatchEvent(new Event('pk-motion-change'));
    if (!hasGSAP || !window.ScrollTrigger || reduced()) return;
    mm = gsap.matchMedia();
    mm.add('(min-width: 1000px)', () => {
      gsap.to('.hero-wallpaper', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      gsap.to('.hero-product', { y: -50, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 } });
      ScrollTrigger.create({ trigger: '#story', start: 'top top', end: '+=1500', pin: '.story-sticky', scrub: true,
        onUpdate: self => { const step = Math.min(2, Math.floor(self.progress * 3)); if (step !== storyStep) setStory(step, true); } });
    });
    mm.add('(min-width: 521px)', () => {
      gsap.to('.selection-visual', { y: -25, rotation: 1, ease: 'none', scrollTrigger: { trigger: '.selection-section', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
  }
  $('#motion-toggle').addEventListener('click', () => { userReduced = !userReduced; stopTour(); setupMotion(); });
  motionQuery.addEventListener('change', setupMotion);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopTour(); });
  if (window.IntersectionObserver) new IntersectionObserver(entries => { if (!entries[0].isIntersecting) stopTour(); }).observe($('#playground'));
  applyLanguage(lang); setupMotion();
  if (hasGSAP && !reduced()) {
    gsap.from('.hero-copy', { y: 18, opacity: 0, duration: .8, ease: 'power2.out', clearProps: 'all' });
    gsap.from('.hero-product', { y: 30, opacity: 0, duration: 1, delay: .15, ease: 'power2.out', clearProps: 'opacity' });
  }
  // Three.js is an enhancement: the CSS keycaps remain if modules/WebGL are unavailable.
  if (innerWidth > 800 && !reduced()) {
    const load = () => import('./keycaps.js').catch(() => {});
    if ('requestIdleCallback' in window) requestIdleCallback(load, { timeout: 2500 }); else setTimeout(load, 1500);
  }
  // Deterministic state selection for media exports, using the same interactive implementation.
  window.PK_DEMO = { act, selectDemo, setStory, reset: () => $('#reset-demo').click(), getState: () => ({ tabs: tabs.map(x => ({...x})), activeId, demo, split, detached, groupsCollapsed, translation, lang }) };
  const capture = new URLSearchParams(location.search);
  if (capture.has('capture')) {
    userReduced = true; setupMotion();
    if (window.gsap) { gsap.killTweensOf('.hero-copy, .hero-product'); gsap.set('.hero-copy, .hero-product', { clearProps: 'all' }); }
    if (capture.get('lang')) applyLanguage(capture.get('lang') === 'en' ? 'en' : 'fr');
    const scene = capture.get('demo');
    if (scene) {
      selectDemo(['navigate','organize','split','translate'].includes(scene) ? scene : 'organize');
      if (['split','detach','translate','dedup','groups'].includes(scene)) act(scene);
    }
  }
  document.documentElement.dataset.ready = 'true';
})();
