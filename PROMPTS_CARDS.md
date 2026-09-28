# Prompt ทำพื้นหลังการ์ด SDGs — แบบที่ไม่บังตัวเลข

ไฟล์ที่ได้ให้ตั้งชื่อ `sdg-01.webp` … `sdg-17.webp` แล้ววางใน `assets/card/`
ระบบจะดึงไปใช้เองทั้งการ์ดหน้าปก การ์ดตัวชี้วัด และหัวหน้าเป้าหมาย ถ้ายังไม่มีไฟล์ การ์ดก็ยังสวยอยู่ (ใช้ลายน้ำไอคอนแทน)

**ทำไมถึงไม่บังตัวเลข** — โค้ดบังคับไว้ 3 ชั้นแล้ว: ภาพถูกจำกัดให้อยู่ครึ่งขวา, ถูกเฟดหายไปทางซ้ายด้วย mask,
และถูกลดความทึบเหลือ 16% (โหมดมืด 26%) ตัวเลขจึงลอยอยู่เหนือภาพเสมอ
หน้าที่ของ prompt คือทำให้ภาพ "เงียบพอ" ที่จะอยู่หลังตัวเลขได้อย่างสวยงาม

---

## 1) Style lock — วางครั้งเดียวตอนเปิดแชตใหม่

```
For this whole session you are producing background plates for a Thai provincial
government data dashboard. Every image must follow these rules:

COMPOSITION
- 16:10 landscape, 1600x1000 px.
- The subject sits in the RIGHT third of the frame and fades toward the middle.
- The LEFT 55% of the frame is nearly empty: flat tone, no detail, no horizon line,
  no texture that could compete with white or dark text placed over it.
- No object crosses the vertical centre line.

TONE
- Very low contrast, soft, hazy. No deep blacks, no pure whites.
- One dominant hue only, tinted toward {COLOR}. Everything else desaturated.
- Even, diffuse light. No hard shadows, no lens flare, no vignette.

STYLE
- Editorial illustration with soft realism, like a national statistics annual report.
- Setting is Nong Bua Lam Phu province, northeastern Thailand: lotus ponds, rice and
  sugarcane fields, red laterite soil, the forested Phu Kao–Phu Phan Kham ridges.

NEVER
- No text, letters, numbers, charts, logos, watermarks, UN SDG icons.
- No people looking at the camera, no recognisable faces.
- No busy patterns, no confetti, no gradients with banding.
```

---

## 2) Prompt รายเป้าหมาย

วางทีละอัน ต่อท้าย style lock · ประโยคแรกของทุกอันคือ `Background plate, {COLOR} tint.`

| ไฟล์ | Prompt |
|---|---|
| `sdg-01.webp` | Background plate, deep red tint (#E5243B). Right side: a modest Isan house on stilts with a small vegetable plot and a bicycle leaning on a post, seen from a distance in morning haze. Left side: empty pale field. |
| `sdg-02.webp` | Background plate, golden tint (#DDA63A). Right side: ripe rice stalks bending, a woven sticky-rice basket resting on the ground. Left side: soft out-of-focus paddy. |
| `sdg-03.webp` | Background plate, green tint (#4C9F38). Right side: a small sub-district health station with a motorcycle ambulance parked under a tree, early light. Left side: empty road surface fading to haze. |
| `sdg-04.webp` | Background plate, crimson tint (#C5192D). Right side: a rural school corridor with open classroom shutters and a flagpole, seen from the yard. Left side: empty schoolyard sand. |
| `sdg-05.webp` | Background plate, warm red-orange tint (#FF3A21). Right side: two farmers' hands, one woman's one man's, planting the same seedling. Left side: plain tilled soil. |
| `sdg-06.webp` | Background plate, sky blue tint (#26BDE2). Right side: a village water tower and a clean tap over a concrete basin, water catching light. Left side: empty pale sky. |
| `sdg-07.webp` | Background plate, yellow tint (#FCC30B). Right side: a row of solar panels feeding a farm water pump beside a pond. Left side: flat open field under hazy sun. |
| `sdg-08.webp` | Background plate, maroon tint (#A21942). Right side: a community weaving workshop, loom and stacked bolts of Isan cotton. Left side: dim empty wall. |
| `sdg-09.webp` | Background plate, orange tint (#FD6925). Right side: a small agricultural processing plant and a fibre-optic pole beside a new rural road. Left side: empty asphalt fading out. |
| `sdg-10.webp` | Background plate, magenta tint (#DD1367). Right side: a simple bamboo balance scale hanging still, and a wheelchair ramp at a village pavilion. Left side: plain shaded floor. |
| `sdg-11.webp` | Background plate, amber tint (#FD9D24). Right side: a tidy district town street with shophouses, street trees and sorted waste bins. Left side: empty pavement in soft haze. |
| `sdg-12.webp` | Background plate, ochre tint (#BF8B2E). Right side: local OTOP goods — woven cloth, a clay jar, vegetables in a reusable basket on a market table. Left side: plain table surface. |
| `sdg-13.webp` | Background plate, forest green tint (#3F7E44). Right side: a paddy field split between cracked dry soil and the first rain, dark clouds building above. Left side: flat empty sky. |
| `sdg-14.webp` | Background plate, blue tint (#0A97D9). Right side: a freshwater reservoir with lotus leaves, a small fishing boat and a cast net drying. Left side: still water surface, no detail. |
| `sdg-15.webp` | Background plate, leaf green tint (#56C02B). Right side: the forested limestone ridge of Phu Kao seen across young trees. Left side: empty misty valley. |
| `sdg-16.webp` | Background plate, deep blue tint (#00689D). Right side: a village pavilion where a community meeting is set up — empty chairs in a circle, a dove passing above. Left side: plain concrete floor. |
| `sdg-17.webp` | Background plate, navy tint (#19486A). Right side: abstract thin threads of light connecting small nodes over a faint terrain of a province. Left side: deep empty field of colour. |

---

## 3) ตรวจก่อนอัปโหลด (30 วินาที)

1. ปิดตาข้างหนึ่ง มองครึ่งซ้ายของภาพ — ถ้ายังเห็น "ของ" อยู่ ให้สั่งซ้ำว่า `keep the left 55% completely empty and flat`
2. ถ้าภาพจัดเกินไป: `reduce contrast by half, lighter overall, more haze`
3. ถ้าสีเพี้ยนจากสีเป้าหมาย: `push the whole image toward {HEX}, desaturate everything else`
4. ย่อเป็น **1600×1000 และแปลงเป็น .webp คุณภาพ 78** ไฟล์ไม่ควรเกิน 180 KB ต่อใบ
   (17 ใบรวมแล้วควรต่ำกว่า 3 MB เพื่อให้หน้าปกเปิดเร็วบนมือถือ)

## 4) ถ้าอยากได้ชุดพื้นหลังใหญ่ด้วย

- หัวหน้าเป้าหมาย ใช้ไฟล์ชุดเดียวกันนี้ได้เลย ระบบดึง `assets/card/sdg-XX.webp` ไปวางเป็นแบ็กกราวด์แถบหัวให้อัตโนมัติ
- พื้นหลังหน้าปกและแบนเนอร์ 5P อยู่ในไฟล์ `PROMPTS.md` (ชุดเดิม) ใช้ style lock เดียวกันได้
