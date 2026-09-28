/* ══════════════════════════════════════════════════════════════
   sdg.js — แกนกลางที่ทุกหน้าใช้ร่วมกัน
   คะแนน · ไอคอน · กราฟจิ๋ว · tooltip · พื้นหลังการ์ด · ข้อมูลสด
   ══════════════════════════════════════════════════════════════ */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const cssv = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (v, d = 0) => v == null || isNaN(v) ? '—' : Number(v).toLocaleString('th-TH', { minimumFractionDigits: d, maximumFractionDigits: d });
const goalOf = n => GOALS[n - 1];
const indsOf = n => INDICATORS.filter(x => x.g === n && !x.mo);
const moOf = id => INDICATORS.find(x => x.mo && x.parent === id);
const pillarOf = n => PILLARS.find(p => p.goals.includes(n));
const gid = n => String(n).padStart(2, '0');

/* ───── คะแนนตามเกณฑ์เวลา ─────
   progress = เดินได้กี่ % ของระยะจากค่าฐานไปถึงเป้าหมายปี 2573
   elapsed  = เวลาที่ผ่านไปแล้วนับจากปีฐานของตัวชี้วัดนั้น
   score    = progress ÷ elapsed → 100 คือทันกำหนดเวลาพอดี */
function elapsedOf(x) {
  const b = x.baseYear || SDG_CFG.baseYear;
  return Math.min(1, Math.max(.08, (SDG_CFG.nowYear - b) / (SDG_CFG.targetYear - b)));
}
function indProgress(x) {
  const { base: b, target: t, value: v, dir } = x;
  if (v == null || isNaN(v)) return null;
  if (dir > 0 ? v >= t : v <= t) return 100;
  if (dir > 0 ? b < t : b > t) return (v - b) / (t - b) * 100;
  return Math.max(0, Math.min(100, (dir > 0 ? v / t : t / v) * 100)) * elapsedOf(x);
}
function indScore(x) {
  const p = indProgress(x);
  return p == null ? null : Math.max(0, Math.min(100, p / elapsedOf(x)));
}
const expectedNow = x => x.base + (x.target - x.base) * elapsedOf(x);
function goalScore(n) {
  const s = indsOf(n).map(indScore).filter(v => v != null);
  return s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;
}
function overallScore() {
  const s = GOALS.map(g => goalScore(g.n)).filter(v => v != null);
  return s.reduce((a, b) => a + b, 0) / s.length;
}
const STATUS = [
  { min: 90, key: 'on', th: 'ทันกำหนดเวลา', c: '#1e9e5a' },
  { min: 60, key: 'track', th: 'ใกล้ทัน', c: '#9bbd2d' },
  { min: 40, key: 'push', th: 'ต้องเร่งรัด', c: '#e89b1c' },
  { min: 0, key: 'crit', th: 'น่าห่วง', c: '#d8413a' }
];
const statusOf = s => s == null ? { key: 'na', th: 'ยังไม่มีข้อมูล', c: '#98a9ab' } : STATUS.find(x => s >= x.min);
function trendOf(x) {
  const s = x.series; if (s.length < 2) return 0;
  const d = s[s.length - 1].v - s[s.length - 2].v;
  return d === 0 ? 0 : Math.sign(d) * x.dir;
}
function trendHtml(x, withText) {
  const s = x.series; if (s.length < 2) return '';
  const d = Math.sign(s[s.length - 1].v - s[s.length - 2].v), t = trendOf(x);
  return `<span class="trend ${t > 0 ? 'good' : t < 0 ? 'bad' : 'flat'}">${svg(d > 0 ? 'up' : d < 0 ? 'down' : 'flat')}${withText ? (t > 0 ? 'ดีขึ้น' : t < 0 ? 'แย่ลง' : 'คงที่') : ''}</span>`;
}
/* ป้ายบอกที่มาและช่วงเวลาของข้อมูล */
function periodLabel(x, p) {
  p = p ?? x.period;
  if (!p) return '';
  if (x.ptype === 'quarter') return 'ไตรมาส ' + p;
  if (x.ptype === 'month') return p.replace('-', ' ');
  return 'ปี ' + p;
}
const badge = x => (x.real
  ? `<span class="chip real">ข้อมูลจริง · ${periodLabel(x)}</span>`
  : `<span class="chip sim">จำลอง</span>`)
  + (x.note ? `<span class="chip warn" data-tip="${esc('<b>หมายเหตุของชุดข้อมูล</b><div class="tp-note">' + x.note + '</div>')}">มีหมายเหตุ</span>` : '');
