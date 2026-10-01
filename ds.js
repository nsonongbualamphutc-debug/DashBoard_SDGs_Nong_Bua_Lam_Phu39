/* ─────────────── 0) ค่าคงที่ ─────────────── */
const CFG = { build:'2.7.0', API:'https://script.google.com/macros/s/AKfycbwtThh7l3ZrMx1HH3O6VHv9V4xtg1Rl6jSzE0Ozwbt6PXTN2sWSS5y9vbnQ9K-DRrbk6A/exec', latest:{y:2569,m:8}, asof:'9 กันยายน 2569' };
const TH_M = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const DISTRICTS = [
  {code:'3901',name:'เมืองหนองบัวลำภู',lat:17.204,lng:102.441,w:.32},
  {code:'3904',name:'ศรีบุญเรือง',     lat:16.999,lng:102.284,w:.21},
  {code:'3902',name:'นากลาง',          lat:17.320,lng:102.220,w:.17},
  {code:'3903',name:'โนนสัง',          lat:17.028,lng:102.567,w:.14},
  {code:'3905',name:'สุวรรณคูหา',      lat:17.529,lng:102.298,w:.10},
  {code:'3906',name:'นาวัง',           lat:17.446,lng:102.155,w:.06}
];
const IC = {
  bank:'<path d="M3 9.5 12 4l9 5.5"/><path d="M5 9.5V19M9.7 9.5V19M14.3 9.5V19M19 9.5V19M3 19.5h18"/>',
  leaf:'<path d="M12 21V10"/><path d="M12 10C12 6.4 9.5 3.7 5.7 3.3c-.4 3.9 2 6.6 6.3 6.7ZM12 14.4c0-3.1 2.1-5.5 5.2-5.8.4 3.3-1.7 5.7-5.2 5.8Z"/><path d="M6 21h12"/>',
  factory:'<path d="M3 20.5h18M4.5 20.5V10l5 3.2V10l5 3.2V6.4h4.9v14.1"/><path d="M8 17h2M13 17h2M18 17h1.5"/>',
  cart:'<circle cx="9.5" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2.5 3.5h2.6l2.4 12.1h11.2l2.3-8.6H6"/>',
  bolt:'<path d="M13.5 2.5 4.5 13.8h6.2l-1.2 7.7 9.3-11.6h-6.4z"/>',
  chart:'<path d="M3.5 20.5h17"/><path d="M6.5 16.6V11M11 16.6V6.6M15.5 16.6v-7M20 16.6V4.6"/>',
  people:'<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/><path d="M16.5 5.2a3.2 3.2 0 0 1 0 6M18 14.9c2 .7 3.3 2.4 3.3 5.1"/>',
  coin:'<ellipse cx="12" cy="6.5" rx="7.5" ry="3"/><path d="M4.5 6.5v11c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-11"/><path d="M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"/>',
  drop:'<path d="M12 3.2c3.4 3.9 5.4 6.9 5.4 9.4A5.4 5.4 0 0 1 12 18a5.4 5.4 0 0 1-5.4-5.4c0-2.5 2-5.5 5.4-9.4Z"/>',
  brief:'<rect x="2.8" y="7.2" width="18.4" height="12.6" rx="2"/><path d="M8.6 7.2V5.4a1.8 1.8 0 0 1 1.8-1.8h3.2a1.8 1.8 0 0 1 1.8 1.8v1.8M2.8 12.6h18.4"/>',
  plane:'<path d="M10.5 20.5 21 3.5 4 12l5.4 2.2z"/><path d="M9.4 14.2 21 3.5"/>'
};

/* ─────────────── 1) ข้อมูลจริงจากเอกสารหน่วยงาน ─────────────── */
/* ข้อมูลจริงชุดหลักอยู่ในไฟล์ data1.js (ตัวแปร REAL) */

/* ─────────────── 2) ชุดข้อมูลรายหน่วยงาน ─────────────── */
const DATASETS = [
 {id:'spend',sector:'fiscal',agency:'สำนักงานคลังจังหวัดหนองบัวลำภู',lag:20,real:true,
  series:[{key:'inv',ico:'spend',agg:'last',label:'เบิกจ่ายงบลงทุนสะสม',unit:'ล้านบาท',base:2575,trend:.05,seas:.30,kpi:1,dec:0},
          {key:'ope',ico:'spend',agg:'last',label:'เบิกจ่ายงบประจำสะสม',unit:'ล้านบาท',base:2262,trend:.03,seas:.16,dec:0}]},
 {id:'crop',sector:'agri',agency:'สำนักงานเกษตรจังหวัดหนองบัวลำภู',lag:15,real:true,
  series:[{key:'value',ico:'income',agg:'sum',label:'มูลค่าผลผลิตพืชอายุสั้น',unit:'ล้านบาท',base:2960,trend:.02,seas:.30,kpi:1,dec:0},
          {key:'area',ico:'landuse',label:'เนื้อที่ปลูก',agg:'last',unit:'ไร่',base:949634,trend:.008,seas:.06,int:1}]},
 {id:'factory',sector:'industry',agency:'สำนักงานอุตสาหกรรมจังหวัดหนองบัวลำภู',lag:30,
  series:[{key:'newf',ico:'factorynew',agg:'sum',label:'โรงงานใหม่/ขยายกิจการ',unit:'แห่ง',base:4,trend:.04,seas:.5,kpi:1,int:1},
          {key:'cap',ico:'invest',agg:'last',label:'เงินลงทุนสะสม',unit:'ล้านบาท',base:9800,trend:.045,seas:.05,int:1},
          {key:'emp',agg:'last',label:'แรงงานในโรงงาน',ico:'employed',agg:'last',unit:'คน',base:6350,trend:.025,seas:.04,int:1}]},
 {id:'power',sector:'industry',agency:'การไฟฟ้าส่วนภูมิภาคจังหวัดหนองบัวลำภู',lag:25,
  series:[{key:'ind',ico:'power',agg:'sum',label:'ไฟฟ้าภาคอุตสาหกรรม',unit:'ล้านหน่วย',base:11.8,trend:.03,seas:.08,kpi:1,dec:2},
          {key:'biz',ico:'power',agg:'sum',label:'ไฟฟ้าภาคธุรกิจ',unit:'ล้านหน่วย',base:7.4,trend:.028,seas:.10,dec:2}]},
 {id:'cpi',sector:'trade',agency:'สำนักงานพาณิชย์จังหวัดหนองบัวลำภู',lag:20,invert:true,
  series:[{key:'idx',ico:'cpi',agg:'avg',label:'ดัชนีราคาผู้บริโภค',unit:'ดัชนี (2562=100)',base:108.4,trend:.012,seas:.03,kpi:1,dec:1},
          {key:'yoy',ico:'inflation',agg:'avg',label:'อัตราเงินเฟ้อทั่วไป',unit:'% YoY',base:1.3,trend:0,seas:.55,pct:1,dec:2}]},
 {id:'credit',sector:'trade',agency:'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย',lag:30,
  series:[{key:'amt',ico:'credit',agg:'sum',label:'วงเงินสินเชื่ออนุมัติ',unit:'ล้านบาท',base:52,trend:.05,seas:.28,kpi:1,dec:1},
          {key:'cnt',ico:'credit',agg:'sum',label:'จำนวนรายที่ได้รับอนุมัติ',unit:'ราย',base:29,trend:.035,seas:.24,int:1}]},
 {id:'fuel',sector:'consume',agency:'สำนักงานพลังงานจังหวัดหนองบัวลำภู',lag:35,
  series:[{key:'total',ico:'fuel',agg:'sum',label:'ปริมาณการใช้น้ำมันรวม',unit:'ล้านลิตร',base:14.2,trend:.02,seas:.09,kpi:1,dec:2},
          {key:'diesel',ico:'fuel',agg:'sum',label:'ดีเซล',unit:'ล้านลิตร',base:8.6,trend:.018,seas:.12,dec:2}]},
 {id:'car',sector:'consume',agency:'สำนักงานขนส่งจังหวัดหนองบัวลำภู',lag:15,
  series:[{key:'moto',ico:'vehicle',agg:'sum',label:'รถจักรยานยนต์จดทะเบียนใหม่',unit:'คัน',base:735,trend:.02,seas:.19,kpi:1,int:1},
          {key:'car',ico:'vehicle',agg:'sum',label:'รถยนต์นั่งส่วนบุคคล',unit:'คัน',base:118,trend:.03,seas:.24,int:1},
          {key:'comm',ico:'vehicle',agg:'sum',label:'รถเพื่อการพาณิชย์',unit:'คัน',base:64,trend:.035,seas:.30,int:1}]},
 {id:'labor',sector:'labor',agency:'สำนักงานแรงงานจังหวัดหนองบัวลำภู · สำนักงานสถิติจังหวัด',lag:45,freq:'Q',real:true,
  series:[{key:'ue',ico:'unemployed',agg:'last',label:'จำนวนผู้ว่างงาน',unit:'คน',base:2960,trend:.01,seas:.5,kpi:1,int:1},
          {key:'ur',ico:'unemprate',agg:'avg',label:'อัตราการว่างงาน',unit:'%',base:1.12,trend:0,seas:.45,pct:1,dec:2},
          {key:'emp',agg:'last',label:'ผู้มีงานทำ',ico:'employed',agg:'last',unit:'คน',base:261684,trend:.008,seas:.03,int:1},
          {key:'force',ico:'lfpr',agg:'last',label:'กำลังแรงงานรวม',unit:'คน',base:264644,trend:.006,seas:.02,int:1}]},
 {id:'social',sector:'labor',agency:'สำนักงานประกันสังคมจังหวัดหนองบัวลำภู',lag:30,
  series:[{key:'m33',ico:'social',agg:'last',label:'ผู้ประกันตน มาตรา 33',unit:'คน',base:21500,trend:.02,seas:.06,kpi:1,int:1},
          {key:'m40',ico:'social',agg:'last',label:'ผู้ประกันตน มาตรา 40',unit:'คน',base:64800,trend:.015,seas:.04,int:1}]},
 {id:'tour',sector:'tourism',agency:'สำนักงานการท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู',lag:50,
  series:[{key:'visit',ico:'visitor',agg:'sum',label:'ผู้เยี่ยมเยือน',unit:'คน-ครั้ง',base:78000,trend:.05,seas:.30,kpi:1,int:1},
          {key:'rev',ico:'income',agg:'sum',label:'รายได้จากการท่องเที่ยว',unit:'ล้านบาท',base:210,trend:.06,seas:.32,dec:1},
          {key:'occ',ico:'accommodation',agg:'avg',label:'อัตราการเข้าพักเฉลี่ย',unit:'%',base:42,trend:.02,seas:.22,pct:1,dec:1}]}
];

const SECTORS = [
 {id:'fiscal',ico:'fiscal',img:'assets/s-fiscal.jpg',  name:'การคลังภาครัฐ',       icon:'bank',   color:'#0d9268',weight:.24,datasets:['spend'],
  pitch:'ตัวขับเคลื่อนอันดับหนึ่งของเศรษฐกิจจังหวัด',
  desc:'เม็ดเงินงบประมาณที่รัฐอัดเข้าสู่ระบบเศรษฐกิจจังหวัด'},
 {id:'agri',ico:'agri',img:'assets/s-agri.jpg',    name:'ภาคเกษตรและฐานราก',   icon:'leaf',   color:'#66a33a',weight:.24,datasets:['crop'],
  pitch:'ครัวเรือนเกษตรกร 101,836 ครัวเรือน',
  desc:'พืชอายุสั้น ไม้ผล แหล่งน้ำ และสถาบันเกษตรกร'},
 {id:'industry',ico:'industry',img:'assets/s-industry.jpg',name:'อุตสาหกรรมและการผลิต',icon:'factory',color:'#356aad',weight:.16,datasets:['factory','power'],
  pitch:'ยืนยันด้วยปริมาณไฟฟ้าที่ใช้จริง',
  desc:'โรงงาน เงินลงทุน การจ้างงาน และการใช้ไฟฟ้า'},
 {id:'trade',ico:'trade',img:'assets/s-trade.jpg',   name:'การค้าและค่าครองชีพ', icon:'cart',   color:'#b5851a',weight:.14,datasets:['cpi','credit'],
  pitch:'เงินในกระเป๋าซื้อของได้เท่าเดิมหรือไม่',
  desc:'ดัชนีราคาผู้บริโภคและสินเชื่อเพื่อการลงทุน'},
 {id:'consume',ico:'consume',img:'assets/s-consume.jpg', name:'การบริโภคและพลังงาน', icon:'bolt',   color:'#d0563f',weight:.12,datasets:['fuel','car'],
  pitch:'ตัวชี้ที่เห็นผลเร็วที่สุด',
  desc:'การใช้น้ำมันเชื้อเพลิงและรถจดทะเบียนใหม่'},
 {id:'labor',ico:'labor',img:'assets/s-labor.jpg',   name:'ตลาดแรงงาน',          icon:'brief',  color:'#7d5b8f',weight:.07,datasets:['labor','social'],
  pitch:'คนมีงานทำ คือกำลังซื้อที่ยั่งยืน',
  desc:'การมีงานทำ การว่างงาน และผู้ประกันตน'},
 {id:'tourism',ico:'tourism',img:'assets/s-tourism.jpg', name:'ภาคการท่องเที่ยว',    icon:'plane',  color:'#12867e',weight:.03,datasets:['tour'],
  pitch:'รายได้ใหม่ที่ไหลเข้าจังหวัด',
  desc:'ผู้เยี่ยมเยือน รายได้ และอัตราการเข้าพัก'}
];

/* ─────────────── 3) ชุดตัวเลขรายเดือน (โครงร่าง) ─────────────── */
function rnd(s){let x=s>>>0;return()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296}}
const MONTHS=(()=>{const a=[];let y=CFG.latest.y-3,m=CFG.latest.m+1;
  for(let i=0;i<36;i++){if(m>12){m=1;y++}
    a.push({y,m,key:y+'-'+String(m).padStart(2,'0'),label:TH_M[m-1]+' '+String(y).slice(-2)});m++}return a})();
const YEARS=[CFG.latest.y-2,CFG.latest.y-1,CFG.latest.y];
const DB={},DBD={};
DATASETS.forEach((d,di)=>{DB[d.id]={};DBD[d.id]={};
  d.series.forEach((s,si)=>{
    const R=rnd(7919*(di+3)+131*(si+2));
    const arr=MONTHS.map((mo,i)=>{
      const t=Math.pow(1+s.trend,(i-35)/12);
      const sea=1+s.seas*.5*Math.sin((mo.m-1)/12*Math.PI*2-(di%3))+s.seas*.2*Math.cos((mo.m-1)/6*Math.PI);
      const nz=1+(R()-.5)*s.seas*.4;
      let v=s.base*t*sea*nz;
      if(s.pct)v=s.base+(sea-1)*s.base*1.6+(R()-.5)*.6;
      if(s.int)v=Math.round(v);
      return{...mo,v:+v.toFixed(s.dec??(s.int?0:2)),sim:true}});
    DB[d.id][s.key]=arr;
    const last=arr[arr.length-1].v,R2=rnd(3571*(di+1)+97*(si+1));
    DBD[d.id][s.key]={};
    DISTRICTS.forEach(dt=>{DBD[d.id][s.key][dt.code]=+(last*dt.w*(.84+R2()*.36)).toFixed(s.int?0:2)});
  })});
function baseAvg(a,y){const q=a.filter(x=>x.y===y);return q.reduce((p,c)=>p+c.v,0)/(q.length||1)}
/* ─────────────── 3b) สถานะข้อมูลจริง/จำลอง ───────────────
   ทุกจุดใน DB เริ่มเป็น sim:true (ค่าจำลองจากค่าฐาน) · loadLive() เปลี่ยนเป็น sim:false เมื่อมีค่าที่อนุมัติแล้วจากชีต
   SIM_TOUCH เก็บว่าตัวเลขที่เพิ่งดึงผ่าน seriesAt() เป็นค่าจริงหรือจำลอง แล้ว kpiCard() ติดป้ายให้เอง */
const LIVE={ok:false,err:false,at:'',rows:0,pending:0};
const DBD_REAL={};
let SIM_TOUCH=null;
function simTouch(arr,idx){
  if(!arr||!arr.length||arr[0].sim===undefined)return;
  const pts=(idx&&idx.length?idx.map(i=>arr[i]):[arr[arr.length-1]]).filter(Boolean);
  if(!pts.length)return;
  SIM_TOUCH=SIM_TOUCH||{sim:0,real:0};
  pts.forEach(p=>p.sim?SIM_TOUCH.sim++:SIM_TOUCH.real++);
}
function simTake(){const t=SIM_TOUCH;SIM_TOUCH=null;return t}
function simChip(t,mini){
  if(!t||!t.sim)return '';
  const part=t.real>0;
  const tip=(part?'ข้อมูลจริงบางเดือน':'ข้อมูลจำลอง')+'|'+(part
    ?`งวดนี้มีค่าจริง ${t.real} เดือน อีก ${t.sim} เดือนยังเป็นค่าจำลอง ตัวเลขรวมจึงยังไม่ใช่ค่าจริง`
    :'หน่วยงานยังไม่ได้ส่งค่าจริงของงวดนี้ หรือส่งแล้วแต่ยังรออนุมัติ ตัวเลขนี้สร้างจากค่าฐานเพื่อทดสอบการแสดงผล ห้ามนำไปอ้างอิง');
  return `<span class="simchip${part?' part':''}${mini?' mini':''}" data-tip2="${tip}">${part?'จริงบางส่วน':'จำลอง'}</span>`;
}
/* สรุปรายชุด: เดือนที่มีค่าจริงใน 12 เดือนล่าสุด */
function realStat(id){
  const d=DATASETS.find(x=>x.id===id); if(!d)return null;
  let real=0,tot=0,last=null;
  d.series.forEach(se=>{const arr=DB[id][se.key]||[];
    arr.slice(-12).forEach(x=>{tot++;if(!x.sim){real++;if(!last||x.key>last)last=x.key}})});
  return {real,tot,share:tot?real/tot:0,last};
}
function buildMei(){
  const base=CFG.latest.y-2;
  const comps=SECTORS.map(sec=>{const idx=MONTHS.map(()=>0);
    sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id),s=d.series[0],arr=DB[id][s.key],b=baseAvg(arr,base)||1;
      arr.forEach((x,i)=>{const r=(x.v/b)*100;idx[i]+=(d.invert?(200-r):r)/sec.datasets.length})});
    return{sec,idx}});
  const out=MONTHS.map((mo,i)=>{let v=0,w=0;comps.forEach(c=>{v+=c.idx[i]*c.sec.weight;w+=c.sec.weight});
    return{...mo,v:+(v/w).toFixed(1)}});
  /* สัดส่วนน้ำหนักของดัชนีที่มาจากค่าจริง: เดือนล่าสุด และเฉลี่ย 12 เดือน */
  const realW=i=>{let r=0,w=0;SECTORS.forEach(sec=>sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id),a=DB[id][d.series[0].key];
      const ww=sec.weight/sec.datasets.length;w+=ww;if(a[i]&&!a[i].sim)r+=ww}));return w?r/w:0};
  const n=MONTHS.length, lastReal=realW(n-1);
  let yr=0;for(let i=n-12;i<n;i++)yr+=realW(i);
  return{out,comps,real:lastReal,real12:yr/12}}
let MEI=buildMei();
const R3=rnd(20690);
const NAT={th:MEI.out.map((m,i)=>+(100+(i-24)*.16+Math.sin(i/5)*1.1+(R3()-.5)*.8).toFixed(1)),
           ne:MEI.out.map((m,i)=>+(100+(i-24)*.12+Math.sin(i/4.4+1)*1.4+(R3()-.5)).toFixed(1))};

/* ─────────────── 4) store + การแก้ไข ─────────────── */
const LS={data:'nblEcon.data',set:'nblEcon.settings'};
let D=JSON.parse(JSON.stringify(REAL));
(function loadEdits(){try{const raw=localStorage.getItem(LS.data);if(!raw)return;
  const o=JSON.parse(raw);deepMerge(D,o)}catch(e){}})();
function deepMerge(t,s){for(const k in s){
  if(s[k]&&typeof s[k]==='object'&&!Array.isArray(s[k])){if(!t[k])t[k]={};deepMerge(t[k],s[k])}
  else t[k]=s[k]}return t}
function saveEdits(){try{localStorage.setItem(LS.data,JSON.stringify(D))}catch(e){}}
function editCount(){try{return localStorage.getItem(LS.data)?1:0}catch(e){return 0}}
function pathGet(p){return p.split('.').reduce((o,k)=>o&&o[/^\d+$/.test(k)?+k:k],D)}

