/* ══════════════════════════════════════════════════════════════
   sdg-data.js — ทะเบียนเป้าหมาย ตัวชี้วัด และข้อมูลตั้งต้น
   ศูนย์ข้อมูลการพัฒนาที่ยั่งยืน (SDGs) จังหวัดหนองบัวลำภู
   ----------------------------------------------------------------
   • ตัวชี้วัดที่มีใน sdg-real.js = ข้อมูลจริงจากบัญชีข้อมูลจังหวัด
   • ตัวชี้วัดที่เหลือ = ข้อมูลจำลอง (ขึ้นป้าย "จำลอง" ทุกจุดที่แสดงผล)
   • เมื่อตั้งค่า SDG_CFG.API แล้ว ข้อมูลจาก Google Sheets จะทับค่าทั้งหมด
   ══════════════════════════════════════════════════════════════ */

const SDG_CFG = {
  build: '0.2.0',
  API: 'https://script.google.com/macros/s/AKfycbyWEhb8lfTJTUICbhbwxS_odPdnMW7fRcXdDrk51yuUvy9yTZyRwIOhPsYooT4sM6XfAg/exec',
  refreshMin: 5,
  baseYear: 2564,
  targetYear: 2573,        // ค.ศ. 2030
  nowYear: 2569,
  asof: '28 กันยายน 2569'
};

const DISTRICTS = [
  { code: '3901', name: 'เมืองหนองบัวลำภู', short: 'เมือง', w: .32 },
  { code: '3904', name: 'ศรีบุญเรือง', short: 'ศรีบุญเรือง', w: .21 },
  { code: '3902', name: 'นากลาง', short: 'นากลาง', w: .17 },
  { code: '3903', name: 'โนนสัง', short: 'โนนสัง', w: .14 },
  { code: '3905', name: 'สุวรรณคูหา', short: 'สุวรรณคูหา', w: .10 },
  { code: '3906', name: 'นาวัง', short: 'นาวัง', w: .06 }
];
const PROVINCE = { amphoe: 6, tambon: 59, muban: 688, pop: 502088, popM: 249382, popF: 252706, agriHH: 72173 };

const PILLARS = [
  { id: 'people', th: 'คน', en: 'People', goals: [1, 2, 3, 4, 5], note: 'คุณภาพชีวิตและศักดิ์ศรีของคนหนองบัวลำภู' },
  { id: 'prosperity', th: 'ความมั่งคั่ง', en: 'Prosperity', goals: [7, 8, 9, 10, 11], note: 'เศรษฐกิจที่เติบโตและกระจายถึงทุกอำเภอ' },
  { id: 'planet', th: 'สิ่งแวดล้อม', en: 'Planet', goals: [6, 12, 13, 14, 15], note: 'น้ำ ป่า ดิน และภูมิอากาศของจังหวัด' },
  { id: 'peace', th: 'สันติภาพ', en: 'Peace', goals: [16], note: 'ความปลอดภัยและธรรมาภิบาล' },
  { id: 'partnership', th: 'หุ้นส่วน', en: 'Partnership', goals: [17], note: 'ความร่วมมือและการเปิดข้อมูล' }
];

