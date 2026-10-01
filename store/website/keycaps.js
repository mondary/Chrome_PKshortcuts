import * as THREE from './vendor/three.module.min.js';

const host = document.getElementById('keycaps');
let renderer;
try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true }); } catch { /* CSS fallback stays visible. */ }
if (renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 260 / 150, .1, 100);
  camera.position.set(0, 3.4, 6.8); camera.lookAt(0, 0, 0);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); renderer.setSize(260, 150);
  renderer.setClearColor(0, 0); host.append(renderer.domElement);
  host.querySelector('.keycap-fallback').hidden = true;
  scene.add(new THREE.HemisphereLight(0xffffff, 0x253249, 2.8));
  const light = new THREE.DirectionalLight(0xffffff, 3); light.position.set(-3, 5, 4); scene.add(light);
  const group = new THREE.Group(); group.rotation.set(0, -.15, -.12); scene.add(group);
  ['⌘', '⌥', '→'].forEach((label, index) => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d'); ctx.fillStyle = index === 2 ? '#ffb547' : '#ecece7'; ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = '#263445'; ctx.font = '110px -apple-system, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 128, 130);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
    const side = new THREE.MeshStandardMaterial({ color: index === 2 ? '#d99539' : '#bfc4cc', roughness: .35, metalness: .15 });
    const top = new THREE.MeshStandardMaterial({ map: texture, roughness: .3 });
    const key = new THREE.Mesh(new THREE.BoxGeometry(.96, .25, .96), [side, side, top, side, side, side]);
    key.position.x = (index - 1) * 1.15; group.add(key);
  });
  let visible = true, frame = 0, start = performance.now();
  const reduced = () => document.documentElement.dataset.motion === 'reduce';
  function tick(now) {
    frame = 0;
    if (!visible || document.hidden || reduced()) return;
    const time = (now - start) / 1000;
    group.children.forEach((key, i) => { key.position.y = -.07 * Math.max(0, Math.sin(time * 1.6 - i * .75)); });
    renderer.render(scene, camera); frame = requestAnimationFrame(tick);
  }
  function update() {
    cancelAnimationFrame(frame); frame = 0;
    renderer.domElement.hidden = reduced();
    host.querySelector('.keycap-fallback').hidden = !reduced();
    if (visible && !document.hidden && !reduced()) frame = requestAnimationFrame(tick);
  }
  new IntersectionObserver(entries => { visible = entries[0].isIntersecting; update(); }).observe(host);
  document.addEventListener('visibilitychange', update);
  window.addEventListener('pk-motion-change', update);
  renderer.render(scene, camera);
}