let SET={coverUrl:'assets/cover-fields.jpg',coverOp:38,sideUrl:'assets/side-forest.jpg',sideOp:26,accent:'#0d9268',kiosk:20,api:'https://script.google.com/macros/s/AKfycbwtThh7l3ZrMx1HH3O6VHv9V4xtg1Rl6jSzE0Ozwbt6PXTN2sWSS5y9vbnQ9K-DRrbk6A/exec'};
(function loadSet(){try{const r=localStorage.getItem(LS.set);if(r)Object.assign(SET,JSON.parse(r))}catch(e){}})();
function saveSet(){try{localStorage.setItem(LS.set,JSON.stringify(SET))}catch(e){alert('บันทึกไม่สำเร็จ — พื้นที่เก็บข้อมูลในเบราว์เซอร์เต็ม (รูปอาจใหญ่เกินไป)')}}
function applySet(){
  const r=document.documentElement;
  if(SET.accent){r.style.setProperty('--brand',SET.accent)}
  r.style.setProperty('--cover-img',SET.coverUrl?`url("${SET.coverUrl}")`:'none');
  r.style.setProperty('--side-img',SET.sideUrl?`url("${SET.sideUrl}")`:'none');
  r.style.setProperty('--side-op',(SET.sideOp||0)/100);
  const cb=document.getElementById('coverBg');if(cb)cb.style.opacity=(SET.coverOp||0)/100;
  CFG.API=(SET.api===undefined?'https://script.google.com/macros/s/AKfycbwtThh7l3ZrMx1HH3O6VHv9V4xtg1Rl6jSzE0Ozwbt6PXTN2sWSS5y9vbnQ9K-DRrbk6A/exec':SET.api)||'';
}

/* ─────────────── 5) utils ─────────────── */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const cv=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function f(v,d){if(v==null||isNaN(v))return'—';
  return Number(v).toLocaleString('th-TH',{minimumFractionDigits:d??0,maximumFractionDigits:d??0})}
function f_num(v){if(v==null||isNaN(v))return'—';return Number(v).toLocaleString('th-TH',{maximumFractionDigits:2})}
function pctc(a,b){return b?((a-b)/Math.abs(b))*100:null}
function chip(p){if(p==null)return'<span class="chip">—</span>';
  const c=p>.15?'up':p<-.15?'dn':'fl',a=p>.15?'▲':p<-.15?'▼':'▬';
  return`<span class="chip ${c}">${a} ${p>0?'+':''}${p.toFixed(1)}%</span>`}
/* ป้ายคู่ · เทียบปีก่อน และ เทียบเดือนก่อน ในการ์ดเดียวกัน
   unit 'pct' = ตัวเลขเป็นร้อยละ · unit 'pt' = เป็นจุด (ใช้เมื่อต้นทางให้มาเป็นอัตราอยู่แล้ว) */
function chip2(yoy,mom,unit){
  const one=(v,lab,u)=>{
    if(v==null)return `<span class="chip">— ${lab}</span>`;
    const c=v>.15?'up':v<-.15?'dn':'fl', a=v>.15?'▲':v<-.15?'▼':'▬';
    return `<span class="chip ${c}">${a} ${v>0?'+':''}${v.toFixed(u==='pt'?1:1)}${u==='pt'?' จุด':'%'} <em>${lab}</em></span>`;
  };
  return `<span class="chip2">${one(yoy,'ปีก่อน','pct')}${one(mom,'เดือนก่อน',unit||'pct')}</span>`;
}
function spark(vals,color){
  const w=100,h=26,mn=Math.min(...vals),mx=Math.max(...vals),r=(mx-mn)||1;
  const p=vals.map((v,i)=>[i/(vals.length-1)*w,h-2-((v-mn)/r)*(h-6)]);
  const dl='M'+p.map(q=>q[0].toFixed(1)+','+q[1].toFixed(1)).join(' L');
  const id='s'+Math.random().toString(36).slice(2,8);
  return`<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="${color}" stop-opacity=".3"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
  <path d="${dl} L${w},${h} L0,${h} Z" fill="url(#${id})"/><path d="${dl}" fill="none" stroke="${color}" stroke-width="1.7" stroke-linejoin="round"/>
  <circle cx="${w}" cy="${p[p.length-1][1].toFixed(1)}" r="2.2" fill="${color}"/></svg>`}
/* ชื่อไอคอนใส่หลายตัวคั่นด้วย | ได้ เช่น 'product|otop'
   ถ้าตัวแรกยังไม่มีไฟล์ จะไล่ไปตัวถัดไปเอง หมดแล้วจึงถอยไปใช้ไอคอนเส้น
   ทำให้เพิ่มไอคอนใหม่ทีหลังได้โดยไม่ต้องแก้โค้ด และระหว่างที่ยังไม่มีก็ไม่มีช่องว่าง */
/* ─────────────── แผนภาพสัดส่วนแบบกล่อง (squarified treemap) ───────────────
   เขียนใหม่ตามอัลกอริทึม squarified ฉบับมาตรฐาน ของเดิมคำนวณอัตราส่วนผิด
   ทำให้กล่องแรกกินพื้นที่ทั้งแผ่น · items = [{n,v,color,icon,bg,tip,sub}] */
function tmLayout(items,W,H){
  const list=items.filter(x=>x.v>0).slice().sort((a,b)=>b.v-a.v);
  const total=list.reduce((a,b)=>a+b.v,0)||1;
  const out=[];
  let x=0,y=0,w=W,h=H;
  let rest=list.map(it=>({it,a:it.v/total*W*H}));   /* แปลงค่าเป็นพื้นที่จริงทันที */
  const worst=(row,len)=>{
    const s=row.reduce((a,b)=>a+b.a,0);
    const mx=row[0].a, mn=row[row.length-1].a;      /* เรียงมากไปน้อยอยู่แล้ว */
    return Math.max((len*len*mx)/(s*s),(s*s)/(len*len*mn));
  };
  while(rest.length){
    const len=Math.min(w,h);
    const row=[rest[0]]; let k=1;
    while(k<rest.length&&worst(row.concat([rest[k]]),len)<=worst(row,len)){row.push(rest[k]);k++;}
    const s=row.reduce((a,b)=>a+b.a,0);
    const thick=s/len;                              /* ความหนาของแถว */
    let off=0;
    row.forEach(r=>{
      const side=r.a/thick;                          /* ความยาวของกล่องในแถว */
      if(w>=h) out.push({it:r.it,x,y:y+off,w:thick,h:side});
      else     out.push({it:r.it,x:x+off,y,w:side,h:thick});
      off+=side;
    });
    if(w>=h){x+=thick;w-=thick}else{y+=thick;h-=thick}
    rest=rest.slice(row.length);
    if(w<0.5||h<0.5)break;
  }
  return {boxes:out,total:total};
}
function treemap(items,opt){
  opt=opt||{};
  const W=opt.w||1000, H=opt.h||560;
  const {boxes,total}=tmLayout(items,W,H);
  if(!boxes.length)return '';
  return boxes.map(b=>{
    const p=b.it.v/total*100;
    const aw=b.w/W*100, ah=b.h/H*100, area=aw*ah/100;
    const cls=(aw<9||ah<9)?'tm tiny':(area<4||aw<16||ah<14)?'tm sm':'tm';
    const art=(b.it.bg&&area>=3)?`<span class="tmbg" style="background-image:url('${b.it.bg}')"></span>`:'';
    const ico=(b.it.icon&&area>=2)?`<img class="tmic" src="${b.it.icon}" alt="" loading="lazy" onerror="this.remove()">`:'';
    const sub=(b.it.sub&&area>=6)?`<em>${b.it.sub}</em>`:'';
    return `<div class="${cls}" style="left:${(b.x/W*100).toFixed(3)}%;top:${(b.y/H*100).toFixed(3)}%;`+
      `width:${aw.toFixed(3)}%;height:${ah.toFixed(3)}%;background:${b.it.color}"`+
      (b.it.tip?` data-tip2="${b.it.tip}"`:'')+`>${art}${ico}<b>${b.it.n}</b><span>${p.toFixed(2)}%</span>${sub}</div>`;
  }).join('');
}

/* ─────────────── วงแหวนสัดส่วน ───────────────
   วาดเป็น SVG เองเพื่อคุมช่องว่างระหว่างชิ้นและไฮไลต์ตอนชี้ได้
   items = [{n,v,color,tip}] · รายชื่อสาขาแสดงเป็นรายการข้างนอก ไม่ยัดป้ายรอบวงให้รก */
function donutRing(items,opt){
  opt=opt||{};
  const W=460,H=460,CX=230,CY=230,R=196,RI=126;
  const list=items.filter(x=>x.v>0);
  const total=list.reduce((a,b)=>a+b.v,0)||1;
  const pol=(r,a)=>[CX+r*Math.cos(a),CY+r*Math.sin(a)];
  const PAD=0.006;                                  /* ช่องว่างบาง ๆ ระหว่างชิ้น */
  let ang=-Math.PI/2;
  const arcs=list.map((it,i)=>{
    const sweep=it.v/total*Math.PI*2;
    const a0=ang+PAD/2, a1=ang+sweep-PAD/2; ang+=sweep;
    const big=(a1-a0)>Math.PI?1:0;
    const [x0,y0]=pol(R,a0),[x1,y1]=pol(R,a1),[u0,v0]=pol(RI,a1),[u1,v1]=pol(RI,a0);
    const d=`M${x0.toFixed(2)},${y0.toFixed(2)} A${R},${R} 0 ${big} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`+
            ` L${u0.toFixed(2)},${v0.toFixed(2)} A${RI},${RI} 0 ${big} 0 ${u1.toFixed(2)},${v1.toFixed(2)} Z`;
    return `<path d="${d}" fill="${it.color}" class="dr-arc" data-sec="${i}"${it.tip?` data-tip2="${it.tip}"`:''}></path>`;
  }).join('');
  const c=`<text x="${CX}" y="${CY-26}" text-anchor="middle" class="dr-t1">${opt.centerTop||''}</text>
    <text x="${CX}" y="${CY+14}" text-anchor="middle" class="dr-t2">${opt.centerMid||''}</text>
    <text x="${CX}" y="${CY+42}" text-anchor="middle" class="dr-t3">${opt.centerSub||''}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="dring" xmlns="http://www.w3.org/2000/svg">${arcs}${c}</svg>`;
}

/* ผสมสองสีตามสัดส่วน k · ใช้ไล่สีระหว่างสาขาในหมวดเดียวกันให้แยกออกจากกัน */
function mixHex(a,b,k){
  const p=h=>[1,3,5].map(i=>parseInt(String(h).trim().substr(i,2),16));
  const A=p(a),B=p(b);
  return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('');
}
/* ไล่เฉดสีจากสีหลักของหมวด ยิ่งอันดับต้นยิ่งเข้ม */
function shade(hex,k){
  const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
  const c=p(hex.trim());
  const m=c.map(v=>Math.round(v+(255-v)*k));
  return '#'+m.map(v=>v.toString(16).padStart(2,'0')).join('');
}

/* ─────────────── ไอคอนหน้าแถวตาราง ───────────────
   จับคู่จากชื่อรายการ เรียงจากคำที่เจาะจงที่สุดไปกว้างที่สุด
   ไฟล์อยู่ที่ assets/icons/ic-row-<slug>.png ถ้ายังไม่มีจะไม่ขึ้นเฉย ๆ ไม่พัง */
const ROW_ICO=[
  /* ── ภาคเกษตร · พืช ── */
  [/ข้าวโพด/,'corn'],
  [/น้ำมันพืช|น้ำมันปาล์มบรรจุ|น้ำมันถั่วเหลือง/,'cookingoil'],
  [/ข้าวเปลือกเหนียว|ข้าวสารเหนียว|ข้าวเหนียว/,'stickyrice'],
  [/ข้าวนาปี|ข้าวเปลือก|ข้าวสาร|^ข้าว/,'rice'],
  [/อ้อย/,'sugarcane'],
  [/มันสำปะหลัง/,'cassava'],
  [/มันเทศ/,'sweetpotato'],
  [/พืชผัก|ผักสด/,'vegetable'],
  [/ถั่วลิสง/,'peanut'],
  [/ถั่วเหลือง/,'soybean'],
  [/ถั่วเขียว/,'mungbean'],
  [/ปอเทือง/,'sunhemp'],
  [/ปาล์ม/,'oilpalm'],
  [/ยางก้อน|น้ำยาง|ยางพารา/,'rubber'],
  /* ── ภาคเกษตร · ไม้ผลเศรษฐกิจ ── */
  [/ทุเรียน/,'durian'],
  [/ลำไย/,'longan'],
  [/กาแฟ/,'coffee'],
  [/เงาะ/,'rambutan'],
  [/ลิ้นจี่/,'lychee'],
  [/อินทผลัม/,'date'],
  [/^ไม้ผล|ไม้ผลเศรษฐกิจ/,'fruit'],
  /* ── ภาคเกษตร · แหล่งน้ำ ── */
  [/สูบน้ำ|โซลาร์|พลังงานแสงอาทิตย์/,'solarpump'],
  [/อ่างเก็บน้ำ|ชลประทาน|ฝาย|คลองส่งน้ำ|ประตูระบายน้ำ/,'irrigation'],
  [/บ่อบาดาล|บ่อน้ำ|สระน้ำ|แหล่งน้ำ/,'pond'],
  /* ── ภาคเกษตร · สถาบันและกลุ่ม ── */
  [/ศูนย์เรียนรู้|ศพก/,'learncenter'],
  [/ศัตรูพืช|ศจช/,'pest'],
  [/ดินปุ๋ย|ศดปช/,'soil'],
  [/กลุ่มส่งเสริมอาชีพ|กลุ่มแม่บ้าน|ยุวเกษตรกร/,'groupmaker'],
  [/วิสาหกิจชุมชน/,'sme'],
  [/แปลงใหญ่/,'bigplot'],
  [/เกษตรอินทรีย์|อินทรีย์/,'organic'],
  /* ── ภาคเกษตร · ปศุสัตว์และประมง ── */
  [/ปศุสัตว์/,'livestock'],
  [/ประมง/,'fish'],
  [/สุกร|หมู/,'pork'],
  [/เนื้อโค|โคเนื้อ|วัว/,'beef'],
  [/ไข่ไก่|ไข่เป็ด|^ไข่/,'egg'],
  [/ไก่/,'chicken'],
  [/ปลานิล|ปลา/,'fish'],
  /* ── อุตสาหกรรมและการผลิต ── */
  [/แปรรูปผลผลิตการเกษตร|แปรรูปการเกษตร/,'agroprocess'],
  [/โลหะ|วัสดุก่อสร้าง/,'metal'],
  [/อาหารและเครื่องดื่ม/,'foodbev'],
  [/พลังงาน|ชีวมวล/,'bioenergy'],
  [/ไม้และเฟอร์|เฟอร์นิเจอร์|ไม้แปรรูป/,'woodfurn'],
  /* ── OTOP ── */
  [/^ผ้า/,'cloth'],
  [/ของใช้|ของตกแต่ง|ของที่ระลึก/,'houseware'],
  [/สมุนไพร/,'herb'],
  [/เครื่องดื่ม/,'drink'],
  [/^อาหาร/,'food'],
  [/กลุ่มผู้ผลิตชุมชน/,'groupmaker'],
  [/รายเดียว|เจ้าของรายเดียว/,'singlemaker'],
  [/วิสาหกิจ|SME/i,'sme'],
  /* ── อื่น ๆ ── */
  [/GPP/i,'gpp'],
  [/งบประมาณ|เบิกจ่าย/,'spend'],
  [/OTOP/i,'otop']
];
function rowIcoName(label){
  const t=String(label||'');
  for(const [re,ic] of ROW_ICO)if(re.test(t))return ic;
  return null;
}
/* คืน <img> ไว้วางหน้าข้อความในตาราง · px ปกติ 18 */
function rowIco(label,px){
  const n=rowIcoName(label); if(!n)return '';
  const core=['rice','sugarcane','cassava','rubber','otop','gpp','spend',
               'fruit','irrigation','bigplot','organic'].indexOf(n)>=0;
  const file=core?('ic-'+n):('ic-row-'+n);
  return `<img class="rowico" src="assets/icons/${file}.png" alt="" width="${px||18}" height="${px||18}"
    loading="lazy" onerror="this.remove()">`;
}

function icoImg(name,px){
  const chain=String(name||'').split('|').filter(Boolean);
  const first=chain[0]||'';
  const rest=chain.slice(1).join('|');
  const onerr=rest
    ? `if(this.dataset.chain){var c=this.dataset.chain.split('|');if(c.length&&c[0]){this.dataset.chain=c.slice(1).join('|');this.src='assets/icons/ic-'+c[0]+'.png';return}}this.closest('.icow')?this.closest('.icow').classList.add('noimg'):0;this.remove()`
    : `this.closest('.icow')?this.closest('.icow').classList.add('noimg'):0;this.remove()`;
  return `<img class="ico" src="assets/icons/ic-${first}.png" alt="" width="${px||30}" height="${px||30}"
    ${rest?`data-chain="${rest}"`:''} loading="lazy" onerror="${onerr}">`;
}
function icoBase(name){const c=String(name||'').split('|').filter(Boolean);return c[c.length-1]||''}

/* ─────────────── ไอคอนเฉพาะจุด (จับคู่จากข้อความจริงบนการ์ด/หัวข้อ/แถว) ───────────────
   ทุกจุดที่ความหมายต่างกันจะได้ไอคอนของตัวเอง ไม่ใช้ซ้ำกับจุดอื่น
   ถ้าไฟล์ใหม่ยังไม่อัปโหลด จะถอยไปใช้ไอคอนเดิมเอง หน้าไม่มีช่องว่าง
   วิธีเพิ่ม: เพิ่มบรรทัด [/ข้อความ/,'ชื่อไฟล์'] แล้ววางไฟล์ assets/icons/ic-<ชื่อไฟล์>.png */