/* tag = ประโยคสั้นที่อ่านแล้วรู้ทันทีว่าเป้าหมายนี้คือเรื่องอะไรในจังหวัดเรา */
const GOALS = [
  { n: 1, c: '#E5243B', th: 'ขจัดความยากจน', tag: 'ไม่มีครัวเรือนไหนตกเกณฑ์รายได้', local: 'วัดจากสัดส่วนคนจน จปฐ. และรายได้ครัวเรือน', icon: 'home' },
  { n: 2, c: '#DDA63A', th: 'ขจัดความหิวโหย', tag: 'เด็กโตสมวัย เกษตรมีรายได้', local: 'ภาวะโภชนาการทารก ผลผลิตข้าว และเกษตรอินทรีย์', icon: 'sprout' },
  { n: 3, c: '#4C9F38', th: 'สุขภาพและความเป็นอยู่ที่ดี', tag: 'ตายน้อยลงจากเรื่องที่ป้องกันได้', local: 'อุบัติเหตุทางถนน การเข้าถึงแพทย์ และสุขภาพจิต', icon: 'heart' },
  { n: 4, c: '#C5192D', th: 'การศึกษาที่มีคุณภาพ', tag: 'เด็กอยู่ในระบบและเรียนรู้ได้จริง', local: 'คะแนน O-NET การเข้าเรียน และผู้จบการศึกษา', icon: 'book' },
  { n: 5, c: '#FF3A21', th: 'ความเท่าเทียมทางเพศ', tag: 'ผู้หญิงมีงาน มีเสียง และปลอดภัย', local: 'ช่องว่างการว่างงานชาย–หญิง และบทบาทในท้องถิ่น', icon: 'equal' },
  { n: 6, c: '#26BDE2', th: 'น้ำสะอาดและสุขาภิบาล', tag: 'เปิดก๊อกแล้วมีน้ำที่ใช้ได้ทั้งปี', local: 'ประปาหมู่บ้านและน้ำต้นทุนในอ่างเก็บน้ำ', icon: 'drop' },
  { n: 7, c: '#FCC30B', th: 'พลังงานสะอาด', tag: 'แดดอีสานเปลี่ยนเป็นค่าไฟที่ถูกลง', local: 'โซลาร์เพื่อการเกษตรและครัวเรือน', icon: 'sun' },
  { n: 8, c: '#A21942', th: 'งานที่มีคุณค่าและเศรษฐกิจเติบโต', tag: 'มีงานทำ เงินเข้าจังหวัดมากขึ้น', local: 'การว่างงาน ท่องเที่ยว OTOP และ GPP ต่อหัว', icon: 'growth' },
  { n: 9, c: '#FD6925', th: 'อุตสาหกรรม นวัตกรรม โครงสร้างพื้นฐาน', tag: 'แปรรูปในพื้นที่ ไม่ขายแต่ของดิบ', local: 'รายได้ภาคอุตสาหกรรมและโครงสร้างพื้นฐานดิจิทัล', icon: 'cube' },
  { n: 10, c: '#DD1367', th: 'ลดความเหลื่อมล้ำ', tag: 'หนี้น้อยลง สิทธิถึงมือทุกกลุ่ม', local: 'หนี้ครัวเรือนและการเข้าถึงสิทธิของคนพิการ', icon: 'scale' },
  { n: 11, c: '#FD9D24', th: 'เมืองและชุมชนยั่งยืน', tag: 'อากาศสะอาด ชุมชนจัดการตัวเองได้', local: 'PM2.5 การจัดการขยะ และเรื่องร้องเรียนมลพิษ', icon: 'city' },
  { n: 12, c: '#BF8B2E', th: 'การผลิตและบริโภคที่ยั่งยืน', tag: 'ของดีหนองบัวลำภูผลิตอย่างรับผิดชอบ', local: 'ผู้ประกอบการชุมชน OTOP และเกษตรอินทรีย์', icon: 'loop' },
  { n: 13, c: '#3F7E44', th: 'รับมือการเปลี่ยนแปลงสภาพภูมิอากาศ', tag: 'ภัยมาแล้วไม่มีใครต้องเสียชีวิต', local: 'ความสูญเสียจากภัยพิบัติและจุดความร้อน', icon: 'globe' },
  { n: 14, c: '#0A97D9', th: 'ทรัพยากรน้ำจืดและประมง', tag: 'แหล่งน้ำจืดยังเลี้ยงคนได้', local: 'จังหวัดไม่ติดทะเล จึงวัดประมงน้ำจืดและคุณภาพน้ำ', icon: 'fish', adapted: 'SDG 14 เดิมคือทรัพยากรทางทะเล' },
  { n: 15, c: '#56C02B', th: 'ระบบนิเวศบนบก', tag: 'ป่าไม่หาย และค่อย ๆ กลับมา', local: 'พื้นที่ป่าไม้ภูเก้า–ภูพานคำ และการทวงคืนที่สาธารณะ', icon: 'tree' },
  { n: 16, c: '#00689D', th: 'สังคมสงบสุข ยุติธรรม', tag: 'ปลอดภัย โปร่งใส ไม่มีใครถูกทิ้ง', local: 'ยาเสพติด คดีอาชญากรรม และธรรมาภิบาล', icon: 'dove' },
  { n: 17, c: '#19486A', th: 'ความร่วมมือเพื่อการพัฒนา', tag: 'งบลงพื้นที่จริง ข้อมูลเปิดให้ใช้จริง', local: 'การเบิกจ่ายงบจังหวัดและการเปิดเผยข้อมูล', icon: 'link' }
];

