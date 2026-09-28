# ชุด Prompt สำหรับ GPT สร้างภาพ — SDGs หนองบัวลำภู

ใช้กับ ChatGPT (สร้างภาพ) ได้ทันที · prompt เป็นภาษาอังกฤษเพราะคุมรายละเอียดภาพได้แม่นกว่า
วางไฟล์ที่ได้ตามชื่อในวงเล็บ ระบบขั้นถัดไปจะดึงไปใช้เอง

> ข้อห้ามร่วมทุกภาพ: ห้ามใช้โลโก้/ไอคอนทางการของ UN SDGs (มีเงื่อนไขการใช้งาน) · ห้ามมีตัวหนังสือในภาพ · ห้ามมีลายน้ำ

---

## 0) Style lock — วางก่อนทุก prompt (คุมให้ทั้งชุดเป็นเรื่องเดียวกัน)

```
Style lock for this whole session: editorial 3D illustration mixed with soft realism,
calm and premium, like a national statistics office annual report.
Setting: Nong Bua Lam Phu province, northeastern Thailand (Isan) — lotus ponds,
rice paddies, sugarcane fields, the forested Phu Kao–Phu Phan Kham ridges, red laterite soil.
Light: early-morning golden light with thin mist. Palette: misty sage green, deep teal,
warm rice-gold, with small accents only. Clean negative space for UI text.
No text, no letters, no numbers, no logos, no watermark, no UN SDG icons.
```

---

## 1) ภาพพื้นหลังหน้าปก

**1.1 ปกหลัก โหมดสว่าง** (`assets/bg/cover-light.webp` · 2560×1440)
```
Wide panoramic dawn view over a large lotus pond in Nong Bua Lam Phu, pink and white lotus
flowers in the foreground, rice paddies and a small Isan village with tin roofs in the
middle ground, the long forested Phu Kao ridge on the horizon under a pale mint sky.
Keep the LEFT 45% of the frame calm and empty (soft water and mist) for a large circular
data graphic. Very low contrast, airy, desaturated, 16:9, 2560x1440.
```

**1.2 ปกหลัก โหมดมืด (ห้องบัญชาการ / จอใหญ่)** (`assets/bg/cover-dark.webp`)
```
Same lotus pond composition at blue hour, deep teal night sky, faint thin glowing
contour lines floating above the water like a topographic data layer, a few village
lights in the distance. Dark, quiet, cinematic, lots of negative space on the left 45%.
16:9, 2560x1440, no text.
```

**1.3 ภาพแนวตั้งสำหรับมือถือ** (`assets/bg/cover-mobile.webp` · 1080×1920)
```
Vertical 9:16 version: a single tall lotus stem rising from misty water at dawn,
rice fields and ridge line far behind, top 55% of frame soft empty sky for UI.
```

---

## 2) แบนเนอร์กลุ่ม 5P (`assets/pillar/<id>.webp` · 1600×600)

| ไฟล์ | Prompt (ต่อท้าย style lock) |
|---|---|
| `people.webp` | `Warm documentary scene of an Isan family at a village health volunteer's porch: grandmother, mother and a schoolchild in uniform, lotus pond behind. Faces soft, natural, dignified. Wide 8:3, subject on the right third.` |
| `prosperity.webp` | `A local farmers' market at a district town in Nong Bua Lam Phu: sugarcane bundles, rice sacks, a young vendor using a phone QR payment, small agro-processing workshop in the background. Wide 8:3, subject on the right third.` |
| `planet.webp` | `Aerial view where a clear stream meets forested limestone hills near Tham Erawan, patchwork of green paddies and farm ponds with solar water pumps. Wide 8:3, calm.` |
| `peace.webp` | `A quiet district office square at morning with a community meeting under a large rain tree, officials and villagers seated together, respectful and calm. Wide 8:3, no uniforms insignia, no text.` |
| `partnership.webp` | `Abstract composition: many thin threads in soft teal and gold connecting small glowing nodes over a faint map-like terrain of a Thai province, elegant, minimal. Wide 8:3.` |

---

## 3) พื้นหลังการ์ดเป้าหมาย 17 ใบ (`assets/card/sdg-01.webp` … `sdg-17.webp` · 800×500)

ใช้ prompt แม่แบบนี้ เปลี่ยนแค่ `{COLOR}` และ `{SCENE}` · ภาพต้องจางและอยู่มุมขวาล่าง เพื่อให้ตัวเลขอ่านง่าย