const ICO_REMAP={
 /* หัวข้อกล่อง (h3) */
 hd:[
  [/^สัดส่วน(เนื้อที่|พื้นที่)ปลูก/,'landshare'],
  [/^มูลค่าผลผลิตรายพืช/,'cropvalue'],
  [/^ผลผลิตเฉลี่ยต่อไร่/,'yieldperrai'],
  [/^พื้นที่ปลูกและพื้นที่ให้ผล/,'orchardarea'],
  [/^ปฏิทินการเก็บเกี่ยว/,'harvestcal'],
  [/^แหล่งน้ำเพื่อการเกษตรแยกตามประเภท/,'watertype'],
  [/^แหล่งน้ำชลประทานจำแนก/,'irrigationtype'],
  [/^ความเชื่อมโยงกับศูนย์บัญชาการ/,'waterlink'],
  [/^แหล่งท่องเที่ยวเชิงเกษตร/,'agrotourism'],
  [/^สถาบันและศูนย์เรียนรู้/,'institution'],
  [/^โครงสร้างการปกครอง/,'admin'],
  [/^ครัวเรือนเกษตรกรตามช่วงอายุ/,'farmerage'],
  [/^อันดับรายอำเภอ/,'ranking'],
  [/^สัดส่วนต่อจังหวัด/,'share'],
  [/^เทียบกับค่าเฉลี่ยจังหวัด/,'vsavg'],
  [/^ตารางข้อมูลรายอำเภอ/,'table'],
  [/^งบส่วนราชการ/,'budgetfunc'],
  [/^สัดส่วนงบที่เบิกจ่าย/,'budgetsplit'],
  [/^งบกรมและงบจังหวัด/,'provbudget'],
  [/^เงินกันไว้เบิกเหลื่อมปี/,'carryover'],
  [/^เม็ดเงินภาครัฐตามงวด/,'govflow'],
  [/^ดัชนีภาวะเศรษฐกิจ/,'mei'],
  [/^โครงสร้างเศรษฐกิจ/,'structure'],
  [/^การวิเคราะห์ด้านอุปสงค์/,'analysis'],
  [/^ตัวขับเคลื่อนดัชนี/,'drivers'],
  [/^รายได้และค่าใช้จ่ายเฉลี่ย/,'incexp'],
  [/^แหล่งที่มาของรายได้/,'incsource'],
  [/^หนี้ในระบบและนอกระบบ/,'debttype'],
  [/^ค่าใช้จ่ายตามขนาดครัวเรือน/,'hhsize'],
  [/^การกระจายค่าใช้จ่าย/,'expdist'],
  [/^5 กลุ่มอุตสาหกรรม/,'topindustry'],
  [/^จำนวนผู้ว่างงานและอัตรา/,'uetrend'],
  [/^อัตราการว่างงานรายปี/,'urtrend'],
  [/^ผู้มีงานทำแยกสาขา/,'empsector'],
  [/^สถานภาพการทำงาน/,'workstatus'],
  [/^รายได้จากผลิตภัณฑ์ OTOP รายปี/i,'otoptrend'],
  [/^รายได้รายเดือน/,'monthlyrev'],
  [/^รายได้รายอำเภอ/,'districtrev'],
  [/^ผลิตภัณฑ์จำแนกตามประเภท/,'producttype'],
  [/^ลักษณะผู้ประกอบการ/,'entrepreneur'],
  [/^ศักยภาพผลิตภัณฑ์รายอำเภอ/,'potential'],
  [/^รายได้ OTOP เทียบ/i,'sectorcompare'],
  [/^ความเร็วของข้อมูล/,'datalag'],
  [/^สถานะการส่งข้อมูล/,'datastatus'],
  [/^จำนวนประชากรรายปี/,'poptrend'],
  [/^การเกิดและการตาย/,'birthdeath'],
  [/^สัดส่วนวัย/,'agegroup'],
  [/^ประชากรรายอำเภอ/,'districtpop'],
  [/^แผนที่ประชากร/,'popmap'],
  [/^สรุปภาวะเศรษฐกิจจังหวัด/,'summary'],
  [/^ตารางสรุปตัวชี้วัด/,'kpitable'],
  [/^สิ่งที่ยังขาด/,'datagap'],
  [/^ภาพพื้นหลังหน้าปก/,'coverimg'],
  [/^ภาพพื้นหลังแถบเมนู/,'sidebarimg'],
  [/^สีหลัก/,'palette'],
  [/^โหมดจอนำเสนอ/,'presenter'],
  [/^ข้อมูลที่แก้ไขไว้ในเครื่อง/,'localdata'],
  [/^การเชื่อมต่อฐานข้อมูล/,'database'],
  [/^ทะเบียนชุดข้อมูล/,'catalog'],
  [/^วิธีคำนวณดัชนี/,'formula'],
  [/ช่องทางติดต่อ$/,'contact'],
  [/^แนวโน้มผู้เยี่ยมเยือน/,'visitortrend'],
  [/^สัดส่วนชาวไทยและชาวต่างชาติ/,'nationality'],
  [/^ค่าใช้จ่ายเฉลี่ยต่อคน/,'touristspend'],
  [/^อัตราการเข้าพัก/,'occupancy'],
  [/^ผู้เยี่ยมเยือน รายได้/,'monthlytour'],
  [/^แหล่งท่องเที่ยว(\s*[\d,]+ แห่ง)?$/,'attractionmap'],
  [/^ประเภทแหล่งท่องเที่ยว/,'attractiontype'],
  [/^ศักยภาพที่ยังไม่ถูกใช้/,'untapped'],
  [/^ราคาเทียบปีก่อน/,'agriprice'],
  [/^พืชเศรษฐกิจ$/,'pricecrop'],
  [/^พืชไร่และพืชพลังงาน/,'pricefield'],
  [/^ปศุสัตว์และประมง/,'pricemeat'],
  [/^สินค้าอุปโภคบริโภค/,'pricegoods']
 ],
 /* การ์ดตัวเลข (ชื่อการ์ด) */
 kpi:[
  [/^ครัวเรือนเกษตรกร$/,'farmhh'],
  [/^ผลผลิตรวม/,'yield'],
  [/^มูลค่าผลผลิต(เกษตร)?$/,'cropvalue'],
  [/^ท่องเที่ยวเชิงเกษตร/,'agrotourism'],
  [/^พื้นที่รับประโยชน์/,'irrigatedarea'],
  [/^ระบบสูบน้ำโซลาร์/,'solarpump'],
  [/^พื้นที่เกษตรที่ยังพึ่งน้ำฝน/,'rainfed'],
  [/^องค์กรปกครองท้องถิ่น/,'localgov'],
  [/^พื้นที่ภาคการเกษตร/,'farmland'],
  [/^เบิกจ่ายภาพรวม|^เบิกจ่ายงบประมาณ/,'disburse'],
  [/^(เบิกจ่าย)?งบลงทุน/,'capex'],
  [/^(เบิกจ่าย)?งบประจำ/,'opex'],
  [/^งบจัดสรรทั้งจังหวัด/,'allocation'],
  [/^เม็ดเงินรัฐลงพื้นที่/,'govflow'],
  [/^ดัชนีเศรษฐกิจรายเดือน/,'mei'],
  [/^GPP ต่อหัว/,'gpppc'],
  [/^สัดส่วนภาคเกษตรใน GPP/,'agrishare'],
  [/^เงินเหลือต่อเดือน/,'savings'],
  [/^ไฟฟ้าภาคธุรกิจ/,'powerbiz'],
  [/^ผู้ประกอบการ/,'entrepreneur'],
  [/^ร้านค้าชุมชน/,'communityshop'],
  [/^ดีเซล/,'diesel'],
  [/^รถจักรยานยนต์/,'motorcycle'],
  [/^รถยนต์นั่ง/,'car'],
  [/^รถเพื่อการพาณิชย์/,'truck'],
  [/^จำนวนรายที่ได้รับอนุมัติ/,'borrowers'],
  [/^สินค้าที่ราคาสูงขึ้น/,'priceup'],
  [/^สินค้าที่ราคาลดลง/,'pricedown'],
  [/^น้ำยางสด/,'latex'],
  [/^นักท่องเที่ยว/,'tourist'],
  [/^นักทัศนาจร/,'excursionist']
 ],
 /* ไอคอนหน้าแถวตาราง (ข้อความทั้งช่อง รวมบรรทัดรายละเอียด) */
 row:[
  [/ข้าวสารหอมมะลิ/,'row-milledrice'],
  [/ข้าวเปลือกเหนียว/,'row-paddysticky'],
  [/มันสำปะหลัง.*ลานมัน/,'row-cassavayard'],
  [/มันสำปะหลัง.*โรงแป้ง/,'row-cassavastarch'],
  [/ข้าวโพด.*ฝัก/,'row-cornear'],
  [/ข้าวโพด.*เมล็ด.*14\.5/,'row-corndry'],
  [/ข้าวโพด.*เมล็ด/,'row-cornkernel'],
  [/ยางก้อนถ้วย/,'row-cuplump'],
  [/น้ำยางสด/,'row-latex'],
  [/สามชั้น/,'row-porkbelly'],
  [/เนื้อโคชำแหละ/,'row-beefcut'],
  [/^โคเนื้อ/,'row-cattle'],
  [/ไก่.*อก/,'row-chickenbreast'],
  [/ไก่.*(น่อง|สะโพก)/,'row-chickenleg'],
  [/^ประมง/,'row-fishery'],
  [/สูบน้ำด้วยไฟฟ้า/,'row-electricpump'],
  [/บ่อบาดาล/,'row-groundwell'],
  [/แหล่งน้ำในไร่นา/,'row-farmpond'],
  [/อ่างเก็บน้ำ/,'row-reservoir'],
  [/^พื้นที่ชลประทาน/,'row-irrigatedarea'],
  [/กลุ่มส่งเสริมอาชีพ/,'row-farmgroup'],
  [/กลุ่มแม่บ้าน/,'row-housewife'],
  [/ยุวเกษตรกร/,'row-youthfarmer']
 ]
};
function icoCtxOf(img){
  const tx=el=>el?String(el.textContent||'').replace(/\s+/g,' ').trim():'';
  const k=img.closest('.kpi');if(k)return['kpi',tx(k.querySelector('.h>span:last-child'))];
  const b=img.closest('.bigkpi');if(b)return['kpi',tx(b.querySelector('.bk-l'))];
  if(img.classList.contains('rowico'))return['row',tx(img.closest('td,.nm,span,div'))];
  const h=img.closest('header');if(h)return['hd',tx(h.querySelector('h3,h2'))];
  return['',''];
}
function icoFallback(){
  const c=String(this.dataset.fb||'').split('|').filter(Boolean);
  if(c.length){this.dataset.fb=c.slice(1).join('|');this.src='assets/icons/'+c[0]+'.png';return}
  const w=this.closest('.icow');if(w)w.classList.add('noimg');this.remove();
}
function relabelIcons(root){
  const r=root||document;if(!r.querySelectorAll)return;
  const imgs=r.matches&&r.matches('img.ico,img.rowico')?[r]:r.querySelectorAll('img.ico:not([data-rl]),img.rowico:not([data-rl])');
  imgs.forEach(img=>{
    if(img.dataset.rl)return;img.dataset.rl='1';
    const [ctx,t]=icoCtxOf(img);const list=ICO_REMAP[ctx];if(!list||!t)return;
    const hit=list.find(x=>x[0].test(t));if(!hit)return;
    const m=(img.getAttribute('src')||'').match(/icons\/(ic-[^\/]+?)\.png/);const cur=m?m[1]:'';
    const want='ic-'+hit[1];if(want===cur)return;
    const rest=img.dataset.chain?img.dataset.chain.split('|').filter(Boolean).map(x=>'ic-'+x):[];
    img.dataset.fb=[cur].concat(rest).filter(Boolean).join('|');
    img.onerror=icoFallback;
    img.src='assets/icons/'+want+'.png';
  });
}
/* พื้นหลังศิลป์ของการ์ด KPI — ใช้ชื่อเดียวกับไอคอนของการ์ดนั้น
   เป็น background-image ใน CSS ถ้าไฟล์ยังไม่มีจะไม่ขึ้นเฉย ๆ ไม่มี error และไม่กระทบข้อความ */
const CARD_BG_DIR='assets/cardbg/';
function cardBg(name){return name?`<span class="kpibg" style="background-image:url('${CARD_BG_DIR}bg-${name}.webp')"></span>`:''}
function kpiCard(o){
  const T=o.go?'button':'div';
  let sc=o.sim===false?(SIM_TOUCH=null,''):simChip(simTake());
  /* การ์ดดัชนี NBL–MEI ไม่ได้อ่านผ่าน seriesAt จึงตรวจจากสัดส่วนน้ำหนักที่เป็นค่าจริงแทน */
  if(!sc&&o.sim!==false&&typeof MEI!=='undefined'&&MEI.real<.999&&/NBL|ดัชนีเศรษฐกิจรายเดือน|ดัชนีภาวะเศรษฐกิจ/.test(String(o.label||'')))
    sc=simChip({sim:1,real:MEI.real>0?1:0});
  const bg=o.bg===false?'':cardBg(o.bg||icoBase(o.img));
  return`<${T} class="kpi${bg?' hasbg':''}"${o.go?` data-go="${o.go}"`:''}${o.tip?` data-tip2="${o.tip}"`:''}
    ${o.color?`style="--kpi:${o.color}"`:''}>
    ${bg}
    <div class="h">${o.img?`<span class="ic icow img" style="background:${o.color}14">${icoImg(o.img,26)}<svg viewBox="0 0 24 24" style="stroke:${o.color}">${IC[o.icon]||''}</svg></span>`
      :o.icon?`<span class="ic" style="background:${o.color}1e"><svg viewBox="0 0 24 24" style="stroke:${o.color}">${IC[o.icon]}</svg></span>`:''}<span>${o.label}</span></div>
    <div class="v n">${o.value}${o.unit?`<small>${o.unit}</small>`:''}</div>
    ${o.spark?`<div class="spark">${o.spark}</div>`:''}
    <div class="f">${sc}${o.chip||''}${o.sub?`<span class="sub">${o.sub}</span>`:''}</div></${T}>`}
function gaugeSvg(p,color){
  const R=34,cx=39,cy=41,C=Math.PI*R,v=Math.min(100,p)/100;
  return`<svg viewBox="0 0 78 47"><path d="M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="${cv('--line')}" stroke-width="8" stroke-linecap="round"/>
  <path d="M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round"
   stroke-dasharray="${(C*v).toFixed(1)} ${C.toFixed(1)}"/></svg>`}
function cropValue(){return D.crop.rows.reduce((a,r)=>a+(r.price?r.y*r.price:0),0)/1e6}
/* เซลล์ตารางที่แก้ไขได้ */
function ec(path,val,dec,cls){
  return`<td class="${cls||'r'}" data-path="${path}"${dec!=null?` data-dec="${dec}"`:''}>${val}</td>`}

/* ─────────────── 6) tooltip ─────────────── */
const TIP=()=>document.getElementById('tip');
function initTip(){
  document.addEventListener('mouseover',e=>{
    const el=e.target.closest('[data-tip2]');if(!el)return;
    const parts=String(el.dataset.tip2).split('|').filter(x=>x!=='');
    let html=`<div class="tt">${parts[0]}</div>`;
    const desc=[],meta=[];
    parts.slice(1).forEach(p=>{
      if(/^(ที่มา|วิธีคำนวณ|งวดข้อมูล|เกณฑ์)/.test(p))meta.push(p); else desc.push(p);
    });
    if(desc.length)html+=`<div class="td">${desc.join('<br>')}</div>`;
    meta.forEach(m=>{
      const i=m.indexOf(':');
      const k=i>0?m.slice(0,i):'', v=i>0?m.slice(i+1).trim():m;
      html+=`<div class="tm"><span>${k}</span>${v}</div>`;
    });
    TIP().innerHTML=html;
    TIP().classList.add('on');moveTip(e)});
  document.addEventListener('mousemove',e=>{if(TIP().classList.contains('on'))moveTip(e)});
  document.addEventListener('mouseout',e=>{if(e.target.closest('[data-tip2]'))TIP().classList.remove('on')});
}
function moveTip(e){
  const t=TIP(),w=t.offsetWidth,h=t.offsetHeight;
  let x=e.clientX+16,y=e.clientY+16;
  if(x+w>innerWidth-10)x=e.clientX-w-14;
  if(y+h>innerHeight-10)y=e.clientY-h-14;
  t.style.left=x+'px';t.style.top=y+'px';
}

/* ─────────────── 7) charts ─────────────── */
function chDefaults(){
  if(typeof Chart==='undefined')return;
  const small=innerWidth<768;
  Chart.defaults.font.family="'IBM Plex Sans Thai',system-ui,sans-serif";
  Chart.defaults.font.size=small?10:11;
  Chart.defaults.color=cv('--dim');
  const dd=Chart.defaults;
  dd.layout=dd.layout||{}; dd.layout.padding={top:8,right:12,bottom:2,left:2};
  dd.elements=dd.elements||{}; dd.elements.bar=dd.elements.bar||{}; dd.elements.point=dd.elements.point||{};
  dd.animation=(typeof dd.animation==='object'&&dd.animation)||{};
  Chart.defaults.plugins.legend.position='bottom';
  Chart.defaults.plugins.legend.labels.boxWidth=8;
  Chart.defaults.plugins.legend.labels.boxHeight=8;
  Chart.defaults.plugins.legend.labels.padding=12;
  Chart.defaults.plugins.legend.labels.usePointStyle=true;
  Chart.defaults.plugins.legend.labels.font={size:small?10:10.5};
  Chart.defaults.plugins.tooltip.enabled=false;
  Chart.defaults.plugins.tooltip.external=externalTip;
  dd.elements.bar.borderRadius=5;
  dd.elements.point.hoverRadius=5;
  dd.elements.point.hitRadius=12;
  dd.animation.duration=700;
  dd.animation.easing='easeOutCubic';
  Chart.defaults.maintainAspectRatio=false;
}
const CH={};
/* เก็บกวาดกราฟกำพร้า · ถ้า canvas ของกราฟถูกถอดออกจากหน้า (เช่นวาดการ์ดใหม่ด้วย innerHTML)
   Chart.js จะยังถือกราฟนั้นไว้และโยน error ตอนปรับขนาดจอ ซึ่งโผล่มาเป็น "Script error."
   ตรวจทุกครั้งที่หน้าเปลี่ยนโครงสร้าง แล้วทำลายกราฟที่ไม่มี canvas อยู่ในหน้าแล้ว */
(function(){
  if(typeof MutationObserver==='undefined')return;
  let tm=null;
  const sweep=()=>{
    tm=null;
    try{
      if(typeof Chart==='undefined'||!Chart.instances)return;
      Object.values(Chart.instances).forEach(c=>{
        if(c&&c.canvas&&!document.body.contains(c.canvas)){try{c.destroy()}catch(e){}}
      });
    }catch(e){}
  };
  const watch=()=>{
    if(watch.on||!document.body)return; watch.on=true;
    new MutationObserver(ms=>{
      if(tm)return;
      if(ms.some(m=>[...m.removedNodes].some(n=>n.nodeType===1&&(n.tagName==='CANVAS'||(n.querySelector&&n.querySelector('canvas'))))))
        tm=setTimeout(sweep,0);
    }).observe(document.body,{childList:true,subtree:true});
  };
  if(document.body)watch(); else document.addEventListener('DOMContentLoaded',watch);
  /* กันอีกชั้น · ปรับขนาดจอเมื่อไรก็กวาดก่อน เพราะจังหวะนั้นคือตอนที่ Chart.js โยน error */
  window.addEventListener('resize',sweep,true);
})();

/* ทำลายกราฟของ canvas นั้นก่อนจะถอดหรือสร้าง canvas ใหม่
   ถ้าไม่ทำ Chart.js จะยังถือ canvas เก่าไว้แล้วโยน error ตอนปรับขนาดหน้าจอ */
function killChart(id){
  try{ if(typeof Chart!=='undefined'){const c=Chart.getChart(id); if(c)c.destroy();} }catch(e){}
}
function mk(id,cfg){
  const el=document.getElementById(id);if(!el||typeof Chart==='undefined')return;
  const small=innerWidth<768;
  try{
    const o=cfg.options=cfg.options||{};
    o.scales=o.scales||{};
    if(o.indexAxis==='y'&&o.scales.y){
      o.scales.y.ticks=Object.assign({autoSkip:false,crossAlign:'far',padding:4},o.scales.y.ticks||{});
      o.scales.y.afterFit=function(sc){sc.width=Math.min(sc.width+6, small?128:210)};
    }
    if(o.scales.x&&o.indexAxis!=='y'){
      o.scales.x.ticks=Object.assign({autoSkip:true,maxRotation:small?40:0,minRotation:0},o.scales.x.ticks||{});
    }
    if(cfg.type==='doughnut'||cfg.type==='pie'){
      o.plugins=o.plugins||{}; o.plugins.legend=o.plugins.legend||{};
      if(small||o.plugins.legend.position==='right'&&el.clientWidth<420)o.plugins.legend.position='bottom';
      o.plugins.legend.labels=Object.assign({boxWidth:8,boxHeight:8,padding:9,font:{size:small?9.5:10.5}},o.plugins.legend.labels||{});
    }
    if(CH[id])CH[id].destroy();
    CH[id]=new Chart(el,cfg);
  }catch(e){console.warn('chart',id,e)}}
const ax=(e={})=>({grid:{color:cv('--grid'),drawTicks:false},border:{display:false},
  ticks:{padding:6,maxRotation:0,autoSkipPadding:14},...e});
const PAL=()=>[cv('--brand'),cv('--blue'),cv('--gold'),cv('--coral'),cv('--leaf'),cv('--brand2'),cv('--plum')];

