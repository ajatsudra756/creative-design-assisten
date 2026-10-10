# Creative Design System Assistant

Alat multifungsi untuk desainer kreatif — "pisau Swiss Army" untuk kebutuhan desain industri kreatif. Masukkan informasi proyek, lalu sistem menghasilkan palet warna, tipografi & rasio font, sistem komposisi/layout, referensi desain + ide segar anti-mainstream, aturan desain khusus proyek, panduan implementasi praktis, dan asisten desain interaktif.

## Fitur

- **Input proyek lengkap:** Nama & deskripsi proyek, target audiens & industri, mood & emosi desain, referensi visual/inspirasi.
- **Gaya desain:** Minimalis, Maksimalis, Ekspresionis.
- **Medium output:** Digital, Print, atau Keduanya.
- **Jumlah warna palet:** 2–8 (slider).
- **Output otomatis & koheren:**
  - Palet warna (dengan peran, HEX, HSL, catatan kontras WCAG, warna teks terbaca).
  - Tipografi & skala modular (rasio font, line-height, tracking, bobot).
  - Sistem komposisi & layout (grid, whitespace, radius, rhythm, titik fokus, skala spacing).
  - Referensi desain, moodboard, dan ide segar anti-mainstream.
  - Aturan & prinsip desain khusus proyek (lakukan / hindari).
  - Panduan implementasi praktis + design tokens (CSS) siap salin.
  - Asisten desain interaktif (FAQ berbasis sistem yang dihasilkan).

Mesin generator bersifat **deterministik**: input yang sama menghasilkan sistem desain yang sama, dan tidak memerlukan API key atau koneksi internet.

## Teknologi

React 18 + Vite 6 + Tailwind CSS 3.

## Menjalankan

```bash
npm install        # pasang dependensi
npm run dev        # mode pengembangan (http://localhost:5173)
npm run build      # build produksi ke folder dist/
npm run preview    # pratinjau hasil build
```

> Catatan Windows/PowerShell: jika `npm` diblokir oleh execution policy, jalankan lewat Node secara langsung, mis.
> `node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install`.

## Struktur

```
src/
  App.jsx                 # layout utama + state
  main.jsx                # entry React
  index.css               # Tailwind + komponen utilitas
  lib/
    color.js              # util warna (HSL↔HEX, kontras, teks terbaca)
    generator.js          # mesin generator sistem desain (deterministik)
  components/
    InputPanel.jsx        # form input proyek
    ResultPanel.jsx       # 7 bagian output
    EmptyState.jsx        # placeholder sebelum generate
    Section.jsx           # pembungkus kartu bagian
    CopyButton.jsx        # tombol salin (dengan fallback)
    Icons.jsx             # ikon SVG inline
```
