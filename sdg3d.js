/* ══════════════════════════════════════════════════════════════
   sdg3d.js — วงแหวน 17 เป้าหมายแบบ 3 มิติ (three.js)
   เสาหนึ่งต้น = หนึ่งเป้าหมาย · ความสูง = คะแนนตามเวลา
   วงแหวนเรืองแสง = ระดับ "ทันกำหนด" (100 คะแนน)
   ลากเพื่อหมุน · ชี้เพื่อดูรายละเอียด · คลิกเพื่อเปิดหน้าเป้าหมาย
   ถ้าเครื่องไม่รองรับ WebGL ระบบจะกลับไปใช้วงบัวแบบ 2 มิติเอง
   ══════════════════════════════════════════════════════════════ */
const S3 = {
  ok: false, mounted: false, hover: null, spin: true, raf: 0,
  scene: null, cam: null, rn: null, bars: [], group: null, ring: null, ground: null, lights: {}
};

function has3D() {
  if (!window.THREE) return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch (e) { return false; }
}

function labelTexture(text, color) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = color; x.beginPath(); x.arc(64, 64, 58, 0, 7); x.fill();
  x.fillStyle = '#fff'; x.font = '700 62px Chakra Petch, sans-serif';
  x.textAlign = 'center'; x.textBaseline = 'middle';
  x.fillText(text, 64, 70);
  const t = new THREE.CanvasTexture(c);
  t.anisotropy = 4;
  return t;
}
function groundTexture(dark) {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(256, 256, 40, 256, 256, 250);
  g.addColorStop(0, dark ? 'rgba(46,140,120,.55)' : 'rgba(11,138,104,.34)');
  g.addColorStop(.55, dark ? 'rgba(12,44,50,.42)' : 'rgba(150,200,190,.24)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  x.fillStyle = g; x.fillRect(0, 0, 512, 512);
  x.strokeStyle = dark ? 'rgba(180,240,220,.16)' : 'rgba(10,80,70,.14)';
  x.lineWidth = 2;
  [90, 140, 190, 240].forEach(r => { x.beginPath(); x.arc(256, 256, r, 0, 7); x.stroke(); });
  return new THREE.CanvasTexture(c);
}

function build3D(host) {
  const dark = document.documentElement.dataset.theme === 'dark';
  const W = host.clientWidth, H = Math.max(340, Math.round(W * .66));
  const sc = new THREE.Scene();
  const cam = new THREE.PerspectiveCamera(29, W / H, .1, 100);
  cam.position.set(0, 9.2, 16.5);
  cam.lookAt(0, 1.5, 0);

  const rn = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  rn.setPixelRatio(Math.min(devicePixelRatio, 2));
  rn.setSize(W, H);
  rn.shadowMap.enabled = true;
  rn.shadowMap.type = THREE.PCFSoftShadowMap;
  host.innerHTML = '';
  host.appendChild(rn.domElement);
  rn.domElement.style.cssText = 'width:100%;height:auto;display:block;touch-action:pan-y';

  const hemi = new THREE.HemisphereLight(0xffffff, dark ? 0x0a2226 : 0xcfe3dd, dark ? .55 : .85);
  const key = new THREE.DirectionalLight(0xffffff, dark ? .85 : 1.05);
  key.position.set(5, 11, 6); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = key.shadow.camera.bottom = -9;
  key.shadow.camera.right = key.shadow.camera.top = 9;
  const rim = new THREE.PointLight(0x5fe0c0, dark ? 1.1 : .5, 30);
  rim.position.set(-6, 4, -6);
  sc.add(hemi, key, rim);

  const group = new THREE.Group(); sc.add(group);

  /* พื้นวง */
  const ground = new THREE.Mesh(
    new THREE.CircleGeometry(7.4, 72),
    new THREE.MeshBasicMaterial({ map: groundTexture(dark), transparent: true, depthWrite: false })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = .01;
  group.add(ground);

  const floor = new THREE.Mesh(new THREE.CircleGeometry(7.4, 72), new THREE.ShadowMaterial({ opacity: dark ? .32 : .16 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  group.add(floor);

  /* เสา 17 ต้น เรียงตามกลุ่ม 5P */
  const ORDER3 = PILLARS.flatMap(p => p.goals);
  const R = 4.3, MAXH = 3.9, bars = [];
  ORDER3.forEach((n, i) => {
    const g = goalOf(n), s = goalScore(n) ?? 0;
    const a = (i / 17) * Math.PI * 2;
    const h = .35 + (s / 100) * MAXH;
    const col = new THREE.Color(g.c);
    const mat = new THREE.MeshStandardMaterial({
      color: col, roughness: .34, metalness: .18,
      emissive: col.clone().multiplyScalar(dark ? .3 : .12)
    });
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(.36, .4, h, 28), mat);
    bar.position.set(Math.sin(a) * R, h / 2, Math.cos(a) * R);
    bar.castShadow = true;
    bar.userData = { n, h, base: mat.emissive.clone() };
    group.add(bar);

    /* ฐานเรืองแสงใต้เสา */
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(.44, .7, 32),
      new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: dark ? .38 : .22, side: THREE.DoubleSide, depthWrite: false })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.set(bar.position.x, .02, bar.position.z);
    group.add(halo);

    /* ป้ายเลขเป้าหมายลอยเหนือเสา */
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: labelTexture(String(n), g.c), transparent: true }));
    sp.scale.set(.74, .74, 1);
    sp.position.set(bar.position.x, h + .55, bar.position.z);
    group.add(sp);
    bars.push({ bar, halo, sp, n, h });
  });

  /* วงแหวนระดับ "ทันกำหนด" */
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(R, .035, 12, 120),
    new THREE.MeshBasicMaterial({ color: dark ? 0x7fe6c4 : 0x0b8a68, transparent: true, opacity: .55 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = .35 + MAXH;
  group.add(ring);

  Object.assign(S3, { scene: sc, cam, rn, bars, group, ring, ground, lights: { hemi, key, rim }, host });
  S3.mounted = true;
  return { W, H };
}

function tint3D() {
  const dark = document.documentElement.dataset.theme === 'dark';
  if (!S3.mounted) return;
  S3.lights.hemi.groundColor.set(dark ? 0x0a2226 : 0xcfe3dd);
  S3.lights.hemi.intensity = dark ? .55 : .85;
  S3.lights.key.intensity = dark ? .85 : 1.05;
  S3.lights.rim.intensity = dark ? 1.1 : .5;
  S3.ground.material.map = groundTexture(dark);
  S3.ground.material.needsUpdate = true;
  S3.ring.material.color.set(dark ? 0x7fe6c4 : 0x0b8a68);
  S3.bars.forEach(b => {
    const c = new THREE.Color(goalOf(b.n).c);
    b.bar.material.emissive.copy(c.clone().multiplyScalar(dark ? .3 : .12));
    b.bar.userData.base = b.bar.material.emissive.clone();
    b.halo.material.opacity = dark ? .38 : .22;
  });
}

function mount3D(hostSel, onHover, onPick) {
  const host = $(hostSel);
  if (!host || !has3D()) return false;
  build3D(host);
  const ray = new THREE.Raycaster(), mouse = new THREE.Vector2();
  let drag = null, vel = .0016, rot = 0;

  const resize = () => {
    const W = host.clientWidth, H = Math.max(340, Math.round(W * .66));
    S3.cam.aspect = W / H; S3.cam.updateProjectionMatrix(); S3.rn.setSize(W, H);
  };
  addEventListener('resize', resize);

  const pick = e => {
    const r = S3.rn.domElement.getBoundingClientRect();
    mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
    ray.setFromCamera(mouse, S3.cam);
    const hit = ray.intersectObjects(S3.bars.map(b => b.bar))[0];
    return hit ? hit.object.userData.n : null;
  };
  const setHover = n => {
    if (S3.hover === n) return;
    S3.hover = n;
    S3.bars.forEach(b => {
      const on = b.n === n;
      b.bar.material.emissive.copy(on ? new THREE.Color(goalOf(b.n).c).multiplyScalar(.75) : b.bar.userData.base);
      b.bar.scale.setScalar(on ? 1.12 : 1);
      b.sp.scale.setScalar(on ? .95 : .74);
    });
    onHover && onHover(n);
  };
  S3.setHover = setHover;
  host.addEventListener('pointermove', e => {
    if (drag) {
      const dx = e.clientX - drag.x;
      rot += dx * .006; vel = dx * .0012; drag.x = e.clientX; drag.moved += Math.abs(dx);
      return;
    }
    const n = pick(e);
    host.style.cursor = n ? 'pointer' : 'grab';
    setHover(n);
  });
  host.addEventListener('pointerdown', e => { drag = { x: e.clientX, moved: 0 }; S3.spin = false; host.setPointerCapture(e.pointerId); });
  host.addEventListener('pointerup', e => {
    const moved = drag ? drag.moved : 99; drag = null;
    if (moved < 5) { const n = pick(e); if (n) { onPick ? onPick(n) : (location.href = 'goal.html?g=' + n); } }
  });
  host.addEventListener('pointerleave', () => { drag = null; setHover(null); S3.spin = true; });

  const slow = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tick = () => {
    S3.raf = requestAnimationFrame(tick);
    if (!slow && S3.spin && !drag) rot += .0016;
    else if (Math.abs(vel) > .0002) { rot += vel; vel *= .93; }
    S3.group.rotation.y = rot;
    S3.bars.forEach(b => { b.sp.material.rotation = 0; });
    S3.rn.render(S3.scene, S3.cam);
  };
  cancelAnimationFrame(S3.raf); tick();
  S3.ok = true;
  return true;
}
function unmount3D() {
  cancelAnimationFrame(S3.raf);
  if (S3.rn) { S3.rn.dispose(); S3.rn.domElement.remove(); }
  S3.mounted = S3.ok = false;
}