/* ─────────────── 14) ภาคส่วนรายเดือน (สร้างหน้าอัตโนมัติ) ─────────────── */
const SEC_META={
  industry:{title:'อุตสาหกรรมและการผลิต',lead:'โรงงาน เงินลงทุน และการจ้างงาน โดยมีปริมาณการใช้ไฟฟ้าภาคอุตสาหกรรมเป็นตัวยืนยันว่าโรงงานเดินเครื่องจริงหรือไม่',
    insight:'การใช้ไฟฟ้าภาคอุตสาหกรรมเป็นตัวชี้เชิงประจักษ์ที่โกหกไม่ได้ ถ้าจำนวนโรงงานเพิ่มแต่ไฟฟ้าไม่เพิ่ม แปลว่าโรงงานที่ขออนุญาตยังไม่เดินเครื่องจริง',
    extra:{title:'5 กลุ่มอุตสาหกรรมที่ลงทุนสูงสุด',unit:'ล้านบาท',
      rows:[['แปรรูปผลผลิตการเกษตร',3120],['ผลิตภัณฑ์อโลหะ / วัสดุก่อสร้าง',2140],['อาหารและเครื่องดื่ม',1580],
            ['ผลิตพลังงานและไฟฟ้าชีวมวล',1120],['ผลิตภัณฑ์ไม้และเฟอร์นิเจอร์',760]]}},
  trade:{title:'การค้า ค่าครองชีพ และการลงทุนเอกชน',lead:'ดัชนีราคาผู้บริโภคบอกว่าเงินในกระเป๋าประชาชนซื้อของได้เท่าเดิมหรือไม่ ส่วนสินเชื่อบอกว่าผู้ประกอบการยังกล้าลงทุนอยู่หรือเปล่า',
    insight:'เมื่อเงินเฟ้อเร่งตัวขึ้นพร้อมกับสินเชื่อที่ชะลอลง เป็นสัญญาณว่ากำลังซื้อถูกบีบสองทาง ควรพิจารณามาตรการลดค่าครองชีพควบคู่กับการเข้าถึงแหล่งทุน'},
  consume:{title:'การบริโภคและพลังงาน',lead:'ปริมาณน้ำมันที่ใช้และรถที่จดทะเบียนใหม่ คือกระจกสะท้อนกำลังซื้อและความเชื่อมั่นของครัวเรือนที่เห็นผลเร็วที่สุด',
    insight:'รถจักรยานยนต์จดทะเบียนใหม่เป็นตัวชี้กำลังซื้อระดับฐานราก ส่วนรถเพื่อการพาณิชย์สะท้อนความเชื่อมั่นของผู้ประกอบการขนส่งและการค้า'},
  labor:{title:'ตลาดแรงงาน',lead:'คนมีงานทำคือฐานกำลังซื้อที่ยั่งยืนที่สุด หน้านี้ติดตามการมีงานทำ การว่างงาน และการเข้าสู่ระบบประกันสังคม',
    insight:'จังหวัดที่พึ่งภาคเกษตรสูงมักมีแรงงานนอกระบบมาก ตัวเลขผู้ประกันตนมาตรา 40 ที่เพิ่มขึ้นจึงเป็นสัญญาณที่ดีว่าแรงงานอิสระเข้าสู่ระบบคุ้มครองมากขึ้น'},
  tourism:{title:'ภาคการท่องเที่ยว',lead:'รายได้จากการท่องเที่ยวคือเงินใหม่ที่ไหลเข้าจังหวัดจากภายนอก ต่างจากการค้าภายในที่เป็นการหมุนเงินก้อนเดิม',
    insight:'หนองบัวลำภูมีจุดขายด้านธรรมชาติและแหล่งท่องเที่ยวเชิงเกษตร 73 แห่ง การเชื่อมเส้นทางท่องเที่ยวเข้ากับแปลงใหญ่และวิสาหกิจชุมชนจะเพิ่มรายได้ให้เกษตรกรโดยตรง'}
};
function renderSector(sid){
  const sec=SECTORS.find(s=>s.id===sid),M=SEC_META[sid];
  const all=[];sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id);d.series.forEach(s=>all.push({d,s}))});
  const agy=[...new Set(sec.datasets.map(id=>DATASETS.find(x=>x.id===id).agency))].join(' · ');
  const el=document.getElementById('v-'+sid);
  el.innerHTML=`
    <div class="ph"><div class="t" style="display:flex;gap:14px;align-items:flex-start">
      <span class="bigico icow img">${icoImg(sec.ico||sec.id,52)}</span>
      <span><h2>${M.title}</h2><p>${M.lead}</p></span></div>
      <div class="r"><span class="chip mock">โครงร่าง รอข้อมูลจริง</span><span class="chip">${agy.replace(/สำนักงาน/g,'สนง.')}</span></div></div>
    ${slicerBar('slc-'+sid,{freqs:['M','Q','Y'],freq:'M',label:'เลือกงวดข้อมูล',compare:true})}
    <div class="grid g4 mb" id="k-${sid}"></div>
    <div class="grid g21 mb">
      <div class="c"><header><h3>แนวโน้มรายเดือน 36 เดือน</h3>
        <span class="r"><span class="segs" data-dom="${sid}"><button class="on" data-mode="line">ค่าจริง</button><button data-mode="yoy">%YoY</button></span></span></header>
        <div class="b"><div class="ch lg"><canvas id="c-${sid}"></canvas></div><div class="note">${M.insight}</div></div></div>
      <div class="c"><header><span class="hdico icow img" data-hdico="${M.extra?'industry':'compare'}"></span><h3>${M.extra?M.extra.title:'เปรียบเทียบรายปี'}</h3>${M.extra?`<span class="u">${M.extra.unit}</span>`:''}</header>
        <div class="b">${M.extra?'<div class="sc"><table class="t" id="tx-'+sid+'"></table></div>':'<div class="ch lg"><canvas id="cy-'+sid+'"></canvas></div>'}</div></div>
    </div>
    <div class="grid g2">
      ${M.extra?`<div class="c"><header><h3>เปรียบเทียบรายปี</h3></header><div class="b"><div class="ch"><canvas id="cy-${sid}"></canvas></div></div></div>`:''}
      <div class="c"><header><h3>กระจายรายอำเภอ</h3><span class="u">เดือนล่าสุด</span></header>
        <div class="b"><div class="sc"><table class="t" id="td-${sid}"></table></div></div></div>
    </div>
    <div class="c" style="margin-top:13px"><header><h3>แหล่งข้อมูลและหน่วยงานผู้รับผิดชอบ</h3></header>
      <div class="b">${srcBar(sec.datasets)}</div></div>`;
  const st=slicerState('slc-'+sid);
  const info=document.getElementById('slc-'+sid+'-info');
  const full={M:1,Q:3,Y:12}[st.freq];
  if(info)info.innerHTML=`กำลังแสดง <b>${st.label}</b>`+
    (st.freq==='M'?'':` · ครอบคลุม ${st.idx.length} เดือน`+(st.idx.length<full?' <span style="color:var(--warn)">(ยังไม่ครบงวด)</span>':''))+
    (st.cmp?' · เทียบงวดเดียวกันปีก่อน':'');
  $('#k-'+sid).innerHTML=all.slice(0,4).map((o,i)=>{
    const arr=DB[o.d.id][o.s.key];
    const mode=o.s.agg||(o.s.pct?'avg':'sum');
    const modeTxt={sum:'ผลรวมในงวด',avg:'ค่าเฉลี่ยในงวด',last:'ค่า ณ สิ้นงวด'}[mode];
    const now=seriesAt(arr,st,mode), was=seriesPrevYear(arr,st,mode);
    const pc=was?pctc(now,was):null;
    return kpiCard({icon:['chart','coin','people','bolt'][i],img:o.s.ico,color:PAL()[i],label:o.s.label,
      value:f(now,o.s.dec??0),unit:o.s.unit,
      chip:(pc==null?'<span class="chip">—</span>':chip(pc))+' '+statusBadge(pc,!!o.d.invert,o.s.label+' เทียบงวดเดียวกันปีก่อน'),
      spark:spark(arr.slice(-18).map(x=>x.v),PAL()[i]),
      sub:agencyName(o.d.id).replace('สำนักงาน','สนง.').replace('จังหวัดหนองบัวลำภู','จ.นภ.'),
      tip:tipOf({t:o.s.label,
        d:'หน่วยวัด '+o.s.unit+(st.freq==='M'?' · ค่าของเดือนที่เลือก':' · '+modeTxt),
        calc:st.freq==='M'?'ค่าที่หน่วยงานรายงานในเดือนนั้นโดยตรง'
          :({sum:'รวมค่ารายเดือนภายในงวดที่เลือก',
             avg:'เฉลี่ยค่ารายเดือนภายในงวดที่เลือก เพราะเป็นอัตราหรือดัชนี นำมาบวกกันไม่ได้',
             last:'ใช้ค่าของเดือนสุดท้ายในงวด เพราะเป็นยอดสะสมหรือจำนวนคงค้าง ณ เวลาหนึ่ง นำมาบวกกันจะนับซ้ำ'}[mode])+
            (pc!=null?' · เปรียบเทียบกับงวดเดียวกันของปีก่อน = (งวดนี้ − ปีก่อน) ÷ ปีก่อน × 100':''),
        src:o.d.id, when:st.label})})}).join('');
  drawSectorChart(sid,'line');
  mk('cy-'+sid,{type:'bar',data:{labels:YEARS.map(y=>'ปี '+y),
    datasets:all.slice(0,3).map((o,i)=>({label:o.s.label,
      data:YEARS.map(y=>{const q=DB[o.d.id][o.s.key].filter(x=>x.y===y);if(!q.length)return null;
        return o.s.pct?+(q.reduce((a,b)=>a+b.v,0)/q.length).toFixed(2):+q.reduce((a,b)=>a+b.v,0).toFixed(1)}),
      backgroundColor:PAL()[i],borderRadius:5,barPercentage:.7}))},
    options:{plugins:{legend:{position:'bottom',labels:{padding:10,font:{size:10}}}},
      scales:{x:ax({grid:{display:false}}),y:ax({beginAtZero:true,ticks:{callback:v=>f(v,0)}})}}});
  const o=all[0],vals=DISTRICTS.map(dt=>({n:dt.name,v:DBD[o.d.id][o.s.key][dt.code]})).sort((a,b)=>b.v-a.v);
  const tot=vals.reduce((a,b)=>a+b.v,0)||1,mx=vals[0].v||1;
  $('#td-'+sid).innerHTML=`<thead><tr><th>อำเภอ</th><th class="r">${o.s.label} (${o.s.unit})</th><th class="r">สัดส่วน</th><th style="width:110px"></th></tr></thead><tbody>`+
    vals.map(r=>`<tr><td>${r.n}</td><td class="r">${f(r.v,o.s.dec??0)}</td><td class="r">${(r.v/tot*100).toFixed(1)}%</td>
      <td><div class="bar"><i style="width:${(r.v/mx*100).toFixed(0)}%;background:${sec.color}"></i></div></td></tr>`).join('')+'</tbody>';
  bindSlicers(()=>renderSector(sid));
  if(M.extra){const m2=M.extra.rows[0][1];
    $('#tx-'+sid).innerHTML=`<thead><tr><th>รายการ</th><th class="r">${M.extra.unit}</th><th style="width:80px"></th></tr></thead><tbody>`+
      M.extra.rows.map(r=>`<tr><td>${rowIco(r[0])}${r[0]}</td><td class="r">${f(r[1],0)}</td>
        <td><div class="bar"><i style="width:${(r[1]/m2*100).toFixed(0)}%;background:${sec.color}"></i></div></td></tr>`).join('')+'</tbody>';}
}
function drawSectorChart(sid,mode){
  const sec=SECTORS.find(s=>s.id===sid),ds=[];let i=0;
  sec.datasets.forEach(id=>{const d=DATASETS.find(x=>x.id===id);
    d.series.forEach(s=>{const arr=DB[id][s.key];
      const data=mode==='yoy'?arr.map((x,j)=>j<12?null:+pctc(x.v,arr[j-12].v).toFixed(2)):arr.map(x=>x.v);
      const c=PAL()[i%7];
      ds.push({label:s.label+(mode==='yoy'?' (%YoY)':' ('+s.unit+')'),data,borderColor:c,backgroundColor:c+'20',
        borderWidth:i===0?2.4:1.7,pointRadius:0,pointHoverRadius:4,tension:.32,fill:i===0&&mode!=='yoy',
        yAxisID:(mode==='yoy'||i===0)?'y':'y2'});i++})});
  const scales={x:ax({grid:{display:false},ticks:{maxTicksLimit:13,font:{size:9.5}}}),y:ax({ticks:{callback:v=>f(v,0)}})};
  if(mode!=='yoy'&&ds.length>1)scales.y2={position:'right',grid:{display:false},border:{display:false},ticks:{callback:v=>f(v,0),font:{size:9.5}}};
  mk('c-'+sid,{type:'line',data:{labels:MONTHS.map(m=>m.label),datasets:ds},
    options:{interaction:{mode:'index',intersect:false},plugins:{legend:{position:'bottom',labels:{padding:11,font:{size:10}}}},scales}});
}

/* ─────────────── 19) โหมดแก้ไขตาราง ─────────────── */
let EDIT=false;
let AUTH=null;
try{AUTH=JSON.parse(sessionStorage.getItem('nblEcon.auth')||'null')}catch(e){}

/* หน่วยงานที่มีสิทธิ์แก้แต่ละตาราง — ต้องตรงกับคอลัมน์ domains ในชีต Users */
const OWNER_NAME={spend:'สำนักงานคลังจังหวัด',crop:'สำนักงานเกษตรจังหวัด',
  factory:'สำนักงานอุตสาหกรรมจังหวัด',power:'การไฟฟ้าส่วนภูมิภาคจังหวัด',
  cpi:'สำนักงานพาณิชย์จังหวัด',credit:'SME D Bank',fuel:'สำนักงานพลังงานจังหวัด',
  car:'สำนักงานขนส่งจังหวัด',labor:'สำนักงานแรงงานจังหวัด',social:'สำนักงานประกันสังคมจังหวัด',
  tour:'สำนักงานการท่องเที่ยวและกีฬาจังหวัด','*':'ผู้ดูแลระบบเท่านั้น'};
function myDomainList(){return String((AUTH&&AUTH.domains)||'').split(',').map(x=>x.trim()).filter(Boolean)}
function canEdit(owner){
  if(!AUTH)return false;
  if(AUTH.role==='admin'||myDomainList().indexOf('*')>=0)return true;
  return owner&&owner!=='*'&&myDomainList().indexOf(owner)>=0;
}
function tableOwner(td){
  const t=td.closest('[data-owner]');
  return t?t.dataset.owner:'*';
}

function applyEditMode(){
  document.querySelectorAll('table[data-owner]').forEach(t=>{
    t.classList.toggle('locked',EDIT&&!canEdit(t.dataset.owner));
  });
  $$('td[data-path]').forEach(td=>{
    if(EDIT&&canEdit(tableOwner(td)))td.setAttribute('contenteditable','true');
    else td.removeAttribute('contenteditable');
  });
}

/* ── กล่องเข้าสู่ระบบสำหรับแก้ไขข้อมูล ── */
function authBox(){
  return new Promise(resolve=>{
    const wrap=document.createElement('div');
    wrap.className='modal';
    wrap.innerHTML=`<div class="mbox">
      <h3>ยืนยันตัวตนก่อนแก้ไขข้อมูล</h3>
      <p>ระบบจะเปิดให้แก้ไขเฉพาะตารางที่หน่วยงานของท่านรับผิดชอบ ผู้ดูแลระบบแก้ไขได้ทุกตาราง</p>
      <label>หน่วยงาน</label>
      <select id="mAg">
        <option value="klang">สำนักงานคลังจังหวัดหนองบัวลำภู</option>
        <option value="agri">สำนักงานเกษตรจังหวัดหนองบัวลำภู</option>
        <option value="industry">สำนักงานอุตสาหกรรมจังหวัดหนองบัวลำภู</option>
        <option value="pea">การไฟฟ้าส่วนภูมิภาคจังหวัดหนองบัวลำภู</option>
        <option value="commerce">สำนักงานพาณิชย์จังหวัดหนองบัวลำภู</option>
        <option value="smebank">ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมฯ</option>
        <option value="energy">สำนักงานพลังงานจังหวัดหนองบัวลำภู</option>
        <option value="transport">สำนักงานขนส่งจังหวัดหนองบัวลำภู</option>
        <option value="labour">สำนักงานแรงงานจังหวัดหนองบัวลำภู</option>
        <option value="sso">สำนักงานประกันสังคมจังหวัดหนองบัวลำภู</option>
        <option value="mots">สำนักงานการท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู</option>
        <option value="province">สำนักงานจังหวัดหนองบัวลำภู (ผู้ดูแลระบบ)</option>
        <option value="admin">สำนักงานสถิติจังหวัดหนองบัวลำภู (ผู้ดูแลระบบ)</option>
      </select>
      <label>รหัส PIN</label>
      <input id="mPin" type="password" inputmode="numeric" maxlength="10" autocomplete="off" placeholder="••••••">
      <div class="mmsg" id="mMsg"></div>
      <div class="mact">
        <button class="tb" id="mCancel">ยกเลิก</button>
        <button class="tb on" id="mOk">เข้าสู่ระบบ</button>
      </div>
      <div class="mnote">PIN ถูกเก็บเป็นค่า hash บนเซิร์ฟเวอร์เท่านั้น ใส่ผิดเกิน 5 ครั้งระบบจะล็อกบัญชี 15 นาที</div>
    </div>`;
    document.body.appendChild(wrap);
    const close=v=>{wrap.remove();resolve(v)};
    wrap.querySelector('#mCancel').onclick=()=>close(false);
    wrap.addEventListener('click',e=>{if(e.target===wrap)close(false)});
    const msg=t=>{wrap.querySelector('#mMsg').textContent=t;wrap.querySelector('#mMsg').style.display='block'};
    const go=async()=>{
      const pin=wrap.querySelector('#mPin').value.trim();
      if(!CFG.API){msg('ยังไม่ได้เชื่อมฐานข้อมูล — ไปตั้งค่า URL ที่หน้าตั้งค่าระบบก่อน');return}
      if(!/^\d{4,10}$/.test(pin)){msg('กรอก PIN เป็นตัวเลข');return}
      wrap.querySelector('#mOk').disabled=true;
      try{
        const r=await jsonp(CFG.API,{action:'login',agency:wrap.querySelector('#mAg').value,pin});
        if(!r||!r.ok)throw new Error((r&&r.error)||'เข้าสู่ระบบไม่สำเร็จ');
        AUTH={token:r.token,code:r.agency.code,name:r.agency.name,role:r.agency.role,domains:r.agency.domains,
              exp:Date.now()+(r.expires_in||5400)*1000};
        try{sessionStorage.setItem('nblEcon.auth',JSON.stringify(AUTH))}catch(e){}
        close(true);
      }catch(err){msg(err.message);wrap.querySelector('#mOk').disabled=false}
    };
    wrap.querySelector('#mOk').onclick=go;
    wrap.querySelector('#mPin').addEventListener('keydown',e=>{if(e.key==='Enter')go()});
    setTimeout(()=>wrap.querySelector('#mPin').focus(),80);
  });
}
function authValid(){return AUTH&&AUTH.exp&&AUTH.exp>Date.now()}
function authLogout(){AUTH=null;try{sessionStorage.removeItem('nblEcon.auth')}catch(e){}
  if(EDIT)toggleEdit();}

async function toggleEdit(){
  if(!EDIT){
    if(!authValid()){AUTH=null;
      const ok=await authBox();
      if(!ok)return;}
  }
  EDIT=!EDIT;
  try{localStorage.setItem('nblEcon.editing',EDIT?'1':'0')}catch(e){}
  document.body.classList.toggle('editing',EDIT);
  const be=$('#btnEdit'); if(be)be.classList.toggle('on',EDIT);
  let bar=document.getElementById('edbar');
  if(EDIT&&!bar){
    bar=document.createElement('div');bar.id='edbar';bar.className='edbar';
    const scope=(AUTH.role==='admin'||myDomainList().indexOf('*')>=0)
      ? 'สิทธิ์ผู้ดูแลระบบ แก้ไขได้ทุกตาราง'
      : 'แก้ไขได้เฉพาะ '+myDomainList().map(d=>OWNER_NAME[d]||d).join(' · ');
    bar.innerHTML=`<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h4.5L19 9.5a2.1 2.1 0 0 0-3-3L5.5 17z"/></svg>
      <span><b>${AUTH.name||AUTH.code}</b> — ${scope} · คลิกที่ตัวเลขเพื่อแก้ไข กด Enter เพื่อบันทึก</span>
      <span class="sp"></span>
      <button class="tb" id="btnEdOut" style="height:26px;font-size:11px">ออกจากระบบ</button>
      <button class="tb" id="btnEdDone" style="height:26px;font-size:11px">เสร็จสิ้น</button>`;
    const m=document.querySelector('.main'); if(m)m.prepend(bar);
    const bo=document.getElementById('btnEdOut'); if(bo)bo.onclick=authLogout;
  }else if(!EDIT&&bar)bar.remove();
  applyEditMode();
}
function commitCell(td){
  if(!canEdit(tableOwner(td))){applyEditMode();return}
  const path=td.dataset.path,dec=+(td.dataset.dec||0);
  const raw=td.textContent.replace(/[, \s]/g,'').replace('—','');
  const v=raw===''?null:Number(raw);
  if(raw!==''&&isNaN(v)){alert('กรุณากรอกเป็นตัวเลข');return}
  const keys=path.split('.'),lastK=keys.pop();
  const obj=keys.reduce((o,k)=>o[/^\d+$/.test(k)?+k:k],D);
  obj[/^\d+$/.test(lastK)?+lastK:lastK]=v;
  saveEdits();
  safeRender();
  applyEditMode();
  const root=path.split('.')[0];
  if(TABLE_OWNER.hasOwnProperty(root))pushTable(root);
}

/* ─────────────── 20) live data ─────────────── */
function jsonp(url,p={}){return new Promise((res,rej)=>{
  const cb='cb_'+Math.random().toString(36).slice(2),sc=document.createElement('script');
  const to=setTimeout(()=>{cl();rej(new Error('หมดเวลาเชื่อมต่อ'))},15000);
  function cl(){clearTimeout(to);delete window[cb];sc.remove()}
  window[cb]=d=>{cl();res(d)};sc.onerror=()=>{cl();rej(new Error('เชื่อมต่อไม่ได้'))};
  sc.src=url+(url.includes('?')?'&':'?')+new URLSearchParams({...p,callback:cb});document.head.appendChild(sc)})}
