// Capture-only Chrome API adapter. Production views are unchanged; data is fictitious.
// No browser tabs, sync storage, network translation or real clipboard are accessed.
(() => {
  const params = new URLSearchParams(location.search);
  let tabs = [
    { id: 101, windowId: 1, index: 0, title: 'Field Notes — Un peu de perspective', url: 'https://example.com/notes?utm_source=mail', active: false },
    { id: 102, windowId: 1, index: 1, title: 'Field Notes — Un peu de perspective', url: 'https://example.com/notes', active: true },
    { id: 103, windowId: 1, index: 2, title: 'Atlas — Le projet', url: 'https://example.org/atlas?fbclid=demo', active: false },
    { id: 104, windowId: 1, index: 3, title: 'Atlas — Le projet', url: 'https://example.org/atlas', active: false }
  ];
  const state = { options_theme: params.get('theme') || 'dark', translate_target_lang: 'fr' };
  const noop = () => {};
  const runtime = {
    getManifest: () => ({ version: '2026.9.3' }),
    onMessage: { addListener: noop },
    sendMessage: async (message) => message.type === 'TRANSLATE_REQUEST'
      ? { ok: true, result: { text: 'Un peu de perspective change tout.', detected: 'en', source: 'exemple préenregistré' } }
      : undefined
  };
  window.chrome = { runtime, tabs: { query: async () => [...tabs], remove: async (ids) => { tabs = tabs.filter(t => !ids.includes(t.id)); }, create: async () => {} },
    storage: { sync: { get: async (defaults) => ({ ...defaults, ...state }), set: async (value) => Object.assign(state, value) }, onChanged: { addListener: noop } } };
  document.addEventListener('DOMContentLoaded', async () => {
    // The production initialization awaits storage; this callback runs after it resumes.
    await new Promise(resolve => setTimeout(resolve, 30));
    const scene = params.get('scene') || 'features';
    const target = scene === 'custom' ? 'cleaner' : scene === 'dedup-after' ? 'dedup' : scene;
    document.querySelector(`[data-target="${target}"]`)?.click();
    if (scene === 'cleaner' || scene === 'custom') {
      if (scene === 'custom') {
        const radio = document.querySelector('[name="uc-mode"][value="custom"]');
        radio.checked = true; radio.dispatchEvent(new Event('change'));
      }
      const input = document.getElementById('uc-test-input');
      input.value = 'https://example.com/notes?utm_source=newsletter&utm_campaign=autumn&article=atlas';
      input.dispatchEvent(new Event('input'));
    }
    if (scene.startsWith('dedup')) {
      if (scene === 'dedup-after') tabs = [tabs[1], tabs[3]];
      document.getElementById('dedup-scan').click();
    }
    if (scene === 'translate') {
      const input = document.getElementById('tr-test-input');
      input.value = 'A little perspective changes everything.';
      input.dispatchEvent(new Event('input'));
      document.getElementById('tr-test-btn').click();
    }
    document.documentElement.dataset.captureReady = 'true';
  });
})();
