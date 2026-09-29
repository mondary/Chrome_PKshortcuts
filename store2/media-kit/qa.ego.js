// Run: ego-browser nodejs < store2/media-kit/qa.ego.js
// Browser checks use the owned task space 36. No external tabs or clipboard changes.
const assert = (await import('node:assert/strict')).default;
const task = await taskSpace(36);
const page = task.page('p1');
await page.goto('http://127.0.0.1:4178/store2/?capture=1&lang=fr');
await page.waitForSelector('[data-ready]');
const result = await page.evaluate(async () => {
  const checks = [];
  const check = (ok, name) => { if(!ok) throw new Error(name); checks.push(name); };
  const click = selector => document.querySelector(selector).click();
  const state = () => window.PK_DEMO.getState();
  click('[data-demo=organize]'); click('#demo-actions [data-action=dedup]');
  check(state().tabs.length===4 && state().tabs.some(t=>t.id===2), 'Dedup removes duplicate and retains active tab');
  click('#demo-actions [data-action=groups]');
  check(document.querySelectorAll('#play-scene .primary-browser .fake-tab').length===3, 'Inactive group actually collapses');
  click('#reset-demo'); check(state().tabs.length===5&&!state().groupsCollapsed, 'Reset restores initial data');
  click('[data-demo=split]'); click('#demo-actions [data-action=split]');
  check(state().split&&document.querySelector('#play-scene').classList.contains('is-split'), 'Split opens a second demo window');
  click('#demo-actions [data-action=detach]');
  check(state().detached&&!state().split&&document.querySelectorAll('#play-scene .primary-browser .fake-tab').length===4, 'Detach moves active tab to its own window');
  click('[data-demo=translate]'); click('#demo-actions [data-action=translate]');
  check(document.querySelector('.demo-translation').shadowRoot.querySelector('.pk-text').textContent==='Un peu de perspective change tout.', 'Production translation bubble renders recorded example');
  click('#reset-demo'); click('[data-demo=navigate]');
  click('#demo-actions [data-action=pin]');check(state().tabs[0].id===2&&state().tabs[0].pinned,'Pin moves active tab to the front');
  click('#demo-actions [data-action=mute]');check(state().tabs[0].muted,'Mute state toggles');
  const input = document.querySelector('#url-input');
  input.value='https://example.com/notes?utm_source=mail&article=atlas#section';input.dispatchEvent(new Event('input'));
  check(document.querySelector('#url-result').value==='https://example.com/notes?article=atlas#section', 'Balanced preserves functional query and fragment');
  click('[data-mode=strict]');check(document.querySelector('#url-result').value==='https://example.com/notes','Strict removes query and fragment');
  click('[data-mode=custom]');const custom=document.querySelector('#custom-params');custom.value='article';custom.dispatchEvent(new Event('input'));
  check(document.querySelector('#url-result').value==='https://example.com/notes?utm_source=mail#section','Custom only removes requested parameters');
  input.value='javascript:alert(1)';input.dispatchEvent(new Event('input'));
  check(document.querySelector('#copy-url').disabled&&input.getAttribute('aria-invalid')==='true','Invalid URL schemes cannot be copied');
  click('[data-lang=en]');check(document.documentElement.lang==='en'&&document.title.includes('fingertips'),'English title and language');
  click('[data-lang=fr]');check(document.querySelector('h1').textContent.includes('doigts'),'French restored');
  check(document.querySelectorAll('.command-row').length===70,'All manifest entries are represented');
  check(window.PK_COMMANDS.filter(c=>!c.native).length===37,'Action and native reference counts are correct');
  const search=document.querySelector('#command-search');search.value='zzzz-no-command';search.dispatchEvent(new Event('input'));
  check(document.querySelectorAll('.command-row').length===0,'Command search has a genuine empty state');
  search.value='';search.dispatchEvent(new Event('input'));
  click('[data-gallery=about]');click('#gallery-grid a');check(document.querySelector('#image-dialog').open,'Screenshot lightbox opens');
  const closed=new Promise(resolve=>document.querySelector('#image-dialog').addEventListener('close',resolve,{once:true}));
  click('#close-image');await closed;check(!document.querySelector('#image-dialog').open&&document.activeElement.matches('#gallery-grid a'),'Lightbox closes and restores focus');
  const support=document.querySelector('a[href="https://ko-fi.com/pouark"]');
  check(support && support.rel.includes('noopener') && support.rel.includes('noreferrer') && support.tabIndex===0,'Support link has exact destination and native keyboard access');
  check(![...document.querySelectorAll('script[src],link[rel=stylesheet],img[src]')].some(e=>{const v=e.getAttribute('src')||e.getAttribute('href');return v&&new URL(v,location.href).origin!==location.origin;}),'All runtime assets are local');
  return checks;
});
assert.equal(result.length,21);
console.log({checks:result});
// Viewport and visual review captures. A normal load, not capture mode, tests animation too.
await page.goto('http://127.0.0.1:4178/store2/');
await page.waitForSelector('[data-ready]');
const layouts=[];
for(const width of [390,768,1440,1920]){
  await page.cdp('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:false});
  await page.evaluate(()=>{document.querySelector('#top').scrollIntoView({behavior:'instant'});window.ScrollTrigger?.refresh();});
  const geometry=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
  assert.ok(geometry.scroll<=width,`horizontal overflow at ${width}`);
  layouts.push(geometry);
  // Wait for actual entrance tweens to finish, not a fixed arbitrary delay.
  await page.waitForFunction(()=>!window.gsap || !gsap.isTweening('.hero-copy'));
  await page.screenshot({path:`/var/folders/jb/07k9zyks6_d60c27tclhjd2h0000gn/T/opencode/shortcuts-qa-${width}.png`});
}
console.log({layouts});
// prefers-reduced-motion: media emulation first; the user toggle is the real visitor path.
await page.cdp('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
await page.waitForFunction(()=>document.documentElement.dataset.motion==='reduce',undefined,{timeout:1500}).catch(()=>{});
let motion=await page.evaluate(()=>document.documentElement.dataset.motion);
let userToggled=false;
if(motion!=='reduce'){await page.click('#motion-toggle');await page.waitForFunction(()=>document.documentElement.dataset.motion==='reduce');motion=await page.evaluate(()=>document.documentElement.dataset.motion);userToggled=true;}
assert.equal(motion,'reduce');console.log({reducedMotion:motion});
// Clear media emulation first: with it active, turning the user toggle off must stay 'reduce'.
await page.cdp('Emulation.setEmulatedMedia',{features:[]});
await page.waitForFunction(()=>document.documentElement.dataset.motion==='full',undefined,{timeout:1500}).catch(()=>{});
if((await page.evaluate(()=>document.documentElement.dataset.motion))!=='full'){await page.click('#motion-toggle');await page.waitForFunction(()=>document.documentElement.dataset.motion==='full');}
console.log({motionRestored:await page.evaluate(()=>document.documentElement.dataset.motion)});