const GH = 'https://nsonongbualamphutc-debug.github.io/';
const LINKED = [
  { id: 'econ', name: 'ศูนย์บัญชาการข้อมูลเศรษฐกิจ', goals: [8, 9, 2], url: GH + 'Nong_Bua_Lamphu_Province_Economic_Data_Command_Center/' },
  { id: 'water', name: 'ติดตามระดับน้ำ', goals: [6, 13, 14], url: GH + 'NongBuaLamPhu-Water-Level-Monitoring/' },
  { id: 'tourist', name: 'ความปลอดภัยนักท่องเที่ยว', goals: [8, 11], url: GH + 'Enhance_The_Safety_Of_Tourists/' },
  { id: 'land', name: 'แก้ปัญหาบุกรุกที่ดินและป่า', goals: [15, 16], url: GH + 'Operations_to_address_the_problem_of_encroachment_on_public_land_and_forest_areas/' },
  { id: 'security', name: 'ศูนย์บัญชาการข้อมูลความมั่นคง', goals: [16, 10, 15], url: GH + 'Nong-Bua-Lamphu-Provincial-Security-Information-Command-Center/' },
  { id: 'drug', name: 'สถานการณ์ยาเสพติด', goals: [3, 16], url: '', via: 'security' },
  { id: 'debt', name: 'หนี้นอกระบบ', goals: [1, 10], url: '', via: 'security' },
  { id: 'cyber', name: 'ป้องกันอาชญากรรมไซเบอร์', goals: [16], url: '', via: 'security' },
  { id: 'fuel', name: 'สถานการณ์น้ำมัน 51 สถานี', goals: [7], url: '' },
  { id: 'agri', name: 'Roadmap เกษตรมูลค่าสูง', goals: [2, 9, 12], url: '' },
  { id: 'infl', name: 'ปราบปรามผู้มีอิทธิพล', goals: [16], url: '', via: 'security' },
  { id: 'nominee', name: 'ธุรกิจนอมินี', goals: [16], url: '', via: 'security' },
  { id: 'aml', name: 'ศูนย์บัญชาการพิทักษ์ทรัพย์', goals: [16], url: '', via: 'security' }
];

/* ───────── ทะเบียนตัวชี้วัด ─────────
   dir : +1 ยิ่งมากยิ่งดี · -1 ยิ่งน้อยยิ่งดี
   target : ค่าเป้าหมายปี 2573 (เบื้องต้น รอคณะทำงานยืนยัน)
   ตัวที่ id ตรงกับใน REAL_DATA จะดึงข้อมูลจริง · sim = ข้อมูลจำลอง
   mo:true = ชุดรายเดือน ใช้ประกอบตัวหลัก ไม่นำมาคิดคะแนน */