const realCount = () => INDICATORS.filter(x => x.real && !x.mo).length;
const indCount = () => INDICATORS.filter(x => !x.mo).length;

/* ───── กราฟจิ๋ว ───── */
function spark(series, color, w = 108, h = 30) {
  if (!series || series.length < 2) return `<svg class="spk" width="${w}" height="${h}"></svg>`;
  const vs = series.map(p => p.v), mn = Math.min(...vs), mx = Math.max(...vs), rg = mx - mn || 1;
  const X = i => (i / (series.length - 1)) * (w - 4) + 2;
  const Y = v => h - 3 - ((v - mn) / rg) * (h - 8);
  const pts = vs.map((v, i) => `${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
  return `<svg class="spk" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true">
    <polyline points="${pts} ${w - 2},${h} 2,${h}" fill="${color}" opacity=".13" stroke="none"/>
    <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${X(vs.length - 1).toFixed(1)}" cy="${Y(vs[vs.length - 1]).toFixed(1)}" r="3" fill="${color}"/></svg>`;
}

/* ───── ไอคอนเส้น (วาดเอง ไม่ใช้โลโก้ UN) ───── */
const IC = {
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>',
  sprout: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 5-3 7-8 7Z"/><path d="M12 14c0-3-2-6-7-6 0 4 2 6 7 6Z"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/><path d="M8 11h2l1-2 2 4 1-2h2"/>',
  book: '<path d="M4 5c3-1 6-1 8 1 2-2 5-2 8-1v14c-3-1-6-1-8 1-2-2-5-2-8-1Z"/><path d="M12 6v14"/>',
  equal: '<circle cx="12" cy="12" r="8"/><path d="M8.5 10h7M8.5 14h7"/>',
  drop: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/><path d="M9 14a3 3 0 0 0 3 3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  growth: '<path d="M4 20h16"/><path d="M6 16v-3M10 16v-6M14 16V8M18 16V5"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/>',
  scale: '<path d="M12 4v16M6 20h12"/><path d="M5 8h14"/><path d="M5 8 2.5 14a3 3 0 0 0 5 0Z"/><path d="M19 8l-2.5 6a3 3 0 0 0 5 0Z"/>',
  city: '<path d="M3 21h18"/><path d="M5 21V10l5-3v14"/><path d="M10 21V4h9v17"/><path d="M13 8h3M13 12h3M13 16h3"/>',
  loop: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-14 5.3L4 15"/><path d="M4 20v-5h5"/>',
  globe: '<circle cx="12" cy="12" r="8"/><path d="M4 12h16M12 4c2.5 2.5 2.5 13.5 0 16M12 4c-2.5 2.5-2.5 13.5 0 16"/>',
  fish: '<path d="M3 12c3-4 8-5 12-3l4-3v12l-4-3c-4 2-9 1-12-3Z"/><circle cx="7.5" cy="11.5" r=".8"/>',
  tree: '<path d="M12 21v-5"/><path d="M12 3 6 11h3l-4 5h14l-4-5h3Z"/>',
  dove: '<path d="M3 13c4 0 6-2 7-6 1 3 3 5 7 5l3-2-1 4c-1 3-4 5-8 5-4 0-7-2-8-6Z"/><path d="M10 7c0-2 1-3 3-4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  up: '<path d="m6 14 6-6 6 6"/>', down: '<path d="m6 10 6 6 6-6"/>', flat: '<path d="M5 12h14"/>',
  ext: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5H5V6h5"/>',
  moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z"/>',
  full: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  back: '<path d="M15 5 8 12l7 7"/>', edit: '<path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16Z"/><path d="M14 6l4 4"/>'
};
const svg = (k, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[k] || ''}</svg>`;

/* ───── พื้นหลังการ์ด ─────
   ชั้นที่ 1 แสงสีของเป้าหมายที่มุมขวา · ชั้นที่ 2 ไอคอนลายน้ำ
   ชั้นที่ 3 ภาพ assets/card/sdg-XX.webp ถ้ามี (จาง ๆ และถูกเฟดทางซ้าย)
   ทุกชั้นอยู่หลังตัวเลขเสมอ และไม่มีชั้นไหนทับพื้นที่ข้อความด้านซ้าย */
function cardArt(g) {
  return `<span class="art" aria-hidden="true">
    <span class="art-photo" style="background-image:url('assets/card/sdg-${gid(g.n)}.webp')"></span>
    <span class="art-glow"></span>
    <svg class="art-ic" viewBox="0 0 24 24">${IC[g.icon]}</svg></span>`;
}

/* ───── Tooltip ───── */
const TIP = { el: null, pinned: null };
function initTip() {
  TIP.el = document.createElement('div');
  TIP.el.className = 'tip'; TIP.el.setAttribute('role', 'tooltip');
  document.body.appendChild(TIP.el);
  const show = (t, x, y) => { TIP.el.innerHTML = t.dataset.tip; TIP.el.classList.add('on'); place(x, y); };
  const place = (x, y) => {
    const r = TIP.el.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    let L = x + 18, T = y + 18;
    if (L + r.width > W - 8) L = x - r.width - 18;
    if (T + r.height > H - 8) T = y - r.height - 18;
    TIP.el.style.transform = `translate(${Math.max(8, L)}px,${Math.max(8, T)}px)`;
  };
  document.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const t = e.target.closest('[data-tip]');
    if (t) show(t, e.clientX, e.clientY); else if (!TIP.pinned) TIP.el.classList.remove('on');
  });
  document.addEventListener('pointerdown', e => {
    if (e.pointerType === 'mouse') return;
    const t = e.target.closest('[data-tip]');
    if (t && TIP.pinned !== t) { if (TIP.pinned) delete TIP.pinned.dataset.armed; TIP.pinned = t; show(t, e.clientX, e.clientY); }
    else if (!t) { if (TIP.pinned) delete TIP.pinned.dataset.armed; TIP.pinned = null; TIP.el.classList.remove('on'); }
  });
  addEventListener('scroll', () => { if (!TIP.pinned) TIP.el.classList.remove('on'); }, { passive: true });
  document.addEventListener('focusin', e => {
    const t = e.target.closest('[data-tip]'); if (!t) return;
    const r = t.getBoundingClientRect(); show(t, r.left + r.width / 2, r.bottom);
  });
  document.addEventListener('focusout', () => { if (!TIP.pinned) TIP.el.classList.remove('on'); });
}
function tapGuard(e) {
  const a = e.target.closest('a[data-tip],.petal[data-tip]');
  if (!a || !matchMedia('(hover: none)').matches) return;
  if (TIP.pinned === a && a.dataset.armed !== '1') { a.dataset.armed = '1'; e.preventDefault(); e.stopPropagation(); }
}

function indTip(x) {
  const g = goalOf(x.g), s = indScore(x), st = statusOf(s), back = indProgress(x) < 0;
  const hist = x.series.slice(-4).map(p => `<span><b>${periodLabel(x, p.p)}</b> ${fmt(p.v, x.dec)}</span>`).join('');
  let dist = '';
  if (x.dist) {
    const rows = DISTRICTS.map(d => ({ d, v: x.dist[d.code] })).filter(r => r.v != null)
      .sort((a, b) => x.dir > 0 ? b.v - a.v : a.v - b.v);
    if (rows.length) dist = `<div class="tp-dist"><span>ดีสุด <b>${rows[0].d.short}</b> ${fmt(rows[0].v, x.dec)}</span>
      <span>ต้องดู <b>${rows[rows.length - 1].d.short}</b> ${fmt(rows[rows.length - 1].v, x.dec)}</span></div>`;
  }
  return esc(`<div class="tp-h" style="--gc:${g.c}"><b>SDG ${g.n}</b> ${x.name}</div>
  <div class="tp-v"><span>${fmt(x.value, x.dec)}</span> <small>${x.unit}</small>
    <i class="tp-p">${periodLabel(x)}</i></div>
  ${spark(x.series, g.c, 250, 44)}
  <div class="tp-hist">${hist}</div>
  <dl class="tp-dl">
    <dt>เป้าหมายปี ${SDG_CFG.targetYear}</dt><dd>${x.dir > 0 ? '≥' : '≤'} ${fmt(x.target, x.dec)} ${x.unit} <span class="tp-dim">(เบื้องต้น)</span></dd>
    <dt>ควรถึงแล้วปีนี้</dt><dd>${fmt(expectedNow(x), x.dec)} ${x.unit}</dd>
    <dt>ค่าฐาน ${x.baseYear}</dt><dd>${fmt(x.base, x.dec)} ${x.unit}</dd>
    <dt>คะแนนตามเวลา</dt><dd><i class="dot" style="background:${st.c}"></i>${s == null ? '—' : fmt(s, 0) + ' / 100'} · ${st.th}${back ? ' · ถอยหลังจากฐาน' : ''}</dd>
    <dt>ผู้รับผิดชอบ</dt><dd>${x.agency}</dd><dt>ความถี่</dt><dd>${x.freq}</dd></dl>
  ${dist}
  <div class="tp-src ${x.real ? 'real' : ''}">${x.real ? 'ข้อมูลจริง · ' : 'ข้อมูลจำลอง · '}${x.src}</div>
  ${x.note ? `<div class="tp-note">${x.note}</div>` : ''}`);
}
function goalTip(g) {
  const s = goalScore(g.n), st = statusOf(s), inds = indsOf(g.n);
  const rows = inds.map(x => `<div class="tp-row"><i class="dot" style="background:${statusOf(indScore(x)).c}"></i>
    <span>${x.name}</span><b>${fmt(x.value, x.dec)}</b><u>${x.real ? periodLabel(x) : 'จำลอง'}</u></div>`).join('');
  return esc(`<div class="tp-h" style="--gc:${g.c}"><b>SDG ${g.n}</b> ${g.th}</div>
    <div class="tp-tag">${g.tag}</div>
    <div class="tp-v"><span>${s == null ? '—' : fmt(s, 0)}</span> <small>/ 100 · ${st.th}</small></div>
    ${rows}<div class="tp-src">${g.adapted ? g.adapted + ' · ' : ''}เปิดหน้าเป้าหมายเพื่อดูรายอำเภอและย้อนหลัง</div>`);
}

/* ───── ตัวเลขวิ่งขึ้นตอนเลื่อนมาเห็น ───── */
function animNums(root = document) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    const el = e.target, to = +el.dataset.n, dec = +(el.dataset.dec || 0), t0 = performance.now();
    const step = t => {
      const k = Math.min(1, (t - t0) / 900), e2 = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(to * e2, dec);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .4 });
  root.querySelectorAll('[data-n]').forEach(el => io.observe(el));
}

/* ───── ธีม ───── */
const LS = { theme: 'nblSdg.theme' };
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem(LS.theme, t); } catch (e) {}
  document.dispatchEvent(new CustomEvent('themechange'));
}
function toggleTheme() { applyTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); }
function toggleFull() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }
(function () { try { const t = localStorage.getItem(LS.theme); if (t) document.documentElement.dataset.theme = t; } catch (e) {} })();

/* ───── ข้อมูลสดจาก Google Sheets (JSONP) ───── */
const LIVE = { ok: false, at: '', rows: 0, err: '' };
function jsonp(url, p = {}) {
  return new Promise((res, rej) => {
    const cb = '__sdg' + Date.now().toString(36) + Math.floor(Math.random() * 1e4);
    const s = document.createElement('script');
    const t = setTimeout(() => { clean(); rej(new Error('หมดเวลาเชื่อมต่อ')); }, 15000);
    const clean = () => { clearTimeout(t); delete window[cb]; s.remove(); };
    window[cb] = d => { clean(); res(d); };
    s.onerror = () => { clean(); rej(new Error('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้')); };
    s.src = url + (url.includes('?') ? '&' : '?') + new URLSearchParams({ ...p, callback: cb });
    document.head.appendChild(s);
  });
}
function applyLive(rows) {
  const by = {};
  rows.forEach(r => (by[r.id] = by[r.id] || []).push(r));
  Object.entries(by).forEach(([id, list]) => {
    const x = IND_BY_ID[id]; if (!x) return;
    const prov = list.filter(r => !r.district && r.value !== '' && r.value != null)
      .sort((a, b) => String(a.period).localeCompare(String(b.period)));
    if (prov.length) {
      x.series = prov.map(r => ({ p: String(r.period), v: +r.value }));
      x.value = x.series[x.series.length - 1].v;
      x.period = x.series[x.series.length - 1].p;
      x.base = x.series[0].v;
      const by2 = +String(x.series[0].p).replace(/\D/g, '').slice(-4);
      x.baseYear = by2 >= 2500 ? by2 : SDG_CFG.baseYear;
    }
    const dist = list.filter(r => r.district);
    if (dist.length) { x.dist = {}; dist.forEach(r => x.dist[r.district] = +r.value); x.dperiod = dist[dist.length - 1].period; }
    x.real = true;
    if (list[0].src) x.src = list[0].src;
    if (list[0].note) x.note = list[0].note;
  });
}
async function loadLive() {
  if (!SDG_CFG.API) return false;
  try {
    const r = await jsonp(SDG_CFG.API, { action: 'indicators' });
    if (r && r.ok) { applyLive(r.rows || []); LIVE.ok = true; LIVE.at = r.at || ''; LIVE.rows = (r.rows || []).length; return true; }
  } catch (e) { LIVE.err = e.message; }
  return false;
}

/* ───── แถบบนร่วม ───── */
function topbar(active) {
  const live = LIVE.ok ? `เชื่อมข้อมูลสด · ${esc(LIVE.at)}` : `ข้อมูล ณ ${SDG_CFG.asof}`;
  const cov = Math.round(realCount() / indCount() * 100);
  return `<header class="top">
    <a class="brand" href="index.html"><img src="assets/seal.png" alt=""><span><b>SDGs หนองบัวลำภู</b><small>ศูนย์ข้อมูลการพัฒนาที่ยั่งยืนจังหวัด</small></span></a>
    <span class="livechip ${LIVE.ok ? 'on' : ''}" data-tip="${esc(LIVE.ok
      ? 'ดึงข้อมูลจาก Google Sheets อัตโนมัติทุก ' + SDG_CFG.refreshMin + ' นาที'
      : 'ยังไม่ได้เชื่อม API · แสดงข้อมูลจากไฟล์ในเว็บ')}"><i></i>${live}</span>
    <span class="covchip" data-tip="${esc(`<b>ความครบถ้วนของข้อมูล</b><div class="tp-note">ตัวชี้วัดที่มีข้อมูลจริงแล้ว ${realCount()} จาก ${indCount()} ตัว ที่เหลือแสดงเป็นข้อมูลจำลองจนกว่าหน่วยงานจะส่งข้อมูลเข้าระบบ</div>`)}">
      <i style="--w:${cov}%"></i>ข้อมูลจริง ${cov}%</span>
    <nav class="tools">
      ${active !== 'cover' ? `<a class="tbtn" href="index.html">${svg('back')}<span>หน้าปก</span></a>` : ''}
      <a class="tbtn" href="entry.html">${svg('edit')}<span>กรอกข้อมูล</span></a>
      <button class="tbtn" onclick="toggleTheme()" aria-label="สลับโหมดมืด">${svg('moon')}</button>
      <button class="tbtn" onclick="toggleFull()" aria-label="เต็มจอ">${svg('full')}</button>
    </nav></header>`;
}

const SDG = {
  async init(page, render) {
    initTip();
    document.addEventListener('click', tapGuard, true);
    render(); animNums();
    if (await loadLive()) { render(); animNums(); }
    if (SDG_CFG.API) setInterval(async () => { if (await loadLive()) { render(); animNums(); } }, SDG_CFG.refreshMin * 60000);
    document.addEventListener('themechange', () => { render(); animNums(); });
  }
};