const QMON={1:[1,2,3],2:[4,5,6],3:[7,8,9],4:[10,11,12]};
/* ใส่ค่าที่อนุมัติแล้วหนึ่งแถวลงชุดรายเดือน · รายไตรมาสกระจายลง 3 เดือน (ชุดแบบผลรวมหาร 3 ชุดแบบอัตรา/สะสมใช้ค่าเดิม) */
function applyLiveRow(row){
  const d=DATASETS.find(x=>x.id===row.domain), se=d&&d.series.find(x=>x.key===row.key);
  const arr=se&&DB[row.domain][row.key]; if(!arr)return false;
  const per=String(row.period||''), val=Number(row.value); if(!isFinite(val))return false;
  let keys=[],share=1; const q=per.match(/^(\d{4})-Q([1-4])$/);
  if(q){keys=QMON[q[2]].map(m=>q[1]+'-'+String(m).padStart(2,'0'));
    if((se.agg||(se.pct?'avg':'sum'))==='sum')share=1/3;}
  else if(/^\d{4}-\d{2}$/.test(per))keys=[per];
  else return false;
  const area=String(row.area||'PROV');
  if(area==='PROV'){let hit=false;
    keys.forEach(k=>{const t=arr.find(x=>x.key===k);if(t){t.v=+(val*share).toFixed(se.dec??4);t.sim=false;hit=true}});
    return hit;}
  if(DBD[row.domain]&&DBD[row.domain][row.key]){
    DBD[row.domain][row.key][area]=val;
    (DBD_REAL[row.domain+'|'+row.key]=DBD_REAL[row.domain+'|'+row.key]||{})[area]=true;return true}
  return false;
}
/* หน้าภาคส่วนที่ใช้ตารางจริง: รับค่าที่อนุมัติแล้วชุดเดียวกับที่กรอกทีละช่อง */
function applyLiveToPages(rows){
  let n=0;
  /* ท่องเที่ยว: รายเดือน → ปีงบประมาณ ต.ค.–ก.ย. */
  if(typeof DX!=='undefined'&&DX.tour){
    const MAP={visit:'visitor',rev:'revenue',occ:'occ'};
    rows.forEach(r=>{
      if(r.domain!=='tour'||!MAP[r.key]||String(r.area||'PROV')!=='PROV')return;
      const m=String(r.period).match(/^(\d{4})-(\d{2})$/); if(!m)return;
      const y=+m[1],mo=+m[2], fy=mo>=10?y+1:y, i=mo>=10?mo-9:mo+3;
      const list=DX.tour[MAP[r.key]]; if(!Array.isArray(list))return;
      const t=list.find(x=>x.fy===fy&&x.i===i);
      if(t)t.v=+r.value; else list.push({fy,i,label:TH_M[mo-1]+'-'+String(y).slice(-2),v:+r.value});
      n++;
    });
    ['visitor','revenue','occ'].forEach(k=>Array.isArray(DX.tour[k])&&DX.tour[k].sort((a,b)=>a.fy-b.fy||a.i-b.i));
  }
  /* แรงงาน: รายไตรมาส → ตารางภาวะการทำงาน */
  const LQ=D&&D.labor&&D.labor.quarters;
  if(Array.isArray(LQ)){
    const by={};
    rows.forEach(r=>{
      if(r.domain!=='labor'||['ue','ur','emp','force'].indexOf(r.key)<0||String(r.area||'PROV')!=='PROV')return;
      if(!/^\d{4}-Q[1-4]$/.test(r.period))return;
      (by[r.period]=by[r.period]||{})[r.key]=+r.value;
    });
    Object.keys(by).forEach(q=>{
      const v=by[q]; let t=LQ.find(x=>x.q===q);
      if(!t){
        if(v.force==null||v.emp==null)return;   /* แถวใหม่ต้องมีอย่างน้อยกำลังแรงงานและผู้มีงานทำ */
        t={q,y:+q.slice(0,4),n:+q.slice(-1),pop15:null,lfpr:null,notin:null};LQ.push(t);
      }
      Object.assign(t,v);
      if(v.ur==null&&t.force&&t.ue!=null)t.ur=+(t.ue/t.force*100).toFixed(2);
      n++;
    });
    LQ.sort((a,b)=>a.q<b.q?-1:1);
  }
  return n;
}
async function loadLive(){
  if(!CFG.API){LIVE.err=true;return}
  try{const r=await jsonp(CFG.API,{action:'series'});
    if(!r||!r.ok)throw 0;
    LIVE.ok=true;LIVE.at=r.updated||'';LIVE.rows=0;
    r.rows.forEach(row=>{if(applyLiveRow(row))LIVE.rows++});
    applyLiveToPages(r.rows);
    MEI=buildMei();safeRender();
  }catch(e){LIVE.err=true;try{trustBar()}catch(_){}}
}



/* ─────────────── 20b) ตารางรายละเอียด: ซิงก์กับ Google Sheet ─────────────── */
const TABLE_OWNER={fiscal:'spend',crop:'crop',fruit:'crop',water:'crop',base:'crop',price:'cpi',labor:'labor',
  otop:'otop',tour:'tour',pop:'popreg',pyr:'popreg',irrig:'irrig',house:'house',agri2:'crop',
  gpp:'spend',gppgrow:'spend',macro:'spend'};
let TBL_META={};
/* รวมตารางจากชีตทับค่าในไฟล์แบบรายหัวข้อ — หัวข้อที่ชีตยังไม่มีใช้ค่าจากไฟล์
   ตารางท่องเที่ยวรุ่นเก่าในชีตไม่มีประเภทแหล่ง (t) → คงรายการพิกัดชุดใหม่จากไฟล์ไว้ ไม่ให้พิกัดผิดชุดเดิมกลับมา */
function mergeRemote(k,local,remote){
  if(!remote||typeof remote!=='object'||Array.isArray(remote)||!local||typeof local!=='object'||Array.isArray(local))return remote;
  const out=Object.assign({},local,remote);
  if(k==='tour'&&Array.isArray(local.spots)&&(!Array.isArray(remote.spots)||!remote.spots.some(x=>x&&x.t)))out.spots=local.spots;
  return out;
}
async function loadTables(){
  if(!CFG.API)return;
  try{
    const r=await jsonp(CFG.API,{action:'tables'});
    if(!r||!r.ok||!r.tables)return;
    let n=0;
    Object.keys(r.tables).forEach(k=>{
      if(D[k]!==undefined){ D[k]=r.tables[k]; n++; }
      else if(typeof DX!=='undefined'&&DX[k]!==undefined){ DX[k]=mergeRemote(k,DX[k],r.tables[k]); n++; }
    });
    TBL_META=r.updated||{};
    /* ตารางปิรามิดเก็บเป็นแถวแบน ต้องแปลงกลับเข้าโครงสร้างที่หน้าประชากรใช้ */
    if(r.tables.pyr&&typeof pyrApplyRows==='function')pyrApplyRows(DX.pyr);
    if(n)safeRender();
  }catch(e){}
}
function toast(text,bad){
  let t=document.getElementById('toast');
  if(!t){t=document.createElement('div');t.id='toast';document.body.appendChild(t)}
  t.textContent=text;
  t.className='toast on'+(bad?' bad':'');
  clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('on'),3200);
}
async function pushTable(key){
  if(!CFG.API){toast('บันทึกในเครื่องนี้แล้ว — ยังไม่ได้เชื่อมฐานข้อมูลกลาง',true);return}
  const store=(D[key]!==undefined)?D:(typeof DX!=='undefined'&&DX[key]!==undefined?DX:null);
  if(!store){toast('ไม่รู้จักตาราง '+key,true);return}
  if(!authValid()){toast('เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่',true);return}
  try{
    const res=await fetch(CFG.API,{method:'POST',
      headers:{'Content-Type':'text/plain;charset=utf-8'},
      body:JSON.stringify({action:'savetable',token:AUTH.token,key:key,json:JSON.stringify(store[key])})});
    const r=await res.json();
    if(!r.ok)throw new Error(r.error||'บันทึกไม่สำเร็จ');
    toast('บันทึกขึ้นฐานข้อมูลกลางแล้ว ทุกคนเห็นตรงกัน');
  }catch(e){
    toast('บันทึกขึ้นฐานข้อมูลกลางไม่สำเร็จ ('+e.message+') เก็บไว้ในเครื่องนี้แล้ว',true);
  }
}

/* ─────────────── 23) Tooltip กราฟแบบการ์ดลอย ─────────────── */
function chartTipEl(){
  let el=document.getElementById('chtip');
  if(!el){el=document.createElement('div');el.id='chtip';document.body.appendChild(el)}
  return el;
}
/* สร้างข้อความ tooltip แบบมีโครงสร้าง — ใช้กับทุกตัวชี้วัด
   t=ชื่อ · d=ความหมาย · calc=วิธีคำนวณ · src=หน่วยงานเจ้าของข้อมูล (คีย์ใน AGENCY_FULL หรือข้อความ) · when=งวดข้อมูล */