const IND_SPEC = [
  { id: 'p1a', g: 1, name: 'สัดส่วนประชากรยากจน ตามเกณฑ์ จปฐ.', dir: -1, target: 0.05, freq: 'รายปี' },
  { id: 'p1b', g: 1, name: 'รายได้เฉลี่ยต่อเดือนของครัวเรือน', dir: 1, target: 32000, freq: 'สำรวจปีเว้นปี' },
  { id: 'p1c', g: 1, name: 'ครัวเรือนตกเกณฑ์รายได้ จปฐ.', dir: -1, target: 0, freq: 'รายปี', unit: 'ครัวเรือน', dec: 0, agency: 'สำนักงานพัฒนาชุมชนจังหวัด', sim: { base: 420, now: 118 } },

  { id: 'p2a', g: 2, name: 'ทารกแรกเกิดน้ำหนักต่ำกว่าเกณฑ์', dir: -1, target: 7, freq: 'รายปี' },
  { id: 'p2b', g: 2, name: 'ผลผลิตข้าวนาปีเฉลี่ยต่อไร่', dir: 1, target: 450, freq: 'รายปี', unit: 'กก./ไร่', dec: 0, agency: 'สำนักงานเกษตรจังหวัด', sim: { base: 352, now: 378 } },
  { id: 'p2c', g: 2, name: 'พื้นที่เกษตรอินทรีย์ที่ได้รับรอง', dir: 1, target: 500, freq: 'รายปี', unit: 'ไร่', dec: 2, agency: 'สำนักงานเกษตรจังหวัด', base: 20, fix: { p: '2569', v: 39.87, src: 'ฐานข้อมูลพื้นฐานด้านการเกษตร สนง.เกษตรจังหวัด ณ ก.ค. 2569' } },

  { id: 'p3a', g: 3, name: 'อัตราส่วนประชากรต่อแพทย์', dir: -1, target: 1800, freq: 'รายปี' },
  { id: 'p3b', g: 3, name: 'ผู้เสียชีวิตจากอุบัติเหตุบนท้องถนน', dir: -1, target: 60, freq: 'รายปี' },
  { id: 'p3c', g: 3, name: 'อัตราการฆ่าตัวตายสำเร็จ', dir: -1, target: 6, freq: 'รายปี' },
  { id: 'p3d', g: 3, name: 'จำนวนสถานพยาบาลในจังหวัด', dir: 1, target: 260, freq: 'รายปี' },

  { id: 'p4a', g: 4, name: 'คะแนน O-NET ม.6 เฉลี่ย 5 วิชา', dir: 1, target: 40, freq: 'รายปี' },
  { id: 'p4b', g: 4, name: 'ผู้สำเร็จการศึกษา ม.ปลาย', dir: 1, target: 4500, freq: 'รายปี' },
  { id: 'p4c', g: 4, name: 'นักเรียนที่เข้าเรียน ม.ปลาย', dir: 1, target: 9500, freq: 'รายปี' },
  { id: 'p4d', g: 4, name: 'เด็กและเยาวชนนอกระบบการศึกษา', dir: -1, target: 500, freq: 'รายภาคเรียน', unit: 'คน', dec: 0, agency: 'สำนักงานศึกษาธิการจังหวัด', sim: { base: 3120, now: 2240 } },

  { id: 'p5a', g: 5, name: 'อัตราการว่างงานเพศหญิง', dir: -1, target: 0.8, freq: 'รายไตรมาส' },
  { id: 'p5b', g: 5, name: 'อัตราการว่างงานเพศชาย', dir: -1, target: 0.8, freq: 'รายไตรมาส' },
  { id: 'p5c', g: 5, name: 'สัดส่วนสตรีในสภาท้องถิ่น', dir: 1, target: 30, freq: 'ตามรอบเลือกตั้ง', unit: 'ร้อยละ', dec: 1, agency: 'สำนักงานส่งเสริมการปกครองท้องถิ่นจังหวัด', sim: { base: 11.2, now: 15.6 } },

  { id: 'p6a', g: 6, name: 'หมู่บ้านมีน้ำประปาได้มาตรฐาน', dir: 1, target: 90, freq: 'รายปี', unit: 'ร้อยละ', dec: 1, agency: 'สำนักงานส่งเสริมการปกครองท้องถิ่นจังหวัด', sim: { base: 42.5, now: 58.1 } },
  { id: 'p6b', g: 6, name: 'ปริมาณน้ำในอ่างเก็บน้ำขนาดกลาง', dir: 1, target: 80, freq: 'รายวัน', unit: '% ความจุ', dec: 0, agency: 'โครงการชลประทานหนองบัวลำภู', sim: { base: 48, now: 61 } },

  { id: 'p7a', g: 7, name: 'ระบบสูบน้ำพลังงานแสงอาทิตย์เพื่อการเกษตร', dir: 1, target: 500, freq: 'รายปี', unit: 'แห่ง', dec: 0, agency: 'สำนักงานเกษตรจังหวัด', base: 120, fix: { p: '2569', v: 281, src: 'แหล่งน้ำเพื่อการเกษตร สนง.เกษตรจังหวัด · ผู้ได้ประโยชน์ 5,437 ครัวเรือน' } },
  { id: 'p7b', g: 7, name: 'ครัวเรือนติดตั้งโซลาร์รูฟท็อป', dir: 1, target: 3000, freq: 'รายไตรมาส', unit: 'ครัวเรือน', dec: 0, agency: 'สำนักงานพลังงานจังหวัด', sim: { base: 310, now: 1120 } },

  { id: 'p8a', g: 8, name: 'อัตราการว่างงานรายปี', dir: -1, target: 1, freq: 'รายปี' },
  { id: 'p8b', g: 8, name: 'รายได้จากการท่องเที่ยว', dir: 1, target: 800, freq: 'รายปี' },
  { id: 'p8b_m', g: 8, name: 'รายได้จากการท่องเที่ยวรายเดือน', dir: 1, target: 60, freq: 'รายเดือน', mo: true, parent: 'p8b' },
  { id: 'p8c', g: 8, name: 'รายได้จากผลิตภัณฑ์ OTOP', dir: 1, target: 3000, freq: 'รายปี' },
  { id: 'p8c_m', g: 8, name: 'รายได้ OTOP รายเดือน', dir: 1, target: 200, freq: 'รายเดือน', mo: true, parent: 'p8c' },
  { id: 'p8d', g: 8, name: 'อัตราการมีส่วนร่วมในกำลังแรงงาน', dir: 1, target: 72, freq: 'รายไตรมาส', unit: 'ร้อยละ', dec: 1, agency: 'สำนักงานสถิติจังหวัด',
    fixSeries: { src: 'การสำรวจภาวะการทำงานของประชากร สำนักงานสถิติจังหวัดหนองบัวลำภู', ptype: 'quarter',
      s: [['2/66', 69.2], ['3/66', 69.0], ['4/66', 68.4], ['1/67', 59.6], ['2/67', 56.5], ['2/68', 53.5], ['3/68', 58.6], ['4/68', 58.0], ['1/69', 62.2]] } },
  { id: 'p8e', g: 8, name: 'ผลิตภัณฑ์จังหวัดต่อหัว (GPP per capita)', dir: 1, target: 90000, freq: 'รายปี', unit: 'บาท/คน/ปี', dec: 0, agency: 'สำนักงานคลังจังหวัด / สศช.',
    fixSeries: { src: 'ผลิตภัณฑ์มวลรวมจังหวัด (GPP) · ชุดข้อมูลในแดชบอร์ดเศรษฐกิจ นภ.', s: [['2564', 62800], ['2565', 66500], ['2566', 69800]] } },

  { id: 'p9a', g: 9, name: 'รายได้ภาคอุตสาหกรรม (GPP)', dir: 1, target: 10000, freq: 'รายปี' },
  { id: 'p9b', g: 9, name: 'ครัวเรือนเข้าถึงอินเทอร์เน็ต', dir: 1, target: 95, freq: 'รายปี', unit: 'ร้อยละ', dec: 1, agency: 'สำนักงานสถิติจังหวัด', sim: { base: 71.3, now: 84.6 } },
  { id: 'p9c', g: 9, name: 'โรงงานแปรรูปการเกษตรจดทะเบียนใหม่', dir: 1, target: 25, freq: 'รายเดือน', unit: 'แห่ง', dec: 0, agency: 'สำนักงานอุตสาหกรรมจังหวัด', sim: { base: 6, now: 11 } },

  { id: 'p10a', g: 10, name: 'คนพิการที่ขึ้นทะเบียน', dir: 1, target: 26000, freq: 'รายปี' },
  { id: 'p10b', g: 10, name: 'หนี้สินเฉลี่ยต่อครัวเรือน', dir: -1, target: 250000, freq: 'สำรวจปีเว้นปี' },
  { id: 'p10c', g: 10, name: 'มูลหนี้นอกระบบที่ไกล่เกลี่ยสำเร็จ', dir: 1, target: 40, freq: 'รายเดือน', unit: 'ล้านบาท', dec: 1, agency: 'สำนักงานจังหวัด (ศูนย์แก้หนี้นอกระบบ)', sim: { base: 4.2, now: 18.6 } },

  { id: 'p11a', g: 11, name: 'PM2.5 เฉลี่ยทั้งปีในเขตเมือง', dir: -1, target: 15, freq: 'รายวัน' },
  { id: 'p11b', g: 11, name: 'อัตราการร้องเรียนปัญหามลพิษ', dir: -1, target: 10, freq: 'รายปี' },
  { id: 'p11c', g: 11, name: 'ขยะมูลฝอยได้รับการจัดการถูกต้อง', dir: 1, target: 90, freq: 'รายปี', unit: 'ร้อยละ', dec: 1, agency: 'สำนักงานทรัพยากรธรรมชาติและสิ่งแวดล้อมจังหวัด', sim: { base: 52.3, now: 67.5 } },

  { id: 'p12a', g: 12, name: 'ผู้ประกอบการชุมชน OTOP ในทะเบียน', dir: 1, target: 1500, freq: 'รายปี' },
  { id: 'p12b', g: 12, name: 'เกษตรกรที่ได้รับรองเกษตรอินทรีย์', dir: 1, target: 150, freq: 'รายปี', unit: 'ราย', dec: 0, agency: 'สำนักงานเกษตรจังหวัด', base: 5, fix: { p: '2569', v: 12, src: 'ฐานข้อมูลพื้นฐานด้านการเกษตร สนง.เกษตรจังหวัด ณ ก.ค. 2569' } },
  { id: 'p12c', g: 12, name: 'ผลิตภัณฑ์ชุมชนได้มาตรฐาน มผช.', dir: 1, target: 200, freq: 'รายปี', unit: 'ผลิตภัณฑ์', dec: 0, agency: 'สำนักงานอุตสาหกรรมจังหวัด', sim: { base: 84, now: 131 } },

  { id: 'p13a', g: 13, name: 'ผู้เสียชีวิตและสูญหายจากภัยพิบัติ', dir: -1, target: 0, freq: 'รายปี' },
  { id: 'p13b', g: 13, name: 'จุดความร้อนสะสม (Hotspot)', dir: -1, target: 150, freq: 'รายวัน', unit: 'จุด', dec: 0, agency: 'สำนักงานทรัพยากรธรรมชาติและสิ่งแวดล้อมจังหวัด', sim: { base: 540, now: 322 } },
  { id: 'p13c', g: 13, name: 'หมู่บ้านมีแผนรับมือภัยพิบัติ', dir: 1, target: 100, freq: 'รายปี', unit: 'ร้อยละ', dec: 0, agency: 'สำนักงานป้องกันและบรรเทาสาธารณภัยจังหวัด', sim: { base: 35, now: 57 } },

  { id: 'p14a', g: 14, name: 'ผลผลิตประมงน้ำจืด', dir: 1, target: 7500, freq: 'รายปี', unit: 'ตัน', dec: 0, agency: 'สำนักงานประมงจังหวัด', sim: { base: 5200, now: 6140 } },
  { id: 'p14b', g: 14, name: 'คุณภาพน้ำผิวดิน (WQI) ลำน้ำพะเนียง', dir: 1, target: 80, freq: 'รายไตรมาส', unit: 'คะแนน', dec: 0, agency: 'สำนักงานสิ่งแวดล้อมภาคที่ 9', sim: { base: 58, now: 64 } },

  { id: 'p15a', g: 15, name: 'พื้นที่ป่าไม้ของจังหวัด', dir: 1, target: 330000, freq: 'รายปี' },
  { id: 'p15b', g: 15, name: 'อัตราการเปลี่ยนแปลงพื้นที่ป่าไม้', dir: 1, target: 1, freq: 'รายปี' },
  { id: 'p15c', g: 15, name: 'พื้นที่ป่าและที่สาธารณะที่ทวงคืนได้', dir: 1, target: 3000, freq: 'รายเดือน', unit: 'ไร่', dec: 0, agency: 'สำนักงานจังหวัด / ทสจ.', sim: { base: 180, now: 1260 } },

  { id: 'p16a', g: 16, name: 'ผู้ต้องหาคดียาเสพติด', dir: -1, target: 1200, freq: 'รายปี' },
  { id: 'p16b', g: 16, name: 'คดีประทุษร้ายต่อทรัพย์', dir: -1, target: 200, freq: 'รายปี' },
  { id: 'p16c', g: 16, name: 'คดีเกี่ยวกับชีวิต ร่างกาย และเพศ', dir: -1, target: 80, freq: 'รายปี' },
  { id: 'p16d', g: 16, name: 'จำนวนเหยื่อการค้ามนุษย์', dir: -1, target: 0, freq: 'รายปี' },
  { id: 'p16e', g: 16, name: 'หน่วยงานผ่านเกณฑ์ ITA', dir: 1, target: 100, freq: 'รายปี', unit: 'ร้อยละ', dec: 0, agency: 'สำนักงานจังหวัด', sim: { base: 72, now: 86 } },

  { id: 'p17a', g: 17, name: 'ร้อยละการเบิกจ่ายงบประมาณภาพรวม', dir: 1, target: 100, freq: 'รายเดือน' },
  { id: 'p17b', g: 17, name: 'เม็ดเงินงบประมาณที่เบิกจ่ายลงพื้นที่', dir: 1, target: 6000, freq: 'รายเดือน' },
  { id: 'p17c', g: 17, name: 'ชุดข้อมูลเปิดบนบัญชีข้อมูลจังหวัด', dir: 1, target: 600, freq: 'รายเดือน', unit: 'ชุดข้อมูล', dec: 0, agency: 'สำนักงานสถิติจังหวัด', sim: { base: 120, now: 342 } },
  { id: 'p17d', g: 17, name: 'หน่วยงานที่ส่งข้อมูลเข้าแดชบอร์ด', dir: 1, target: 40, freq: 'รายเดือน', unit: 'หน่วยงาน', dec: 0, agency: 'สำนักงานสถิติจังหวัด', sim: { base: 2, now: 9 } }
];