```
Soft background texture for a dashboard card, 16:10. Base is almost white with a very
light wash of {COLOR}. In the lower-right third only, a small delicate line-and-shade
illustration of {SCENE}, drawn in tints of {COLOR}. Upper-left 60% completely plain.
Minimal, premium, no text, no icons.
```

| # | {COLOR} | {SCENE} |
|---|---|---|
| 1 | `#E5243B red` | a simple Isan wooden house on stilts with a small vegetable garden |
| 2 | `#DDA63A golden` | ripe rice stalks and a woven sticky-rice basket |
| 3 | `#4C9F38 green` | a sub-district health-promoting hospital building with a motorcycle ambulance |
| 4 | `#C5192D crimson` | a rural school building with a flag pole and a bicycle |
| 5 | `#FF3A21 orange-red` | two hands, a woman's and a man's, planting a seedling together |
| 6 | `#26BDE2 sky blue` | a village water tower and a clean tap |
| 7 | `#FCC30B yellow` | solar panels powering a farm water pump beside a pond |
| 8 | `#A21942 maroon` | a small workshop with a sewing machine and woven silk |
| 9 | `#FD6925 orange` | a rural concrete road with a fiber-optic pole and a small factory |
| 10 | `#DD1367 magenta` | a balanced scale made of bamboo |
| 11 | `#FD9D24 amber` | a tidy district town street with trees and waste sorting bins |
| 12 | `#BF8B2E ochre` | organic vegetables in a reusable woven basket |
| 13 | `#3F7E44 forest green` | cracked dry field on one side and rain clouds on the other |
| 14 | `#0A97D9 blue` | freshwater fish (tilapia, snakehead) in a clear reservoir with lotus leaves |
| 15 | `#56C02B leaf green` | forested limestone ridge with a hornbill |
| 16 | `#00689D deep blue` | a dove over a district office roof |
| 17 | `#19486A navy` | interlinked rings made of thin threads |

---

## 4) ไอคอน 17 เป้าหมาย (`assets/icons/sdg-01.png` … · 512×512 พื้นใส)

สร้างทีละ 4–6 ไอคอนต่อรอบ เพื่อให้สไตล์เท่ากัน

```
A set of flat line icons for a government data dashboard, one icon per image,
transparent background, 512x512. Style: 2px rounded strokes, geometric, single color
white on transparent, generous padding, consistent visual weight across the set,
subtle local Isan motifs where natural. Icons in this batch:
1) Isan stilt house (poverty) 2) rice stalk and sticky-rice basket (hunger)
3) heart with pulse line (health) 4) open book with a seedling (education)
5) two equal figures side by side (gender equality) 6) water droplet with a tap (water)
No text, no numbers, no UN logos.
```
รอบ 2: `7) sun over a solar panel 8) rising bars with a woven-silk pattern 9) cube with circuit lines 10) bamboo scale 11) small town skyline with a tree 12) circular arrows around a leaf`
รอบ 3: `13) globe with a rain cloud and sun 14) freshwater fish over lotus leaf 15) tree on a ridge 16) dove with an olive branch 17) three interlinked rings`

---

## 5) ภาพประกอบย่อย

**5.1 ภาพแชร์ลิงก์ (OG image)** (`assets/og.jpg` · 1200×630)
```
A glowing seventeen-petal lotus made of translucent colored glass floating on a calm
misty pond at dawn in northeastern Thailand, each petal a different vivid color,
petals of different lengths. Centered, deep teal background, cinematic, no text.
```

**5.2 สถานะว่าง / ยังไม่มีข้อมูล** (`assets/empty.webp` · 800×600)
```
A single closed lotus bud in a small clay pot on a wooden table, soft morning light,
lots of empty space, gentle and hopeful, pale sage background, no text.
```

**5.3 พื้นหลังจอ Kiosk / TV ห้องประชุม** (`assets/bg/kiosk.webp` · 3840×2160)
```
Ultra-wide calm dark teal gradient with an extremely faint topographic contour map of a
province and tiny scattered points of light like villages at night. Almost abstract,
designed to sit behind charts, 4K, no text.
```

---

## วิธีใช้ให้ได้ผลดี
1. เปิดแชตใหม่ วาง **Style lock** ก่อน แล้วค่อยวาง prompt ทีละภาพในแชตเดิม
2. ถ้าภาพไหนสีจัดเกินไป ต่อท้ายว่า `make it 30% more desaturated and lighter`
3. แปลงเป็น `.webp` คุณภาพ 80 ก่อนอัปขึ้น GitHub (ภาพพื้นหลังไม่ควรเกิน 400 KB)