function tipOf(o){
  const ag=(typeof AGENCY_FULL!=='undefined'&&AGENCY_FULL[o.src])?AGENCY_FULL[o.src]:null;
  const src=ag?(ag.n+(ag.doc?' · '+ag.doc:'')):(o.src||'');
  return [o.t||'', o.d||'', o.calc?('วิธีคำนวณ: '+o.calc):'', src?('ที่มา: '+src):'', o.when?('งวดข้อมูล: '+o.when):'']
    .filter(Boolean).join('|').replace(/"/g,'&#34;');
}
function agencyName(k){const a=AGENCY_FULL[k];return a?a.n:k}

function externalTip(ctx){
  const el=chartTipEl(), tt=ctx.tooltip;
  if(!tt||tt.opacity===0){el.classList.remove('on');return}
  const title=(tt.title||[]).join(' ');
  const colors=tt.labelColors||[];
  const lines=(tt.body||[]).map(b=>b.lines).flat();
  let html=title?`<div class="cht-t">${title}</div>`:'';
  html+=lines.map((raw,i)=>{
    const c=colors[i]||{};
    const col=c.backgroundColor||c.borderColor||'var(--brand)';
    const str=String(raw);
    const k=str.lastIndexOf(':');
    if(k>0){
      const lab=str.slice(0,k).trim(), val=str.slice(k+1).trim();
      return `<div class="cht-r"><i style="background:${col}"></i><span class="cht-l">${lab}</span><b class="cht-v">${val}</b></div>`;
    }
    return `<div class="cht-r"><i style="background:${col}"></i><b class="cht-v" style="margin-left:0">${str}</b></div>`;
  }).join('');
  const foot=(tt.footer||[]).join(' ');
  if(foot)html+=`<div class="cht-f">${foot}</div>`;
  el.innerHTML=html;
  el.classList.add('on');
  const r=ctx.chart.canvas.getBoundingClientRect();
  const w=el.offsetWidth,h=el.offsetHeight;
  let x=r.left+tt.caretX+16, y=r.top+tt.caretY-h/2;
  if(x+w>innerWidth-10)x=r.left+tt.caretX-w-16;
  if(x<8)x=8;
  if(y<8)y=8;
  if(y+h>innerHeight-8)y=innerHeight-h-8;
  el.style.left=x+'px'; el.style.top=y+'px';
}

/* ─────────────── 24) ตัวเลขวิ่งขึ้นตอนเปิดหน้า ─────────────── */
function animateNums(root){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  (root||document).querySelectorAll('.kpi .v, .cvst b, .pil b, .meibox .big, .big2').forEach(el=>{
    if(el.dataset.anim)return;
    const small=el.querySelector('small');
    const raw=(small?el.childNodes[0]&&el.childNodes[0].textContent:el.textContent)||'';
    const txt=raw.trim();
    const m=txt.match(/^-?[\d,]+(\.\d+)?%?$/);
    if(!m)return;
    const pct=txt.endsWith('%');
    const num=parseFloat(txt.replace(/[,%]/g,''));
    if(!isFinite(num)||Math.abs(num)<1)return;
    const dec=(txt.split('.')[1]||'').replace('%','').length;
    el.dataset.anim='1';
    const t0=performance.now(), dur=Math.min(900,420+Math.log10(Math.abs(num)+1)*180);
    const write=v=>{
      const out=v.toLocaleString('th-TH',{minimumFractionDigits:dec,maximumFractionDigits:dec})+(pct?'%':'');
      if(small)el.childNodes[0].textContent=out; else el.textContent=out;
    };
    const step=now=>{
      const p=Math.min(1,(now-t0)/dur);
      const e=1-Math.pow(1-p,3);
      write(num*e);
      if(p<1)requestAnimationFrame(step); else write(num);
    };
    requestAnimationFrame(step);
  });
}

/* ─────────────── 25) การ์ดค่อย ๆ ปรากฏ ─────────────── */
function revealCards(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const els=[...document.querySelectorAll('.main .c, .main .kpi, .main .sect, .main .gau, .main .pcard, .main .fruit')];
  els.slice(0,40).forEach((el,i)=>{
    if(el.dataset.rev)return;
    el.dataset.rev='1';
    el.style.animation=`riseIn .42s cubic-bezier(.22,.7,.3,1) ${Math.min(i*28,420)}ms both`;
  });
}


/* ─────────────── 26) ปุ่มกลับขึ้นบน ─────────────── */
function initToTop(){
  if(document.getElementById('toTop'))return;
  const b=document.createElement('button');
  b.id='toTop';b.className='totop';b.setAttribute('aria-label','กลับขึ้นบน');
  b.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  document.body.appendChild(b);
  const sc=document.querySelector('.main');
  const target=sc||window;
  b.onclick=()=>{(sc||window).scrollTo({top:0,behavior:'smooth'})};
  const onScroll=()=>{
    const y=sc?sc.scrollTop:window.scrollY;
    b.classList.toggle('on',y>320);
  };
  target.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('scroll',onScroll,{passive:true});
}


/* ─────────────── 27) แบนเนอร์ภาพหัวหน้า (ใส่ไฟล์เมื่อไรก็ขึ้นเอง) ─────────────── */
function bannerInto(target,src,title,sub,place){
  if(!target)return;
  if(target.querySelector(':scope > .pgbanner')||target.dataset.bnr==='wait')return;
  /* กันแบนเนอร์ซ้อน: safeRender ถูกเรียกหลายรอบ (โหลดข้อมูลจริง/ตาราง) ก่อนรูปโหลดเสร็จ */
  target.dataset.bnr='wait';
  const img=new Image();
  img.onerror=()=>{delete target.dataset.bnr};
  img.onload=()=>{
    delete target.dataset.bnr;
    if(target.querySelector(':scope > .pgbanner'))return;
    const d=document.createElement('div');
    d.className='pgbanner';
    d.style.backgroundImage=`url('${src}')`;
    d.innerHTML=`<div class="pgb-in"><b>${title}</b>${sub?`<span>${sub}</span>`:''}</div>`;
    if(place==='append')target.appendChild(d); else target.prepend(d);
  };
  img.src=src;
}
function pageBanner(){
  if(['cover','report','settings'].indexOf(PAGE.id)>=0)return;
  const v=document.querySelector('.view.on'); if(!v)return;
  const n=NAVI.find(x=>x.id===PAGE.id); if(!n)return;
  bannerInto(v,'assets/h-'+PAGE.id+'.jpg',n.label,'ศูนย์บัญชาการข้อมูลเศรษฐกิจ จังหวัดหนองบัวลำภู');
}


/* ─────────────── 27b) ตราสถานะเศรษฐกิจ ─────────────── */
/* ใช้เกณฑ์เดียวกันทุกตัวชี้วัด: เทียบกับงวดเดียวกันปีก่อน */
function statusOf(pct,invert){
  if(pct==null||isNaN(pct))return {k:'normal',t:'ไม่มีข้อมูลเทียบ',c:'--faint'};
  const v=invert?-pct:pct;
  if(v>=3)  return {k:'good',  t:'ดี',     c:'--good'};
  if(v<=-3) return {k:'bad',   t:'ต้องเฝ้าระวัง',c:'--bad'};
  return             {k:'normal',t:'ทรงตัว', c:'--warn'};
}
function statusBadge(pct,invert,label){
  const st=statusOf(pct,invert);
  return `<span class="stbadge ${st.k}" data-tip2="สถานะ ${st.t}|${label||'เทียบกับงวดเดียวกันปีก่อน'}${pct==null?'':' · เปลี่ยนแปลง '+(pct>0?'+':'')+pct.toFixed(1)+'%'}|เกณฑ์: เกิน +3% = ดี · -3% ถึง +3% = ทรงตัว · ต่ำกว่า -3% = ต้องเฝ้าระวัง">
    <img src="assets/icons/ic-${st.k}.png" alt="" width="20" height="20" onerror="this.remove()">
    <b style="color:var(${st.c})">${st.t}</b></span>`;
}

/* ─────────────── 28) แหล่งที่มา · ชื่อเต็มหน่วยงาน ─────────────── */
const AGENCY_FULL={
  spend  :{n:'สำนักงานคลังจังหวัดหนองบัวลำภู',dept:'กรมบัญชีกลาง กระทรวงการคลัง',tel:'0 4231 2410 ต่อ 26921-26',doc:'รายงานผลการเบิกจ่ายและใช้จ่ายเงินงบประมาณ'},
  crop   :{n:'สำนักงานเกษตรจังหวัดหนองบัวลำภู',dept:'กรมส่งเสริมการเกษตร กระทรวงเกษตรและสหกรณ์',tel:'0 4231 3301',doc:'รายงานข้อมูลภาวะการผลิตพืช'},
  factory:{n:'สำนักงานอุตสาหกรรมจังหวัดหนองบัวลำภู',dept:'สำนักงานปลัดกระทรวงอุตสาหกรรม กระทรวงอุตสาหกรรม',tel:'',doc:'ทะเบียนโรงงานอุตสาหกรรม'},
  power  :{n:'การไฟฟ้าส่วนภูมิภาคจังหวัดหนองบัวลำภู',dept:'การไฟฟ้าส่วนภูมิภาค กระทรวงมหาดไทย',tel:'',doc:'สถิติการจำหน่ายกระแสไฟฟ้าแยกประเภทผู้ใช้'},
  cpi    :{n:'สำนักงานพาณิชย์จังหวัดหนองบัวลำภู',dept:'สำนักงานปลัดกระทรวงพาณิชย์ กระทรวงพาณิชย์',tel:'0 4231 2018',doc:'รายงานสถานการณ์ราคาสินค้าเกษตรที่สำคัญและสินค้าอุปโภคบริโภค'},
  credit :{n:'ธนาคารพัฒนาวิสาหกิจขนาดกลางและขนาดย่อมแห่งประเทศไทย',dept:'สาขาหนองบัวลำภู',tel:'',doc:'รายงานการอนุมัติสินเชื่อเพื่อการลงทุน'},
  fuel   :{n:'สำนักงานพลังงานจังหวัดหนองบัวลำภู',dept:'สำนักงานปลัดกระทรวงพลังงาน กระทรวงพลังงาน',tel:'',doc:'รายงานปริมาณการใช้น้ำมันเชื้อเพลิงรายจังหวัด'},
  car    :{n:'สำนักงานขนส่งจังหวัดหนองบัวลำภู',dept:'กรมการขนส่งทางบก กระทรวงคมนาคม',tel:'',doc:'สถิติการจดทะเบียนรถใหม่'},
  labor  :{n:'สำนักงานสถิติจังหวัดหนองบัวลำภู',dept:'สำนักงานสถิติแห่งชาติ กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม · ร่วมกับ สำนักงานแรงงานจังหวัดหนองบัวลำภู',tel:'0 4231 6736',doc:'การสำรวจภาวะการทำงานของประชากร (Labor Force Survey) รายไตรมาส'},
  social :{n:'สำนักงานประกันสังคมจังหวัดหนองบัวลำภู',dept:'สำนักงานประกันสังคม กระทรวงแรงงาน',tel:'',doc:'สถิติผู้ประกันตนจำแนกตามมาตรา'},
  tour   :{n:'สำนักงานการท่องเที่ยวและกีฬาจังหวัดหนองบัวลำภู',dept:'สำนักงานปลัดกระทรวงการท่องเที่ยวและกีฬา',tel:'',doc:'สถิติผู้เยี่ยมเยือนและรายได้จากการท่องเที่ยว'},
  popreg2:{n:'ที่ทำการปกครองจังหวัดหนองบัวลำภู',dept:'กรมการปกครอง กระทรวงมหาดไทย',tel:'',doc:'ข้อมูลทะเบียนราษฎร'},
  otop   :{n:'สำนักงานพัฒนาชุมชนจังหวัดหนองบัวลำภู',dept:'กรมการพัฒนาชุมชน กระทรวงมหาดไทย',tel:'',doc:'ข้อมูลผู้ประกอบการ ผลิตภัณฑ์ และรายได้จากผลิตภัณฑ์ OTOP'},
  popreg :{n:'ที่ทำการปกครองจังหวัดหนองบัวลำภู',dept:'กรมการปกครอง กระทรวงมหาดไทย',tel:'',doc:'ข้อมูลทะเบียนราษฎร จำนวนประชากร การเกิด การตาย และการย้ายถิ่น'},
  irrig  :{n:'โครงการชลประทานหนองบัวลำภู',dept:'สำนักงานชลประทานที่ 5 กรมชลประทาน กระทรวงเกษตรและสหกรณ์',tel:'',doc:'ข้อมูลแหล่งน้ำชลประทาน พื้นที่รับประโยชน์ และสถานีสูบน้ำด้วยไฟฟ้า'},
  house  :{n:'สำนักงานสถิติจังหวัดหนองบัวลำภู',dept:'สำนักงานสถิติแห่งชาติ กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม',tel:'0 4231 6736',doc:'โครงการสำรวจภาวะเศรษฐกิจและสังคมของครัวเรือน (Household Socio-Economic Survey)'},
  gpp    :{n:'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ',dept:'',tel:'',doc:'ผลิตภัณฑ์มวลรวมจังหวัด (GPP) แบบปริมาณลูกโซ่'}
};
function srcBar(keys,extra){
  const list=(Array.isArray(keys)?keys:[keys]).map(k=>AGENCY_FULL[k]).filter(Boolean);
  if(!list.length)return '';
  return `<div class="srcbar">
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 5.5A2 2 0 0 1 6 3.5h9l5 5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14.5 3.6V9h5.2"/></svg>
    <div>${list.map(a=>`<div class="src1"><b>${a.n}</b>${a.dept?` · ${a.dept}`:''}
      ${a.doc?`<span>ที่มา: ${a.doc}</span>`:''}${a.tel?`<span>โทร ${a.tel}</span>`:''}</div>`).join('')}
    ${extra?`<div class="src1"><span>${extra}</span></div>`:''}</div></div>`;
}

/* ─────────────── 29) ปุ่มสลับกราฟ / ตารางรายละเอียด ─────────────── */
function viewToggle(id,labelChart,labelTable){
  return `<span class="segs vt" data-vt="${id}">
    <button class="on" data-v="chart">${labelChart||'กราฟ'}</button>
    <button data-v="table">${labelTable||'ตารางข้อมูล'}</button></span>`;
}
function bindToggle(){
  document.querySelectorAll('.segs.vt').forEach(w=>{
    if(w.dataset.bound)return; w.dataset.bound='1';
    w.addEventListener('click',e=>{
      const b=e.target.closest('button'); if(!b)return;
      w.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
      const id=w.dataset.vt, v=b.dataset.v;
      const c=document.getElementById(id+'-chart'), t=document.getElementById(id+'-table');
      if(c)c.classList.toggle('hide',v!=='chart');
      if(t)t.classList.toggle('hide',v!=='table');
      if(v==='chart'&&CH[id])setTimeout(()=>{try{CH[id].resize()}catch(e){}},30);
    });
  });
}


/* ─────────────── 30) ตัวกรองเวลาแบบใช้ร่วมทุกหน้า ─────────────── */
const SLC={};   /* เก็บสถานะของแต่ละตัวกรอง */
const FQ_LABEL={M:'รายเดือน',Q:'รายไตรมาส',Y:'รายปี'};

/* สร้างรายการงวดจากชุดข้อมูลรายเดือน 36 เดือน */
function periodsOf(freq){
  if(freq==='M')return MONTHS.map((m,i)=>({k:'M'+i,label:TH_M[m.m-1]+' '+m.y,short:m.label,i}));
  if(freq==='Q'){
    const out=[];
    MONTHS.forEach((m,i)=>{
      const q=Math.ceil(m.m/3), k='Q'+m.y+'-'+q;
      let e=out.find(x=>x.k===k);
      if(!e){e={k,label:'ไตรมาส '+q+'/'+m.y,short:'Q'+q+'/'+String(m.y).slice(-2),idx:[]};out.push(e)}
      e.idx.push(i);
    });
    return out.map(x=>Object.assign(x,{i:x.idx[x.idx.length-1]}));
  }
  const ys=[...new Set(MONTHS.map(m=>m.y))];
  return ys.map(y=>{const idx=MONTHS.map((m,i)=>m.y===y?i:-1).filter(i=>i>=0);
    return {k:'Y'+y,label:'ปี '+y,short:'ปี '+y,i:idx[idx.length-1],idx}});
}

/**
 * สร้างแถบตัวกรองเวลา
 * cfg: {freqs:['M','Q','Y'], freq:'M', value:'M35', label:'งวดข้อมูล', compare:true, fy:false}
 */
function slicerBar(id,cfg){
  cfg=Object.assign({freqs:['M','Q','Y'],freq:'M',compare:true,label:'งวดข้อมูล'},cfg||{});
  if(!SLC[id])SLC[id]=cfg; else cfg=SLC[id];
  const ps=periodsOf(cfg.freq);
  if(!cfg.value||!ps.find(p=>p.k===cfg.value))cfg.value=ps[ps.length-1].k;
  const cur=ps.find(p=>p.k===cfg.value), ci=ps.indexOf(cur);
  return `<div class="slicer" data-slicer="${id}">
    <span class="sl-lab"><img class="slico" src="assets/icons/ic-filter.png" alt="" onerror="this.remove()">${cfg.label}</span>
    ${cfg.freqs.length>1?`<span class="sl-seg">${cfg.freqs.map(f=>
      `<button data-fq="${f}" class="${f===cfg.freq?'on':''}">${FQ_LABEL[f]}</button>`).join('')}</span>`:''}
    <span class="sl-nav">
      <button data-step="-1" ${ci<=0?'disabled':''} aria-label="ก่อนหน้า">
        <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <select data-pick>${ps.map(p=>`<option value="${p.k}"${p.k===cfg.value?' selected':''}>${p.label}</option>`).join('')}</select>
      <button data-step="1" ${ci>=ps.length-1?'disabled':''} aria-label="ถัดไป">
        <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </span>
    <button class="sl-now${ci===ps.length-1?' on':''}" data-now>ล่าสุด</button>
    ${cfg.compare?`<button class="sl-cmp${cfg.cmp?' on':''}" data-cmp>
      <img class="slico" src="assets/icons/ic-compare.png" alt="" onerror="this.remove()">เทียบปีก่อน</button>`:''}
    <span class="sl-info" id="${id}-info"></span>
  </div>`;
}
function slicerState(id){
  const cfg=SLC[id]; if(!cfg)return null;
  const ps=periodsOf(cfg.freq);
  const cur=ps.find(p=>p.k===cfg.value)||ps[ps.length-1];
  return {freq:cfg.freq,key:cur.k,label:cur.label,i:cur.i,idx:cur.idx||[cur.i],cmp:!!cfg.cmp,periods:ps};
}
/* ค่าของชุดข้อมูลตามงวดที่เลือก — รายเดือนใช้ค่าเดือนนั้น รายไตรมาส/ปีใช้ผลรวมหรือค่าเฉลี่ย */
/* mode: sum=ยอดไหลรวมกันได้ · avg=อัตราหรือดัชนีใช้ค่าเฉลี่ย · last=ค่าสะสมหรือค่าสต๊อก ใช้ค่าสิ้นงวด */
function aggVals(vals,mode){
  if(!vals.length)return null;
  if(mode==='last')return vals[vals.length-1];
  if(mode==='avg')return vals.reduce((a,b)=>a+b,0)/vals.length;
  return vals.reduce((a,b)=>a+b,0);
}
function seriesAt(arr,st,mode){
  simTouch(arr,st?(st.idx||[st.i]):null);
  if(!st)return arr[arr.length-1].v;
  const idx=st.idx||[st.i];
  const vals=idx.map(i=>arr[i]&&arr[i].v).filter(v=>v!=null);
  if(st.freq==='M')return vals.length?vals[vals.length-1]:null;
  return aggVals(vals,mode);
}
function seriesPrevYear(arr,st,mode){
  if(!st)return null;
  const idx=(st.idx||[st.i]).map(i=>i-12).filter(i=>i>=0);
  if(!idx.length)return null;
  const vals=idx.map(i=>arr[i]&&arr[i].v).filter(v=>v!=null);
  if(!vals.length)return null;
  if(st.freq==='M')return vals[vals.length-1];
  return aggVals(vals,mode);
}
/* ─────────────── 30ข) แถบเลือกปี — ใช้กับหน้าที่ข้อมูลเป็นรายปี ─────────────── */
/* cfg: {years:[...], value, selId:'otopYear', label:'เลือกปีข้อมูล', note:'...'} */
function yearBar(id,cfg){
  const ys=(cfg.years||[]).slice().sort((a,b)=>a-b);
  const cur=cfg.value!=null?cfg.value:ys[ys.length-1];
  const i=ys.indexOf(cur);
  const desc=ys.slice().reverse();
  return `<div class="slicer yearbar" data-yearbar="${id}" data-sel="${cfg.selId}">
    <span class="sl-lab"><img class="slico" src="assets/icons/ic-filter.png" alt="" onerror="this.remove()">${cfg.label||'เลือกปีข้อมูล'}</span>
    <span class="sl-nav">
      <button data-ystep="-1" ${i<=0?'disabled':''} aria-label="ปีก่อนหน้า">
        <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg></button>
      <select class="sel" id="${cfg.selId}">${desc.map(y=>
        `<option value="${y}"${y===cur?' selected':''}>ปี ${y}${(cfg.partial||[]).indexOf(y)>=0?' · ข้อมูลไม่ครบ':''}</option>`).join('')}</select>
      <button data-ystep="1" ${i>=ys.length-1?'disabled':''} aria-label="ปีถัดไป">
        <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg></button>
    </span>
    <button class="sl-now${i===ys.length-1?' on':''}" data-ynow>ปีล่าสุด</button>
    <span class="sl-info">${cfg.note||('ข้อมูลชุดนี้ประกาศปีละครั้ง จึงเลือกดูได้เป็นรายปี ย้อนหลังถึงปี '+ys[0])}</span>
  </div>`;
}
/* ปุ่มถอย/เดินหน้า/ปีล่าสุด สั่งงานผ่าน select เดิม จึงใช้ตัวจัดการเหตุการณ์ของหน้านั้นได้เลย
   ผูกที่ document ครั้งเดียว แถบจึงยังทำงานหลังหน้าวาดใหม่ */
document.addEventListener('click',function(e){
  const bar=e.target.closest('[data-yearbar]'); if(!bar)return;
  const st=e.target.closest('[data-ystep]'), nw=e.target.closest('[data-ynow]');
  if(!st&&!nw)return;
  const sel=document.getElementById(bar.dataset.sel); if(!sel)return;
  const opts=[...sel.options].map(o=>o.value);   /* เรียงจากปีใหม่ไปเก่า */
  let i=opts.indexOf(sel.value);
  if(st)i=i-(+st.dataset.ystep);
  else i=0;
  if(i<0||i>=opts.length)return;
  sel.value=opts[i];
  sel.dispatchEvent(new Event('change',{bubbles:true}));
});
function bindYearBar(){}
/* ผูกการเปลี่ยนปีที่ document ครั้งเดียว จึงไม่หลุดเมื่อหน้าถูกวาดใหม่ */
const YEAR_HOOK={};
document.addEventListener('change',function(e){
  const el=e.target;
  if(!el||!el.id||!YEAR_HOOK[el.id])return;
  YEAR_HOOK[el.id](el.value);
});
function onYearChange(selId,fn){YEAR_HOOK[selId]=fn}

/* วาดตัวควบคุมภายในแถบตัวกรองใหม่ โดยไม่แตะตัวแถบเอง จึงไม่เสียการผูกเหตุการณ์ */
function redrawSlicer(id){
  const el=document.querySelector('[data-slicer="'+id+'"]'); if(!el)return;
  const tmp=document.createElement('div');
  tmp.innerHTML=slicerBar(id,SLC[id]);
  const fresh=tmp.firstElementChild; if(!fresh)return;
  el.innerHTML=fresh.innerHTML;
}
function bindSlicers(onChange){
  document.querySelectorAll('[data-slicer]').forEach(el=>{
    if(el.dataset.bound)return; el.dataset.bound='1';
    const id=el.dataset.slicer;
    el.addEventListener('click',e=>{
      const fq=e.target.closest('[data-fq]');
      const st=e.target.closest('[data-step]');
      const nw=e.target.closest('[data-now]');
      const cp=e.target.closest('[data-cmp]');
      const c=SLC[id]; if(!c)return;
      if(fq){c.freq=fq.dataset.fq;c.value=null}
      else if(st){const ps=periodsOf(c.freq);
        if(!c.value||!ps.find(p=>p.k===c.value))c.value=ps[ps.length-1].k;
        const i=ps.findIndex(p=>p.k===c.value);
        const n=ps[i+ +st.dataset.step]; if(n)c.value=n.k; else return}
      else if(nw){const ps=periodsOf(c.freq);c.value=ps[ps.length-1].k}
      else if(cp){c.cmp=!c.cmp}
      else return;
      redrawSlicer(id);
      onChange&&onChange(id);
    });
    el.addEventListener('change',e=>{
      if(!e.target.matches('[data-pick]'))return;
      SLC[id].value=e.target.value;
      redrawSlicer(id);
      onChange&&onChange(id);
    });
  });
}


/* ─────────────── 31) แผนที่เชิงบริการ — ป๊อปอัปพร้อมนำทาง ─────────────── */
const GMAP=(lat,lng,name)=>`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`+
  (name?('&query_place_id='):'')
const ICO_NAV='<svg viewBox="0 0 24 24"><path d="M3 11.5 21 3l-8.5 18-2-7.5z"/></svg>';
const ICO_PIN='<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/></svg>';
const ICO_COPY='<svg viewBox="0 0 24 24"><rect x="8.5" y="8.5" width="12" height="12" rx="2"/><path d="M4.5 15.5v-9a2 2 0 0 1 2-2h9"/></svg>';
/**
 * สร้างป๊อปอัปแบบบริการ ใช้ได้กับทุกจุดที่มีพิกัด
 * o: {name, sub, rows:[[label,value]], lat, lng, nearby:'คำค้นบริการใกล้เคียง'}
 */
function servicePopup(o){
  const q=`${o.lat},${o.lng}`;
  const nav=`https://www.google.com/maps/dir/?api=1&destination=${q}&travelmode=driving`;
  const view=`https://www.google.com/maps/search/?api=1&query=${q}`;
  const near=o.nearby?`https://www.google.com/maps/search/${encodeURIComponent(o.nearby)}/@${o.lat},${o.lng},15z`:'';
  const sv=`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${q}`;
  return `<div class="pop">
    <div class="ph2"><b>${o.name}</b>${o.sub?`<span>${o.sub}</span>`:''}</div>
    <div class="pb">
      ${(o.rows||[]).map(r=>`<div class="prow"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}
      ${o.km!=null?`<div class="prow"><span>ระยะจากตำแหน่งท่าน</span><b>${o.km.toFixed(1)} กม. · ราว ${driveMin(o.km)} นาที</b></div>`:''}
      <div class="prow"><span>พิกัด</span><b>${(+o.lat).toFixed(5)}, ${(+o.lng).toFixed(5)}</b></div>
      <div class="pact">
        <a class="go" href="${nav}" target="_blank" rel="noopener">${ICO_NAV}นำทาง</a>
        <a href="${view}" target="_blank" rel="noopener">${ICO_PIN}เปิดแผนที่</a>
        <button onclick="navigator.clipboard&&navigator.clipboard.writeText('${q}');this.textContent='คัดลอกแล้ว'">${ICO_COPY}พิกัด</button>
      </div>
      <div class="pact" style="margin-top:6px">
        ${near?`<a href="${near}" target="_blank" rel="noopener">${ICO_PIN}${o.nearby}ใกล้ที่นี่</a>`:''}
        <a href="${sv}" target="_blank" rel="noopener">${ICO_PIN}ดูภาพถนน</a>
      </div>
    </div></div>`;
}


/* ─────────────── 32) เครื่องมือแผนที่ฟรี — ไม่ต้องใช้ API key ─────────────── */
const BASEMAPS={
  plain :{n:'เรียบ',   url:null},
  street:{n:'ถนน',     url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
          max:19,att:'แผนที่ © Esri'},
  sat   :{n:'ดาวเทียม',url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          max:19,att:'ภาพดาวเทียม © Esri, Maxar, Earthstar Geographics',
          over:['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}',
                'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}']},
  topo  :{n:'ภูมิประเทศ',url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
          max:19,att:'แผนที่ © Esri'}
};
/* สไตล์ขอบเขตอำเภอตามพื้นหลัง — บนภาพจริงต้องโปร่ง ไม่อย่างนั้นสีเขียวอ่อนจะทับจนดูไม่ออก */
function geoStyleFor(k,base){
  base=base||{};
  if(k==='plain')return Object.assign({color:'#fff',weight:2,fillColor:'#cfe9dc',fillOpacity:.85},base.plain||{});
  if(k==='sat')  return {color:'#ffe066',weight:2.4,dashArray:'',fillOpacity:0};
  return {color:'#0b7a55',weight:2.2,dashArray:'6 4',fillOpacity:0};
}
function baseSwitcher(id){
  return `<div class="basesw" data-base="${id}">${Object.entries(BASEMAPS).map(([k,v],i)=>
    `<button data-bm="${k}" class="${i===0?'on':''}">${v.n}</button>`).join('')}</div>`;
}
function applyBase(map,state,k){
  const cfg=BASEMAPS[k]||BASEMAPS.plain;
  if(state.layer){map.removeLayer(state.layer);state.layer=null}
  state.key=k;
  if(cfg.url){
    const ls=[L.tileLayer(cfg.url,{maxZoom:cfg.max||18,maxNativeZoom:17,subdomains:cfg.sub||'abc',attribution:cfg.att||''})]
      .concat((cfg.over||[]).map(u=>L.tileLayer(u,{maxZoom:cfg.max||18,maxNativeZoom:17,opacity:.95})));
    state.layer=L.layerGroup(ls).addTo(map);
    ls.forEach(l=>l.bringToBack&&l.bringToBack());
    ls[0].bringToBack();
    if(!map.attributionControl){map.attributionControl=L.control.attribution({prefix:false,position:'bottomright'}).addTo(map)}
  }
  const el=map.getContainer();
  el.classList.toggle('bm-plain',k==='plain');el.classList.toggle('bm-sat',k==='sat');
  if(state.onChange)state.onChange(k);
}
function bindBase(id,map,state){
  const el=document.querySelector(`[data-base="${id}"]`); if(!el)return;
  state.map=map;
  if(state.key&&state.key!=='plain')applyBase(map,state,state.key);
  el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x.dataset.bm===(state.key||'plain')));
  if(el.dataset.b)return;
  el.dataset.b='1';
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-bm]'); if(!b||!state.map)return;
    el.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));
    applyBase(state.map,state,b.dataset.bm);
  });
}
/* ระยะทางเส้นตรงแบบ Haversine (กิโลเมตร) */
function distKm(a,b,c,d){
  const R=6371,r=Math.PI/180;
  const dLa=(c-a)*r,dLo=(d-b)*r;
  const h=Math.sin(dLa/2)**2+Math.cos(a*r)*Math.cos(c*r)*Math.sin(dLo/2)**2;
  return 2*R*Math.asin(Math.sqrt(h));
}
function driveMin(km){return Math.round(km/45*60*1.25)}   /* ถนนต่างจังหวัด เฉลี่ย 45 กม./ชม. บวกตัวคูณเส้นทางจริง */
/* ขอตำแหน่งผู้ใช้จากเบราว์เซอร์ ฟรีและไม่ต้องใช้คีย์ */
function askLocation(){
  return new Promise((res,rej)=>{
    if(!navigator.geolocation)return rej(new Error('เบราว์เซอร์นี้ไม่รองรับการระบุตำแหน่ง'));
    navigator.geolocation.getCurrentPosition(
      p=>res({lat:p.coords.latitude,lng:p.coords.longitude,acc:p.coords.accuracy}),
      e=>rej(new Error(e.code===1?'ท่านปฏิเสธการเข้าถึงตำแหน่ง':'ระบุตำแหน่งไม่สำเร็จ')),
      {enableHighAccuracy:true,timeout:12000,maximumAge:60000});
  });
}
function fullscreenBtn(targetSel){
  return `<button class="tb fsbtn" data-fs="${targetSel}">
    <svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>เต็มจอ</button>`;
}
document.addEventListener('click',e=>{
  const b=e.target.closest('[data-fs]'); if(!b)return;
  const el=document.querySelector(b.dataset.fs); if(!el)return;
  if(document.fullscreenElement)document.exitFullscreen();
  else if(el.requestFullscreen)el.requestFullscreen();
});


/* ─────────────── 33) ตัวเล่นอัตโนมัติ — เลื่อนตามปี หยุดเมื่อชี้เมาส์ ─────────────── */
const PLAYERS={};
/**
 * cfg: {frames:[...], i:0, ms:1600, onFrame(v,i), hoverStop:'#selector'}
 * คืน HTML ของแถบควบคุม แล้วเรียก bindPlayer(id) หลังใส่ลง DOM
 */
function playerBar(id,cfg){
  const old=PLAYERS[id]||{};
  PLAYERS[id]=Object.assign({i:0,ms:1600,playing:false},old,cfg,
    {frames:cfg.frames,onFrame:cfg.onFrame,timer:old.timer,paused:old.paused});
  if(old.i!=null&&cfg.keepIndex!==false)PLAYERS[id].i=old.i;
  const p=PLAYERS[id];
  return `<div class="player" data-player="${id}">
    <button class="pl-btn" data-pl="play" title="เล่นอัตโนมัติ">
      <svg viewBox="0 0 24 24" class="ic-play"><path d="M7 4.5 19 12 7 19.5z"/></svg>
      <svg viewBox="0 0 24 24" class="ic-pause"><path d="M8 4.5h3.4v15H8zM12.6 4.5H16v15h-3.4z"/></svg>
      <span class="pl-txt">เล่นอัตโนมัติ</span></button>
    <span class="pl-track">
      ${p.frames.map((fr,i)=>`<button class="pl-dot${i===p.i?' on':''}" data-plf="${i}" title="${fr.label||fr}">
        <span>${fr.short||fr.label||fr}</span></button>`).join('')}
    </span>
    <span class="pl-now" id="${id}-now"></span>
  </div>`;
}
/* noInit=true → ตั้งสถานะให้ถูกต้องโดยไม่เรียก onFrame (ใช้เมื่อหน้าถูกวาดใหม่ทั้งหน้า) */
function bindPlayer(id,noInit){
  const el=document.querySelector(`[data-player="${id}"]`); if(!el||el.dataset.b)return;
  el.dataset.b='1';
  const p=PLAYERS[id];
  const step=()=>{ p.i=(p.i+1)%p.frames.length; apply(); };
  const apply=()=>{
    el.querySelectorAll('[data-plf]').forEach((d,i)=>d.classList.toggle('on',i===p.i));
    const now=document.getElementById(id+'-now');
    const fr=p.frames[p.i];
    if(now)now.textContent=fr.label||fr;
    p.onFrame(fr,p.i);
  };
  const play=()=>{ if(p.timer)return; p.playing=true; el.classList.add('playing');
    p.timer=setInterval(()=>{ if(!p.paused){ const q=PLAYERS[id]; q.i=(q.i+1)%q.frames.length; q.onFrame(q.frames[q.i],q.i); } },p.ms); };
  const stop=()=>{ clearInterval(p.timer); p.timer=null; p.playing=false; el.classList.remove('playing'); };
  el.addEventListener('click',e=>{
    const b=e.target.closest('[data-pl]'), d=e.target.closest('[data-plf]');
    if(b){ p.playing?stop():play(); return; }
    if(d){ stop(); p.i=+d.dataset.plf; apply(); }
  });
  /* ชี้ที่กราฟแล้วหยุดชั่วคราว ออกจากกราฟแล้วเล่นต่อ */
  if(p.hoverStop){
    const g=document.querySelector(p.hoverStop);
    if(g){
      g.addEventListener('mouseenter',()=>{p.paused=true;el.classList.add('paused')});
      g.addEventListener('mouseleave',()=>{p.paused=false;el.classList.remove('paused')});
    }
  }
  if(noInit){
    el.querySelectorAll('[data-plf]').forEach((d,i)=>d.classList.toggle('on',i===p.i));
    const now=document.getElementById(id+'-now');
    if(now)now.textContent=(p.frames[p.i].label||p.frames[p.i]);
    if(p.timer){el.classList.add('playing')}
  }else apply();
  if(p.auto&&!p.timer)play();
}

/* ─────────────── 34) แผนที่เฉดสีรายอำเภอ — ใช้ร่วมได้ทุกหน้า ─────────────── */
const CHO_RAMP=[[0,'#eaf6f0'],[.2,'#c2e7d4'],[.4,'#8fd3b3'],[.6,'#4fb98c'],[.8,'#1d8e64'],[1,'#0a5c42']];
function choMix(a,b,k){const p=h=>[1,3,5].map(i=>parseInt(h.substr(i,2),16));
  const A=p(a),B=p(b);
  return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*k).toString(16).padStart(2,'0')).join('')}
function choColor(t){t=Math.max(0,Math.min(1,isFinite(t)?t:0));
  for(let i=1;i<CHO_RAMP.length;i++)if(t<=CHO_RAMP[i][0]){
    const a=CHO_RAMP[i-1],b=CHO_RAMP[i];
    return choMix(a[1],b[1],(t-a[0])/(b[0]-a[0]))}
  return CHO_RAMP[CHO_RAMP.length-1][1]}
let CHO_GEO=null;
async function ampGeoJson(){
  if(CHO_GEO)return CHO_GEO;
  try{
    const r=await fetch('assets/nbl-amphoe.geojson');
    if(!r.ok)return null;
    const j=await r.json();
    if(!j||!j.features||!j.features.length)return null;
    CHO_GEO=j; return j;
  }catch(e){return null}
}
function choAmpName(f){
  const p=(f&&f.properties)||{};
  for(const k of ['amp_th','AMPHOE_T','amphoe','AP_TN','amp_name'])
    if(p[k])return String(p[k]).replace(/^อ\./,'').trim();
  return '';
}
function choLegend(mn,mx,unit,dec){
  const stops=CHO_RAMP.map(r=>choColor(r[0]));
  return `<div class="cho-lg">
    <span class="cho-lg-t">น้อย</span>
    <span class="cho-lg-bar" style="background:linear-gradient(90deg,${stops.join(',')})"></span>
    <span class="cho-lg-t">มาก</span>
    <span class="cho-lg-v">${f(mn,dec)} – ${f(mx,dec)} ${unit||''}</span></div>`;
}
/* แผนผังสำรอง ใช้เมื่อโหลดแผนที่ไม่ได้ — เฉดสีเดียวกับแผนที่ */
function choFallback(rows,mn,span,o){
  const sorted=rows.slice().sort((a,b)=>b.value-a.value);
  return `<div class="cho-fb">`+sorted.map(r=>`
    <div class="cho-fb-r" data-tip2="${o.tipOf?o.tipOf(r):''}">
      <span class="nm">${r.name}</span>
      <span class="tr"><i style="width:${Math.max(6,((r.value-mn)/span)*100).toFixed(0)}%;background:${choColor((r.value-mn)/span)}"></i></span>
      <span class="vv">${f(r.value,o.dec??0)}</span></div>`).join('')+
    `</div><div class="note">แสดงเป็นแผนผังสำรองเพราะโหลดขอบเขตแผนที่ไม่ได้ ตรวจว่าอัปโหลด <code>assets/nbl-amphoe.geojson</code> แล้วหรือยัง</div>`;
}
/* rows = [{name,value}] · o = {unit,dec,height,title,tipOf} */
async function drawAmpChoropleth(boxId,rows,o){
  const box=document.getElementById(boxId); if(!box)return;
  o=o||{};
  const vals=rows.map(r=>r.value).filter(v=>isFinite(v));
  const mn=Math.min(...vals), mx=Math.max(...vals), span=(mx-mn)||1;
  const geo=(typeof L!=='undefined')?await ampGeoJson():null;
  if(!geo){box.innerHTML=choFallback(rows,mn,span,o)+choLegend(mn,mx,o.unit,o.dec??0);return}
  const byName={}; rows.forEach(r=>byName[r.name]=r.value);
  const pick=nm=>{
    if(byName[nm]!=null)return byName[nm];
    const hit=rows.find(r=>nm&&(nm.indexOf(r.name)>=0||r.name.indexOf(nm)>=0));
    return hit?hit.value:null;
  };
  box.innerHTML=`<div class="cho-map" id="${boxId}-m" style="height:${o.height||390}px"></div>`+choLegend(mn,mx,o.unit,o.dec??0);
  const el=document.getElementById(boxId+'-m');
  if(box._map){try{box._map.remove()}catch(e){}}
  const map=L.map(el,{zoomControl:true,scrollWheelZoom:false,attributionControl:false,dragging:true});
  box._map=map;
  const layer=L.geoJSON(geo,{
    style:ft=>{const v=pick(choAmpName(ft));
      return{color:'#ffffff',weight:1.6,fillColor:v==null?'#e8ecea':choColor((v-mn)/span),fillOpacity:.92}},
    onEachFeature:(ft,lyr)=>{
      const nm=choAmpName(ft), v=pick(nm);
      const row={name:nm,value:v};
      lyr.bindTooltip(`<b>${nm}</b><br>${v==null?'ไม่มีข้อมูล':f(v,o.dec??0)+' '+(o.unit||'')}`,
        {sticky:true,direction:'top',className:'cho-tt'});
      lyr.on('mouseover',()=>lyr.setStyle({weight:3,color:'#0b3c32'}));
      lyr.on('mouseout',()=>lyr.setStyle({weight:1.6,color:'#ffffff'}));
      if(v!=null)lyr.bindPopup(`<div class="cho-pop"><b>${nm}</b>
        <span>${f(v,o.dec??0)} ${o.unit||''}</span>
        <small>สูงสุด ${f(mx,o.dec??0)} · ต่ำสุด ${f(mn,o.dec??0)}</small></div>`);
    }}).addTo(map);
  try{map.fitBounds(layer.getBounds(),{padding:[12,12]})}catch(e){map.setView([17.22,102.33],9)}
  setTimeout(()=>{try{map.invalidateSize()}catch(e){}},120);
  return map;
}

/* ─────────────── 22) โครงร่วม: แถบบน เมนู และการเริ่มระบบ ─────────────── */
const NAVI=[
 {id:'cover',   file:'index.html',    label:'หน้าปกจังหวัด',   ic:'<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.2V20h13v-9.8"/><path d="M9.6 20v-5.4h4.8V20"/>'},
 {id:'overview',file:'overview.html', label:'ภาพรวมเศรษฐกิจ',  ic:'<rect x="3" y="3.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3.5" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7" rx="1.6"/>'},
 {id:'gpp',     file:'gpp.html',      label:'GPP และการเติบโต',ic:'<path d="M3.5 17.5 9 11l4 3.6 7.2-8.4"/><path d="M15.6 6.2h4.9v4.9"/><path d="M3.5 20.5h17"/>'},

 {grp:'เศรษฐกิจรายภาคส่วน'},
 {id:'fiscal',  file:'fiscal.html',   label:'การคลังภาครัฐ',        ic:IC.bank},
 {id:'agri',    file:'agri.html',     label:'ภาคเกษตร',             ic:IC.leaf},
 {id:'industry',file:'industry.html', label:'อุตสาหกรรมและการผลิต', ic:IC.factory},
 {id:'trade',   file:'trade.html',    label:'การค้าและค่าครองชีพ',  ic:IC.cart},
 {id:'consume', file:'consume.html',  label:'การบริโภคและพลังงาน',  ic:IC.bolt},
 {id:'tourism', file:'tourism.html',  label:'ภาคการท่องเที่ยว',     ic:IC.plane},
 {id:'otop',    file:'otop.html',     label:'OTOP และเศรษฐกิจชุมชน', ic:'<path d="M3.5 8.5 12 4l8.5 4.5v7L12 20l-8.5-4.5z"/><path d="M3.5 8.5 12 13l8.5-4.5M12 13v7"/>'},

 {grp:'สังคมและประชากร'},
 {id:'labor',   file:'labor.html',    label:'ตลาดแรงงาน',           ic:IC.brief},
 {id:'household',file:'household.html',label:'ครัวเรือนและความเหลื่อมล้ำ',
   ic:'<path d="M3.5 10.5 12 4l8.5 6.5"/><path d="M5.8 9.4V20h12.4V9.4"/><path d="M9.6 20v-5.2h4.8V20"/>'},
 {id:'population',file:'population.html',label:'ประชากรและโครงสร้างอายุ',
   ic:'<circle cx="9" cy="8" r="3.2"/><path d="M2.8 20c0-3.4 2.8-5.6 6.2-5.6s6.2 2.2 6.2 5.6"/><path d="M16.5 5.2a3.2 3.2 0 0 1 0 6M18 14.9c2 .7 3.3 2.4 3.3 5.1"/>'},

 {grp:'มุมมองและเครื่องมือ'},
 {id:'area',    file:'area.html',     label:'ข้อมูลเชิงพื้นที่',    ic:'<path d="M9 3.5 3.5 6v14.5L9 18l6 2.5 5.5-2.5V3.5L15 6z"/><path d="M9 3.5V18M15 6v14.5"/>'},
 {id:'report',  file:'report.html',   label:'รายงานและบทวิเคราะห์', ic:'<path d="M4 5.5A2 2 0 0 1 6 3.5h9l5 5V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M14.5 3.6V9h5.2M8 12.5h8M8 16h5"/>'},
 {id:'sources', file:'sources.html',  label:'แหล่งข้อมูลและที่มา',  ic:'<ellipse cx="12" cy="6" rx="7.6" ry="2.9"/><path d="M4.4 6v12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9V6"/><path d="M4.4 12c0 1.6 3.4 2.9 7.6 2.9s7.6-1.3 7.6-2.9"/>'},
 {id:'settings',file:'settings.html', label:'ตั้งค่าระบบ',          ic:'<circle cx="12" cy="12" r="3.1"/><path d="M19.4 14.5a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a1.9 1.9 0 0 1-3.8 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.6 1.6 0 0 0-1.1-2.7h-.3a1.9 1.9 0 0 1 0-3.8h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1A1.9 1.9 0 1 1 7.5 4.2l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5v-.3a1.9 1.9 0 1 1 3.8 0v.2a1.6 1.6 0 0 0 2.7 1.1l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0 1.1 2.8h.3a1.9 1.9 0 0 1 0 3.8h-.2a1.6 1.6 0 0 0-1.4 1z"/>'}
];
const SEAL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAACgCAMAAAC8EZcfAAAB/lBMVEXeXl3lnGChWCslHBqkX1rb5uEhoUpbJirp2JrzkCOhMBnioJqfLlQYGhnZYicebTYWIR3eapSilWLVMSikzdpgUjRqXk2dW5AeKyRWnlJjUJNfojdpsN2goqBeYmEfba1xwk8hldYljjobfMP6PYLPNGgnckxmmqOhzaIuOZFwMUfuyXYmZFEJUyhVO40mjaJTXFqcpqOfrc7dssbY2tqfO4SYozZuAAB0xO6PxzxRVFI1wk1mw4qLyHb/AAA2UEdXk3EA/3hrloqdxLf/AP8jn2om7qtc57GSl5a13NMlRjo9TEcA/wAA//9owT5y///+yQAAAH8vRD5nKj1VAFV/fwDfv7////8CAgL2+voAAADzdpk5lNHuOnvyZ5D6/LIHqk7U5+0yicnyV4dEmdOItuJNt0kxs0rxZy201e2oyun1haVrqtpUo9j1SYTVl0vuWC2PxkKVxOczh0OxaDLTSynNiEjxdynJeDZ2teTb69Ly1pHPhjpqu0eGttvvt3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADG+YkxAAAAgHRSTlP+///p/v//+f////78nv/+YP7//////v8f//////8Q///////8/f7////9/xcT//9iFv//Fv//Av//n////wFNEQMcHAEHBAlDGFeMAQH/A/8Ch7wDAggA/P8C/v/+/v/////+//////////7///3//////////////////////xjwg9cAACaCSURBVHja5Z2JWyJJmv8jLzIhAcmUQ470KhHLq7qsruqaq2d2ZnZm793fiQdioaCiCDYiYIP6r+/3jciExFLbqunZ2efZt0STK/OT7xVvREZGseJ/c2H/MwB3P5PZ3d3/JoBE8+Q7s7t/W8AR3NuZmZlYxJNYbGZmdnb0kb8VoHvoWYApyvbnokQi38y+/YsZ2V9CR1rbflaUSGzmL2NkX4cn6HyKUxQlkUgKSegTKnUZv9If2VfixSJjtKRtG8bBpBiOndSVMSO5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';

function buildShell(active){
  const top=document.getElementById('topbar');
  if(top)top.innerHTML=`
    <button class="tb hamb" id="hamb" aria-label="เมนู"><svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <div class="seal"><img src="${SEAL}" alt="ตราประจำจังหวัดหนองบัวลำภู"></div>
    <div class="brand"><h1>ศูนย์บัญชาการข้อมูลเศรษฐกิจ จังหวัดหนองบัวลำภู</h1>
      <p>Nong Bua Lam Phu Economic Data Command Center</p></div>
    <div class="sp"></div>
    <div class="asof"><b id="asof">ข้อมูล ณ ${CFG.asof}</b><span>ปีงบประมาณ 2569 · build ${CFG.build}</span></div>
    <button class="tb" id="btnEdit" data-tip2="โหมดแก้ไขตาราง|คลิกที่ตัวเลขในตารางเพื่อแก้ไขได้ทันที บันทึกลงเครื่องนี้"><svg viewBox="0 0 24 24"><path d="M4 20h4.5L19 9.5a2.1 2.1 0 0 0-3-3L5.5 17z"/><path d="M14.5 6.5l3 3"/></svg></button>
    <button class="tb" id="btnTheme"><svg viewBox="0 0 24 24"><path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4"/><circle cx="12" cy="12" r="3.6"/></svg></button>
    <button class="tb kioskbtn" id="btnKiosk"><svg viewBox="0 0 24 24"><rect x="2.5" y="4" width="19" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg><span>จอนำเสนอ</span></button>
    <button class="tb" id="btnPrint"><svg viewBox="0 0 24 24"><path d="M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z"/></svg></button>
    <a class="tb" href="input.html"><svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/></svg><span>กรอกข้อมูล</span></a>`;
  const side=document.getElementById('sidebar');
  if(side)side.innerHTML=
     `<button class="railbtn" id="btnRail" data-tip="ขยายเมนู" aria-label="พับเมนู">
        <svg viewBox="0 0 24 24"><path d="M14.5 7 9.5 12l5 5"/></svg><span>พับเมนู</span></button>`
    +NAVI.map(n=>n.grp?`<div class="grp">${n.grp}</div>`
    :`<a class="nv${n.id===active?' act':''}" href="${n.file}" data-tip="${n.label}">
        <svg viewBox="0 0 24 24">${n.ic}</svg><span>${n.label}</span></a>`).join('')
    +`<div class="sfoot">“ข้อมูลที่เร็วกว่า<br>คือการตัดสินใจที่ดีกว่า”</div>`;

  const main=document.querySelector('.main');
  if(main&&!document.getElementById('pgfoot')){
    const f=document.createElement('footer');
    f.id='pgfoot'; f.className='pgfoot';
    f.innerHTML=`
      <div class="pf-in">
        <div class="pf-brand">
          <img src="${SEAL}" alt="ตราประจำจังหวัดหนองบัวลำภู">
          <div>
            <b>สำนักงานจังหวัดหนองบัวลำภู</b>
            <span>ศาลากลางจังหวัดหนองบัวลำภู ชั้น 4 ถ.หนองบัวลำภู – เลย<br>
            ต.ลำภู อ.เมือง จ.หนองบัวลำภู 39000</span>
          </div>
        </div>
        <div class="pf-links">
          <a href="tel:042316680">
            <svg viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/></svg>
            0 4231 6680-1</a>
          <a href="https://www.nongbualamphu.go.th/" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.6"/><path d="M3.4 12h17.2M12 3.4c2.4 2.7 3.6 5.5 3.6 8.6s-1.2 5.9-3.6 8.6c-2.4-2.7-3.6-5.5-3.6-8.6S9.6 6.1 12 3.4Z"/></svg>
            เว็บไซต์จังหวัด</a>
          <a href="input.html">
            <svg viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7.5a4 4 0 0 1 8 0V10"/></svg>
            ระบบกรอกข้อมูล</a>
        </div>
      </div>
      <div class="pf-copy">© 2025 จัดทำโดย สำนักงานสถิติจังหวัดหนองบัวลำภู · โทร 0 4231 6736 · build ${CFG.build}</div>`;
    main.appendChild(f);
  }
}

/* เตือนเมื่อโฟลเดอร์ assets ยังไม่ได้อัปโหลด */
function checkAssets(){
  const img=new Image();
  img.onerror=()=>{
    if(document.getElementById('assetWarn'))return;
    const d=document.createElement('div');d.id='assetWarn';d.className='edbar';
    d.style.cssText='background:var(--coral-l);border-color:rgba(201,69,47,.35);color:var(--bad)';
    d.innerHTML='<b>ไม่พบโฟลเดอร์ assets</b> — ภาพพื้นหลังและภาพประกอบจะไม่แสดง โปรดอัปโหลดโฟลเดอร์ assets ที่มีรูป 12 ไฟล์ ไว้ระดับเดียวกับ index.html';
    const m=document.querySelector('.main');if(m)m.prepend(d);
  };
  img.src='assets/cover-fields.jpg?v='+CFG.build;
}

const DS={
  init(pageId,render){
    PAGE={id:pageId,render:render||function(){}};
    document.addEventListener('DOMContentLoaded',()=>DS.boot());
    if(document.readyState!=='loading')DS.boot();
  },
  booted:false,
  boot(){
    if(DS.booted)return; DS.booted=true;
    try{const t=localStorage.getItem('nblEcon.theme');if(t)document.documentElement.dataset.theme=t}catch(e){}
    applySet(); chDefaults(); initTip(); buildShell(PAGE.id);
    document.body.classList.toggle('cover',PAGE.id==='cover');

    document.addEventListener('click',e=>{
      const cp=e.target.closest('[data-cover]');
      if(cp&&window.onCoverPick){window.onCoverPick(cp.dataset.cover);return}
      const ac=e.target.closest('[data-accent]');
      if(ac&&window.onAccentPick){window.onAccentPick(ac.dataset.accent);return}
      if(e.target.closest('#btnEdDone')){toggleEdit();return}
      const sg=e.target.closest('.segs button');
      if(sg){const w=sg.parentElement;
        w.querySelectorAll('button').forEach(b=>b.classList.toggle('on',b===sg));
        if(window.onSeg)window.onSeg(w,sg);}
    });
    document.addEventListener('focusout',e=>{
      const td=e.target.closest&&e.target.closest('td[data-path][contenteditable]');
      if(td)commitCell(td)});
    document.addEventListener('keydown',e=>{
      if(e.key==='Enter'&&e.target.matches&&e.target.matches('td[data-path][contenteditable]')){e.preventDefault();e.target.blur()}
      if(e.key==='Escape'&&EDIT)toggleEdit()});

    const hb=document.getElementById('hamb');
    if(hb)hb.onclick=()=>document.body.classList.toggle('navopen');
    const app=document.getElementById('app');
    let railed=false; try{railed=localStorage.getItem('nblEcon.rail')==='1'}catch(e){}
    if(railed&&app)app.classList.add('narrow');
    const rb=document.getElementById('btnRail');
    if(rb)rb.onclick=()=>{
      const on=app.classList.toggle('narrow');
      try{localStorage.setItem('nblEcon.rail',on?'1':'0')}catch(e){}
      setTimeout(()=>{Object.values(CH).forEach(c=>{try{c.resize()}catch(e){}});
        if(window.MAP&&MAP.invalidateSize)MAP.invalidateSize()},280);
    };
    const bp=document.getElementById('btnPrint');
    if(bp)bp.onclick=()=>window.print();
    const be=document.getElementById('btnEdit');
    if(be)be.onclick=toggleEdit;
    const bt=document.getElementById('btnTheme');
    if(bt)bt.onclick=()=>{
      const t=document.documentElement.dataset.theme==='light'?'dark':'light';
      document.documentElement.dataset.theme=t;
      try{localStorage.setItem('nblEcon.theme',t)}catch(e){}
      chDefaults(); safeRender();};

    /* โหมดจอนำเสนอ: เดินหน้าไปทีละหน้า */
    const bk=document.getElementById('btnKiosk');
    if(bk)bk.onclick=()=>{
      let on=false; try{on=sessionStorage.getItem('nblEcon.kiosk')==='1'}catch(e){}
      try{sessionStorage.setItem('nblEcon.kiosk',on?'0':'1')}catch(e){}
      location.reload();};
    let kioskOn=false; try{kioskOn=sessionStorage.getItem('nblEcon.kiosk')==='1'}catch(e){}
    if(kioskOn){
      document.body.classList.add('kiosk');
      if(bk)bk.classList.add('on');
      const ord=['overview','gpp','fiscal','agri','industry','trade','consume','labor','tourism','area'];
      let i=ord.indexOf(PAGE.id); if(i<0)i=0;
      setTimeout(()=>{const nx=NAVI.find(n=>n.id===ord[(i+1)%ord.length]);
        if(nx)location.href=nx.file;},(SET.kiosk||20)*1000);
    }

    try{EDIT=localStorage.getItem('nblEcon.editing')==='1'}catch(e){}
    safeRender();
    if(EDIT){EDIT=false;if(authValid())toggleEdit();else{try{localStorage.setItem('nblEcon.editing','0')}catch(e){}}}
    initToTop(); checkAssets(); loadLive(); loadTables();
    let rz;
    window.addEventListener('resize',()=>{clearTimeout(rz);rz=setTimeout(()=>{
      chDefaults();
      Object.values(CH).forEach(c=>{try{c.resize()}catch(e){}});
    },220)});
    window.addEventListener('error',ev=>showBootErr(ev),true);
    bootSelfCheck();
  }
};
/* ─────────────── ตรวจสภาพการติดตั้ง — บอกให้ชัดว่าอะไรขาด ─────────────── */
const DS_VERSION='3.2.0';
const BOOT={miss:[],hard:[],api:false};
function bootBox(){
  let box=document.getElementById('bootErr');
  if(!box){
    box=document.createElement('div'); box.id='bootErr';
    box.style.cssText='position:fixed;left:12px;right:12px;bottom:12px;z-index:99999;background:#fff;'+
      'border-radius:13px;padding:13px 16px;font:13.5px/1.75 system-ui;'+
      'box-shadow:0 14px 34px -14px rgba(0,0,0,.42);max-height:42vh;overflow:auto';
    const x=document.createElement('button');
    x.textContent='ปิด'; x.style.cssText='float:right;border:1px solid currentColor;background:transparent;'+
      'border-radius:8px;padding:3px 11px;font:12px system-ui;cursor:pointer;opacity:.75';
    x.onclick=()=>box.remove(); box.appendChild(x);
    const h=document.createElement('b'); h.id='bootErrHead'; box.appendChild(h);
    const ul=document.createElement('div'); ul.id='bootErrList'; box.appendChild(ul);
    document.body.appendChild(box);
  }
  return box;
}
/* ไฟล์รูปที่หายไม่ทำให้หน้าพัง เพราะมี onerror ถอดออกให้อยู่แล้ว
   จึงรวบเป็นข้อความเตือนบรรทัดเดียว ไม่ปนกับข้อผิดพลาดจริง */
function bootPaint(){
  const box=bootBox(), head=document.getElementById('bootErrHead'), list=document.getElementById('bootErrList');
  const hard=BOOT.hard.length>0;
  box.style.background='#fff';
  box.style.border='1px solid '+(hard?'#f0c4bb':'#ecd8a8');
  box.style.color=hard?'#8a2f20':'#7a5c12';
  head.textContent=hard?'โหลดหน้าไม่สมบูรณ์'
    :(BOOT.api&&!BOOT.miss.length)?'หน้าทำงานได้ · ใช้ข้อมูลจากไฟล์ล่าสุด'
    :'หน้าทำงานได้ แต่มีไฟล์ประกอบขาดอยู่';
  list.innerHTML='';
  BOOT.hard.slice(0,6).forEach(m=>{
    const d=document.createElement('div'); d.textContent='• '+m; list.appendChild(d);
  });
  if(BOOT.api){
    const d=document.createElement('div');
    d.textContent='• เชื่อมต่อฐานข้อมูลออนไลน์ไม่สำเร็จในรอบนี้ · หน้าเว็บแสดงข้อมูลจากไฟล์ล่าสุดที่เผยแพร่ไว้ '+
      'ค่าที่หน่วยงานเพิ่งแก้ผ่านระบบกรอกข้อมูลอาจยังไม่ปรากฏ · ระบบจะลองใหม่อัตโนมัติเมื่อเปิดหน้าอีกครั้ง';
    list.appendChild(d);
  }
  if(BOOT.miss.length){
    const names=[...new Set(BOOT.miss)];
    const d=document.createElement('div');
    d.textContent='• ไฟล์รูปหรือไอคอนที่ยังไม่ได้อัปโหลด '+names.length+' ไฟล์: '+
      names.slice(0,12).join(', ')+(names.length>12?' และอีก '+(names.length-12)+' ไฟล์':'')+
      ' — จุดที่ใช้ไฟล์เหล่านี้จะถอยไปใช้ไอคอนเส้นแทน ไม่กระทบการใช้งาน';
    list.appendChild(d);
  }
}
function showBootErr(ev,extra){
  if(extra){BOOT.hard.push(extra);bootPaint();return}
  const t=ev&&ev.target;
  if(t&&t!==window&&(t.src||t.href)){
    const u=String(t.src||t.href);
    /* ภาพแผนที่พื้นหลังหลุดบางแผ่นเป็นเรื่องปกติของผู้ให้บริการ tile ไม่ใช่หน้าเว็บพัง จึงไม่แจ้งเตือน */
    if((t.classList&&t.classList.contains('leaflet-tile'))||/arcgisonline|cartocdn|tile\.openstreetmap/.test(u))return;
    /* ไอคอนที่มีไฟล์สำรองจะสลับไปใช้ไฟล์สำรองเอง ไม่นับว่าหาย */
    if(t.dataset&&(t.dataset.fb||t.dataset.chain))return;
    /* เรียก API ของ Apps Script ไม่สำเร็จ ไม่ใช่หน้าเว็บพัง — แดชบอร์ดอ่านจากไฟล์ข้อมูลได้ครบอยู่แล้ว
       API ใช้เฉพาะดึงค่าที่หน่วยงานแก้ผ่านระบบกรอกข้อมูล และมักหลุดเพราะ Apps Script ตื่นช้าหรือโควตาเต็ม
       จึงแจ้งเป็นหมายเหตุเบา ๆ ไม่ขึ้นกล่องแดงว่าโหลดหน้าไม่สมบูรณ์ */
    if(/script\.google\.com/.test(u)){BOOT.api=true;bootPaint();return}
    const name=u.split('/').pop().split('?')[0];
    if(/\.(png|jpg|jpeg|webp|gif|svg)$/i.test(name)){BOOT.miss.push(name);bootPaint();return}
    BOOT.hard.push('โหลดไฟล์ไม่สำเร็จ: '+u.replace(location.origin,''));bootPaint();return;
  }
  const where=ev&&ev.filename?(String(ev.filename).replace(location.origin,'')+' บรรทัด '+ev.lineno):'ไม่ทราบไฟล์';
  const msg=(ev&&ev.message)||'ไม่ทราบสาเหตุ';
  /* "Script error." ที่ไม่มีชื่อไฟล์คือข้อความที่เบราว์เซอร์ปิดรายละเอียดของสคริปต์ข้ามโดเมนไว้
     ไม่มีข้อมูลให้แก้ และหน้าเว็บยังทำงานต่อได้ตามปกติ จึงเก็บลง console แทนการขึ้นกล่องแดง
     สาเหตุหลักที่เคยเจอคือกราฟที่ถูกถอด canvas ออกแล้วยังค้างอยู่ ซึ่งตอนนี้ระบบเก็บกวาดให้เองแล้ว */
  if(/^Script error\.?$/i.test(msg)&&!(ev&&ev.filename)){
    try{console.warn('ข้อผิดพลาดจากสคริปต์ภายนอก (เบราว์เซอร์ซ่อนรายละเอียด) · หน้าเว็บยังทำงานปกติ')}catch(e){}
    return;
  }
  /* ResizeObserver loop เป็นคำเตือนของเบราว์เซอร์ ไม่ใช่ความผิดพลาดของหน้า */
  if(/ResizeObserver loop/i.test(msg))return;
  BOOT.hard.push(msg+(msg==='Script error.'?' (มาจากสคริปต์ภายนอก เช่น Chart.js หรือ Leaflet ที่โหลดไม่สำเร็จ)':'')+' — '+where);
  bootPaint();
}
function checkCardBg(){
  const urls=new Set();
  document.querySelectorAll('.kpibg,.fruitbg').forEach(el=>{
    const m=/url\(["']?([^"')]+)["']?\)/.exec(el.style.backgroundImage||'');
    if(m)urls.add(m[1]);
  });
  if(document.querySelector('.slicer'))urls.add(CARD_BG_DIR+'bg-slicer.webp');
  urls.forEach(u=>{
    const img=new Image();
    img.onerror=()=>{BOOT.miss.push(u.split('/').pop());bootPaint()};
    img.src=u;
  });
}
/* ตรวจว่าไฟล์ร่วมมาครบและเป็นรุ่นเดียวกับหน้าหรือไม่ */
function bootSelfCheck(){
  const miss=[];
  try{
    const brand=getComputedStyle(document.documentElement).getPropertyValue('--brand').trim();
    if(!brand)miss.push('ds.css ยังไม่ถูกโหลด หน้าจะไม่มีสีและเลย์เอาต์ — ตรวจว่าอัปโหลด ds.css แล้วและชื่อไฟล์เป็นตัวพิมพ์เล็กทั้งหมด');
  }catch(e){}
  if(typeof Chart==='undefined')miss.push('Chart.js โหลดไม่สำเร็จ กราฟทุกตัวจะไม่ขึ้น — ตรวจการเชื่อมต่ออินเทอร์เน็ตหรือการเข้าถึง cdn.jsdelivr.net');
  if(document.querySelector('#map,.cho-map,#tilemap')&&typeof L==='undefined')
    miss.push('Leaflet โหลดไม่สำเร็จ แผนที่จะไม่ขึ้น — ตรวจการเข้าถึง unpkg.com');
  /* พื้นหลังการ์ดเป็น background-image ของ CSS ซึ่งพังเงียบ ๆ ถ้าไฟล์ไม่มี
     จึงยิงตรวจซ้ำด้วย Image() เบราว์เซอร์ดึงจากแคชอยู่แล้ว ไม่เพิ่มโหลดจริง */
  setTimeout(checkCardBg,900);
  const need=['yearBar','drawAmpChoropleth','slicerBar','tipOf','f_num'];
  const old=need.filter(n=>typeof window[n]!=='function');
  if(old.length)miss.push('ds.js เป็นรุ่นเก่ากว่าหน้านี้ (ขาด '+old.join(', ')+') — อัปโหลด ds.js รุ่นล่าสุดทับ');
  miss.forEach(m=>showBootErr(null,m));
}
let PAGE={id:'',render(){}};
/* เติมไอคอนให้ทุกจุดที่ประกาศไว้ รวมถึงส่วนที่วาดทีหลัง */
function fillIcons(root){
  (root||document).querySelectorAll('[data-bigico]').forEach(el=>{if(!el.innerHTML)el.innerHTML=icoImg(el.dataset.bigico,52)});
  (root||document).querySelectorAll('[data-hdico]').forEach(el=>{if(!el.innerHTML)el.innerHTML=icoImg(el.dataset.hdico,26)});
  relabelIcons(root||document);
}
/* หน้าไหนวาดการ์ดเพิ่มทีหลัง ไอคอนก็ยังขึ้นเอง ไม่ต้องเรียกซ้ำ */
(function(){
  if(typeof MutationObserver==='undefined')return;
  const mo=new MutationObserver(ms=>{
    for(const m of ms)for(const n of m.addedNodes){
      if(n.nodeType!==1)continue;
      if(n.hasAttribute&&(n.hasAttribute('data-hdico')||n.hasAttribute('data-bigico')))fillIcons(n.parentNode||document);
      else if(n.querySelector&&n.querySelector('[data-hdico],[data-bigico]'))fillIcons(n);
      if(n.tagName==='IMG'||(n.querySelector&&n.querySelector('img.ico,img.rowico')))relabelIcons(n);
    }
  });
  document.addEventListener('DOMContentLoaded',()=>mo.observe(document.body,{childList:true,subtree:true}));
})();
/* แถบบอกความน่าเชื่อถือของตัวเลขรายเดือน — แสดงเฉพาะหน้าที่ใช้ชุดรายเดือน */
/* หน้าภาพรวมและหน้า GPP ใช้ข้อมูลจริงจากแฟ้มของหน่วยงานแล้ว ไม่ต้องมีแถบเตือนข้อมูลจำลอง */
const TRUST_PAGES={fiscal:['spend'],industry:['factory','power'],trade:['cpi','credit'],
  consume:['fuel','car'],area:null};
function trustBar(){
  if(typeof PAGE==='undefined'||!TRUST_PAGES.hasOwnProperty(PAGE.id))return;
  const v=document.querySelector('.view.on'); if(!v)return;
  const ids=TRUST_PAGES[PAGE.id]||DATASETS.map(d=>d.id);
  const st=ids.map(id=>({id,d:DATASETS.find(x=>x.id===id),r:realStat(id)})).filter(x=>x.d&&x.r);
  const full=st.filter(x=>x.r.share>=.999).length, none=st.filter(x=>x.r.real===0).length, part=st.length-full-none;
  const showMei=false;
  const lv=full===st.length?'ok':none===st.length?'bad':'warn';
  let el=v.querySelector('.trust');
  if(!el){el=document.createElement('div');el.className='trust';
    const sl=v.querySelector('.slicer'), ph=v.querySelector('.ph');
    if(sl&&sl.parentNode)sl.parentNode.insertBefore(el,sl);
    else if(ph&&ph.nextSibling)ph.parentNode.insertBefore(el,ph.nextSibling);else v.prepend(el)}
  const open=el.classList.contains('open');
  el.className='trust '+lv+(open?' open':'');
  const conn=LIVE.ok?'':LIVE.err?'<b>เชื่อมฐานข้อมูลกลางไม่ได้</b> · ':'<b>กำลังโหลดข้อมูลจริง</b> · ';
  const msg=lv==='ok'?`ตัวเลขรายเดือนในหน้านี้เป็นค่าจริงจากหน่วยงานครบ 12 เดือนล่าสุด`
    :lv==='bad'?`ตัวเลขรายเดือนในหน้านี้ยังเป็น<b>ข้อมูลจำลอง</b>ทั้งหมด ใช้ทดสอบการแสดงผลเท่านั้น ห้ามนำไปอ้างอิง`
    :`ข้อมูลจริง ${full} ชุด · จริงบางเดือน ${part} ชุด · ยังเป็นข้อมูลจำลอง ${none} ชุด — การ์ดที่มีป้าย <span class="simchip mini">จำลอง</span> ห้ามนำไปอ้างอิง`;
  el.innerHTML=`<div class="tr-h"><span class="tr-dot"></span><span class="tr-t">${conn}${msg}
      ${showMei?` · ดัชนี NBL–MEI เดือนล่าสุดคำนวณจากค่าจริง <b>${Math.round(MEI.real*100)}%</b> ของน้ำหนัก`:''}</span>
      <button class="tb tr-btn" type="button">${open?'ซ่อน':'ดูรายชุด'}</button></div>
    <div class="tr-list">${st.map(x=>{const pc=Math.round(x.r.share*100);
      return `<div class="tr-row"><span class="nm">${x.d.series.map(s=>s.label).slice(0,2).join(' · ')}</span>
        <span class="ag">${agencyName(x.id).replace('สำนักงาน','สนง.').replace('จังหวัดหนองบัวลำภู','จ.')}</span>
        <span class="bar"><i style="width:${pc}%"></i></span>
        <span class="pc ${pc>=100?'ok':pc>0?'warn':'bad'}">${pc>=100?'จริงครบ':pc>0?'จริง '+pc+'%':'จำลอง'}</span>
        <span class="ls">${x.r.last?'ล่าสุด '+TH_M[+x.r.last.slice(5)-1]+' '+x.r.last.slice(2,4):'ยังไม่มีค่าจริง'}</span></div>`}).join('')}
      <div class="tr-note">ค่าจริงมาจากข้อมูลที่ผู้ดูแลระบบอนุมัติแล้วในระบบกรอกข้อมูล · ข้อมูลที่หน่วยงานส่งแต่ยังรออนุมัติยังไม่ขึ้นแดชบอร์ด</div></div>`;
  v.querySelectorAll('.chip.mock').forEach(c=>{c.textContent=lv==='ok'?'ข้อมูลจริง':lv==='bad'?'ข้อมูลจำลอง รอข้อมูลจริง':'ข้อมูลจริงบางส่วน';
    c.classList.toggle('real',lv==='ok')});
  const b=el.querySelector('.tr-btn');
  if(b)b.onclick=()=>{el.classList.toggle('open');b.textContent=el.classList.contains('open')?'ซ่อน':'ดูรายชุด'};
  /* ป้ายที่ชื่อดัชนี NBL–MEI */
  if(showMei&&MEI.real<.999)document.querySelectorAll('.lb,h3').forEach(h=>{
    if(!/NBL–MEI/.test(h.textContent)||h.querySelector('.simchip'))return;
    h.insertAdjacentHTML('beforeend',' '+simChip({sim:1,real:MEI.real>0?1:0},true));
  });
}
/* หัวหน้าเพจย่อเป็นแถบบางเมื่อเลื่อนลง ไม่บังหัวการ์ด */
function bindPhMini(){
  const m=document.querySelector('.main'); if(!m||m.dataset.phm)return; m.dataset.phm='1';
  let raf=0;
  const upd=()=>{raf=0;const y=Math.max(m.scrollTop||0,window.scrollY||0);
    document.querySelectorAll('.view.on>.ph,.ph').forEach(p=>p.classList.toggle('mini',y>60))};
  const on=()=>{if(!raf)raf=requestAnimationFrame(upd)};
  m.addEventListener('scroll',on,{passive:true});window.addEventListener('scroll',on,{passive:true});
}
function safeRender(){
  try{PAGE.render()}catch(e){console.error('render '+PAGE.id,e)}
  try{
    bindPhMini();
    trustBar();
    document.querySelectorAll('[data-build]').forEach(e=>e.textContent=CFG.build);
    fillIcons();
    pageBanner();bindToggle();revealCards();animateNums();
  }catch(e){}
}

document.addEventListener('click',function(e){
  const g=e.target.closest('[data-go]');
  if(!g||e.target.closest('td[data-path]'))return;
  const n=NAVI.find(x=>x.id===g.dataset.go);
  if(n)location.href=n.file;
});