/* ───────── ประกอบชุดข้อมูล ───────── */
function _rnd(seed) { let x = seed >>> 0; return () => { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }
const SIM_YEARS = [2565, 2566, 2567, 2568, 2569];

const INDICATORS = IND_SPEC.map((sp, i) => {
  const R = (typeof REAL_DATA !== 'undefined' && REAL_DATA[sp.id]) || null;
  const x = Object.assign({ dec: 2, unit: '', agency: '', note: '', ptype: 'year' }, sp);
  if (R) {
    Object.assign(x, { unit: R.unit, dec: R.dec, agency: R.agency, src: R.src, note: R.note || '', ptype: R.ptype,
      series: R.series.map(([p, v]) => ({ p, v })), dist: R.dist, dperiod: R.dperiod, real: true });
  } else if (sp.fixSeries) {
    Object.assign(x, { src: sp.fixSeries.src, ptype: sp.fixSeries.ptype || 'year',
      series: sp.fixSeries.s.map(([p, v]) => ({ p, v })), dist: null, real: true });
  } else if (sp.fix) {
    Object.assign(x, { src: sp.fix.src, series: [{ p: sp.fix.p, v: sp.fix.v }], dist: null, real: true });
  } else {
    const s = sp.sim, R2 = _rnd(7000 + i * 131), dec = sp.dec ?? 2;
    const series = SIM_YEARS.map((y, k, a) => {
      const t = k / (a.length - 1);
      const jit = k === 0 || k === a.length - 1 ? 0 : (R2() - .5) * Math.abs(s.now - s.base) * .3;
      return { p: String(y), v: +(s.base + (s.now - s.base) * t + jit).toFixed(dec) };
    });
    const last = series[series.length - 1].v, rate = /ร้อยละ|%|ต่อ|คะแนน|กก\.|µg|บาท\/คน/.test(sp.unit || '');
    const dist = {};
    DISTRICTS.forEach(d => {
      const v = rate ? last * (1 + (R2() - .5) * .3) : last * d.w * (1 + (R2() - .5) * .25);
      dist[d.code] = +v.toFixed(dec);
    });
    Object.assign(x, { src: 'ข้อมูลจำลองเพื่อวางโครงระบบ — รอข้อมูลจริงจาก ' + sp.agency, series, dist,
      dperiod: String(SIM_YEARS[SIM_YEARS.length - 1]), real: false });
  }
  x.value = x.series.length ? x.series[x.series.length - 1].v : null;
  x.period = x.series.length ? x.series[x.series.length - 1].p : '';
  if (sp.base == null) x.base = x.series.length ? x.series[0].v : 0;
  const by = +String(x.series[0] ? x.series[0].p : '').replace(/\D/g, '').slice(-4);
  x.baseYear = by >= 2500 ? by : SDG_CFG.baseYear;
  return x;
});
const IND_BY_ID = Object.fromEntries(INDICATORS.map(x => [x.id, x]));
