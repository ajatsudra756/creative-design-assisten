// Deterministic Creative Design System generator.
// Same inputs -> same coherent output. No external API required.

import { hslToHex, readableTextColor, contrastRatio } from './color.js'

/* ------------------------------------------------------------------ */
/* Seeded pseudo-randomness (deterministic from the project input)     */
/* ------------------------------------------------------------------ */

function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function makeRng(input) {
  const key = [
    input.projectName,
    input.projectDesc,
    input.audience,
    input.mood,
    input.references,
    input.style,
    input.medium,
    String(input.paletteCount),
  ].join('|')
  const rand = mulberry32(hashString(key))
  return {
    next: rand,
    int: (min, max) => Math.floor(rand() * (max - min + 1)) + min,
    pick: (arr) => arr[Math.floor(rand() * arr.length)],
    pickMany: (arr, n) => {
      const copy = [...arr]
      const out = []
      while (out.length < n && copy.length) {
        out.push(copy.splice(Math.floor(rand() * copy.length), 1)[0])
      }
      return out
    },
  }
}

/* ------------------------------------------------------------------ */
/* Keyword analysis of the free-text inputs                            */
/* ------------------------------------------------------------------ */

const MOOD_HUE = [
  { keys: ['bold', 'rebel', 'edgy', 'energi', 'berani', 'kuat'], hue: 352, sat: 78 },
  { keys: ['optimis', 'ceria', 'happy', 'playful', 'fun', 'cerah'], hue: 42, sat: 92 },
  { keys: ['tenang', 'calm', 'natural', 'organic', 'wabi', 'earth', 'eco'], hue: 120, sat: 38 },
  { keys: ['futuris', 'tech', 'cyber', 'digital', 'neon', 'y2k'], hue: 268, sat: 85 },
  { keys: ['mewah', 'luxury', 'elegan', 'premium', 'eksklusif', 'gold'], hue: 38, sat: 55 },
  { keys: ['misteri', 'mysterious', 'dark', 'gelap', 'noir', 'gothic'], hue: 255, sat: 42 },
  { keys: ['lembut', 'soft', 'feminin', 'pastel', 'manis', 'romantis'], hue: 330, sat: 60 },
  { keys: ['korpor', 'profesional', 'trust', 'finance', 'bank', 'biru'], hue: 212, sat: 72 },
  { keys: ['segar', 'fresh', 'muda', 'youth', 'sporty', 'aktif'], hue: 170, sat: 70 },
]

const STYLE_PRESETS = {
  minimalis: {
    label: 'Minimalis',
    satShift: -22,
    lightBase: 52,
    harmony: 'analogous',
    neutralHeavy: true,
    radius: 'kecil (2–8px) & presisi',
    whitespace: 'sangat lega (40–60%)',
    contrast: 'tinggi via value, bukan jumlah warna',
  },
  maksimalis: {
    label: 'Maksimalis',
    satShift: 16,
    lightBase: 55,
    harmony: 'tetradic',
    neutralHeavy: false,
    radius: 'campuran berani (0px tajam + 24px bulat)',
    whitespace: 'padat & berlapis (10–20%)',
    contrast: 'tabrak warna & pola, saturasi tinggi',
  },
  ekspresionis: {
    label: 'Ekspresionis',
    satShift: 6,
    lightBase: 50,
    harmony: 'triadic',
    neutralHeavy: false,
    radius: 'organik & tidak simetris',
    whitespace: 'dinamis mengikuti gestur (20–35%)',
    contrast: 'emosional, kontras value dramatis',
  },
}

const MEDIUM_PRESETS = {
  digital: {
    label: 'Digital',
    space: 'RGB / sRGB',
    note: 'Optimalkan untuk layar: gunakan px/rem, kontras WCAG, dan dark/light mode.',
    grid: 'Grid 12 kolom responsif, gutter 24px, breakpoint 640/768/1024/1280.',
  },
  print: {
    label: 'Print',
    space: 'CMYK + spot color',
    note: 'Sertakan bleed 3mm, resolusi 300dpi, dan profil warna ISO Coated.',
    grid: 'Grid baseline tipografi + margin optik, kolom modular untuk editorial.',
  },
  keduanya: {
    label: 'Digital & Print',
    space: 'RGB utama, konversi CMYK terkontrol',
    note: 'Jaga konsistensi warna lintas media dengan pin HEX→CMYK terdokumentasi.',
    grid: 'Grid modular tunggal yang di-mapping ke 12 kolom (digital) & baseline (print).',
  },
}

function detectMood(text) {
  const t = (text || '').toLowerCase()
  const hits = MOOD_HUE.filter((m) => m.keys.some((k) => t.includes(k)))
  if (hits.length) return hits
  return [{ keys: [], hue: 230, sat: 60 }]
}

/* ------------------------------------------------------------------ */
/* Palette generation                                                  */
/* ------------------------------------------------------------------ */

const PALETTE_ROLES = [
  'Primary',
  'Secondary',
  'Accent',
  'Supporting',
  'Highlight',
  'Deep',
  'Surface',
  'Contrast',
]

function buildPalette(input, rng) {
  const style = STYLE_PRESETS[input.style] || STYLE_PRESETS.minimalis
  const moods = detectMood(`${input.mood} ${input.references} ${input.projectDesc}`)
  const base = rng.pick(moods)
  const count = Math.max(2, Math.min(8, input.paletteCount || 5))

  const baseHue = (base.hue + rng.int(-12, 12) + 360) % 360
  const baseSat = clampN(base.sat + style.satShift + rng.int(-6, 6), 20, 96)

  const harmonyOffsets = {
    analogous: [0, 28, -24, 52, -46, 14, -12, 70],
    triadic: [0, 120, 240, 60, 180, 300, 30, 210],
    tetradic: [0, 90, 180, 270, 45, 135, 225, 315],
  }
  const offsets = harmonyOffsets[style.harmony] || harmonyOffsets.analogous

  const colors = []
  for (let i = 0; i < count; i++) {
    const hue = (baseHue + offsets[i % offsets.length]) % 360
    // Vary lightness across the ramp for a usable value scale.
    const spread = count > 1 ? i / (count - 1) : 0
    let light = style.lightBase + (spread - 0.5) * 46
    let sat = baseSat
    if (style.neutralHeavy && i > 0 && i % 2 === 0) {
      sat = clampN(sat * 0.28, 6, 24) // injected neutral
    }
    light = clampN(light + rng.int(-4, 4), 10, 94)
    const hex = hslToHex(hue, sat, light)
    colors.push({
      role: PALETTE_ROLES[i] || `Color ${i + 1}`,
      hex,
      text: readableTextColor(hex),
      hsl: `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(light)}%)`,
      usage: paletteUsage(i, count),
    })
  }

  // Guarantee one near-neutral surface + one dark ink for real UI usage.
  const surface = hslToHex(baseHue, style.neutralHeavy ? 8 : 14, 96)
  const ink = hslToHex(baseHue, 18, 12)

  return {
    colors,
    harmony: style.harmony,
    neutrals: [
      { role: 'Surface', hex: surface, text: readableTextColor(surface), usage: 'Latar / kanvas utama' },
      { role: 'Ink', hex: ink, text: readableTextColor(ink), usage: 'Teks utama & elemen gelap' },
    ],
    contrastNote: contrastSummary(colors[0]?.hex, surface),
  }
}

function paletteUsage(i, count) {
  const map = [
    'Warna brand utama — CTA, logo, aksen dominan',
    'Pendukung utama — header, ilustrasi, blok sekunder',
    'Aksen — sorotan, badge, micro-interaction',
    'Pelengkap — background section, kartu',
    'Highlight — notifikasi, status, hover',
    'Deep tone — footer, overlay, mode gelap',
    'Surface — permukaan netral & container',
    'Kontras — garis, divider, emphasis',
  ]
  return map[i] || 'Warna pendukung tambahan'
}

function contrastSummary(fg, bg) {
  if (!fg || !bg) return ''
  const r = contrastRatio(fg, bg)
  const level = r >= 7 ? 'AAA' : r >= 4.5 ? 'AA' : r >= 3 ? 'AA Large' : 'Rendah'
  return `Rasio kontras Primary vs Surface ≈ ${r.toFixed(2)}:1 (${level}).`
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

const FONT_LIBRARY = {
  minimalis: [
    { heading: 'Space Grotesk', body: 'Inter', vibe: 'geometris bersih & netral modern' },
    { heading: 'General Sans', body: 'Inter', vibe: 'kontemporer, ramah layar' },
    { heading: 'Satoshi', body: 'IBM Plex Sans', vibe: 'presisi teknikal' },
  ],
  maksimalis: [
    { heading: 'Clash Display', body: 'Satoshi', vibe: 'display tebal berkarakter' },
    { heading: 'Bricolage Grotesque', body: 'Inter', vibe: 'eksperimental & ekspresif' },
    { heading: 'Monument Extended', body: 'Inter', vibe: 'lebar, dramatis, berani' },
  ],
  ekspresionis: [
    { heading: 'Fraunces', body: 'Work Sans', vibe: 'serif modern berjiwa' },
    { heading: 'Instrument Serif', body: 'Inter', vibe: 'editorial elegan ekspresif' },
    { heading: 'Gambetta', body: 'Satoshi', vibe: 'kontras tebal-tipis dramatis' },
  ],
}

function buildTypography(input, rng) {
  const style = input.style || 'minimalis'
  const pair = rng.pick(FONT_LIBRARY[style] || FONT_LIBRARY.minimalis)

  // Modular scale ratio tuned by style.
  const ratios = {
    minimalis: 1.25,
    ekspresionis: 1.333,
    maksimalis: 1.5,
  }
  const ratio = ratios[style] || 1.25
  const base = 16
  const steps = ['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl']
  const scale = steps.map((name, i) => {
    const exponent = i - 2 // base is index 2
    const px = Math.round(base * Math.pow(ratio, exponent) * 100) / 100
    return { name, px, rem: Math.round((px / 16) * 1000) / 1000 }
  })

  return {
    pair,
    ratio,
    ratioLabel: ratioName(ratio),
    base,
    scale,
    lineHeights: {
      heading: style === 'maksimalis' ? 1.05 : 1.15,
      body: 1.6,
      caption: 1.4,
    },
    tracking: {
      heading: style === 'minimalis' ? '-0.02em' : '-0.01em',
      body: '0em',
      caption: '0.02em',
    },
    weights: style === 'maksimalis' ? [500, 700, 900] : [400, 500, 700],
  }
}

function ratioName(r) {
  if (r === 1.25) return 'Major Third (1.250)'
  if (r === 1.333) return 'Perfect Fourth (1.333)'
  if (r === 1.5) return 'Perfect Fifth (1.500)'
  return `Custom (${r})`
}

/* ------------------------------------------------------------------ */
/* Layout & composition                                                */
/* ------------------------------------------------------------------ */

function buildLayout(input, rng) {
  const style = STYLE_PRESETS[input.style] || STYLE_PRESETS.minimalis
  const medium = MEDIUM_PRESETS[input.medium] || MEDIUM_PRESETS.digital
  const grids = {
    minimalis: '12 kolom, gutter lega, konten terpusat max-width 1120px',
    maksimalis: 'Grid pecah (broken grid) + overlap layer & elemen bleed',
    ekspresionis: 'Grid asimetris dengan titik fokus diagonal',
  }
  const spacingBase = style === 'maksimalis' ? 4 : 8
  const spacingScale = [0, 1, 2, 3, 4, 6, 8, 12, 16].map((m) => m * spacingBase)

  return {
    grid: grids[input.style] || grids.minimalis,
    gridMedium: medium.grid,
    spacingBase,
    spacingScale,
    whitespace: style.whitespace,
    radius: style.radius,
    rhythm: rng.pick([
      'Rhythm vertikal konsisten kelipatan 8 untuk ketenangan visual.',
      'Alternasi section padat & lega untuk menjaga tempo scroll.',
      'Fokus Z-pattern pada hero, F-pattern pada konten teks.',
    ]),
    focalPoint: rng.pick([
      'Letakkan elemen kunci di titik emas (±62%) bukan tengah mati.',
      'Gunakan skala kontras ekstrem antara 1 elemen hero & sisanya.',
      'Arah baca diagonal kiri-atas → kanan-bawah untuk energi.',
    ]),
    composition: style.contrast,
  }
}

/* ------------------------------------------------------------------ */
/* References & fresh anti-mainstream ideas                            */
/* ------------------------------------------------------------------ */

const MOVEMENTS = [
  'Swiss/International Typographic Style',
  'Bauhaus',
  'Brutalism',
  'Memphis Group',
  'Y2K / Frutiger Aero',
  'Wabi-Sabi',
  'Art Deco',
  'Neo-Vaporwave',
  'Constructivism Rusia',
  'Anti-design / Dadaism',
  'Risograph print aesthetic',
  'Editorial Scandinavian',
]

const FRESH_IDEAS = [
  'Gabungkan grid Swiss kaku dengan 1 elemen glitch organik sebagai "pelanggaran terencana".',
  'Pakai tipografi variable font yang beranimasi mengikuti scroll untuk storytelling.',
  'Terapkan dua-tone duotone pada foto + aksen warna neon tunggal.',
  'Gunakan tekstur grain/noise halus agar flat design terasa taktis.',
  'Buat sistem ikon kustom dari 1 bentuk geometris yang dirotasi & dipotong.',
  'Terapkan "brutalist softening": border tebal tapi radius lembut & shadow pastel.',
  'Mainkan skala ekstrem — headline raksasa dipotong tepi kanvas (bleeding type).',
  'Padukan serif editorial klasik dengan UI sans modern untuk ketegangan menarik.',
  'Gunakan palet monokrom + 1 warna "unexpected" yang hanya muncul 5% kali.',
  'Rancang motif latar generatif berbasis data proyek (seed unik tiap brand).',
]

function buildReferences(input, rng) {
  const refText = (input.references || '').toLowerCase()
  const matched = MOVEMENTS.filter((m) =>
    m.toLowerCase().split(/[^a-z]+/).some((w) => w.length > 3 && refText.includes(w))
  )
  const pool = matched.length ? MOVEMENTS.filter((m) => !matched.includes(m)) : MOVEMENTS
  const suggested = [...matched, ...rng.pickMany(pool, Math.max(0, 3 - matched.length))].slice(0, 4)

  return {
    movements: suggested,
    freshIdeas: rng.pickMany(FRESH_IDEAS, 4),
    moodboard: rng.pickMany(
      [
        'Fotografi dengan grain analog & crop berani',
        'Tekstur kertas / beton / tekstil makro',
        'Ilustrasi vektor geometris minimal',
        'Tipografi eksperimental sebagai citra utama',
        'Motion/loop pendek untuk aksen digital',
        'Pola repetitif terinspirasi arsitektur',
      ],
      4
    ),
    antiMainstream: rng.pick([
      'Hindari gradient ungu-biru generik; pilih kombinasi warna tak terduga dari industrimu.',
      'Tinggalkan layout hero-tengah klasik; coba split-screen asimetris.',
      'Jangan pakai stok ikon umum; bangun bahasa visual ikon sendiri.',
      'Lewati drop-shadow default; gunakan bayangan berwarna dari palet brand.',
    ]),
  }
}

/* ------------------------------------------------------------------ */
/* Project-specific rules                                              */
/* ------------------------------------------------------------------ */

function buildRules(input, rng, palette) {
  const style = STYLE_PRESETS[input.style] || STYLE_PRESETS.minimalis
  const primary = palette.colors[0]?.hex || '#7C5CFF'
  const rules = [
    `Warna brand utama ${primary} wajib hadir di setiap komposisi minimal sebagai 1 titik fokus.`,
    `Pertahankan whitespace ${style.whitespace} — jangan mengisi ruang hanya karena kosong.`,
    `Gunakan maksimal ${Math.min(input.paletteCount, 3)} warna dominan per layout; sisanya aksen <10%.`,
    `Radius sudut mengikuti sistem: ${style.radius}.`,
    `Semua pasangan teks/latar harus lolos kontras WCAG AA (≥4.5:1).`,
    style.neutralHeavy
      ? 'Kurangi dekorasi; biarkan tipografi & ruang yang berbicara.'
      : 'Berani melapis elemen, tetapi jaga 1 titik "istirahat" visual per layar.',
  ]
  const donts = rng.pickMany(
    [
      'Jangan meregangkan (stretch) logo atau font secara non-proporsional.',
      'Jangan mencampur lebih dari 2 keluarga font utama.',
      'Jangan memakai pure black (#000) pada latar luas — pakai Ink dari palet.',
      'Jangan menaruh teks di atas area foto tanpa overlay/kontras cukup.',
      'Jangan menggunakan efek bawaan generik (shadow default, gradient template).',
    ],
    3
  )
  return { rules, donts }
}

/* ------------------------------------------------------------------ */
/* Practical implementation                                            */
/* ------------------------------------------------------------------ */

function buildImplementation(input, rng, palette, typography) {
  const medium = MEDIUM_PRESETS[input.medium] || MEDIUM_PRESETS.digital
  const cssVars = [
    ':root {',
    ...palette.colors.map(
      (c, i) => `  --color-${(c.role || 'c' + i).toLowerCase()}: ${c.hex};`
    ),
    `  --color-surface: ${palette.neutrals[0].hex};`,
    `  --color-ink: ${palette.neutrals[1].hex};`,
    `  --font-heading: '${typography.pair.heading}', sans-serif;`,
    `  --font-body: '${typography.pair.body}', sans-serif;`,
    `  --ratio: ${typography.ratio};`,
    '}',
  ].join('\n')

  return {
    colorSpaceNote: `${medium.label} — ruang warna ${medium.space}. ${medium.note}`,
    cssVars,
    steps: [
      'Kunci token desain (warna, tipografi, spacing) sebagai variabel tunggal.',
      `Terapkan skala tipografi ${typography.ratioLabel} di seluruh heading & body.`,
      `Bangun grid: ${medium.grid}`,
      'Buat komponen inti: tombol, kartu, input, badge — selaraskan radius & spacing.',
      'Uji kontras & keterbacaan pada ukuran terkecil sebelum produksi.',
      input.medium === 'digital'
        ? 'Siapkan mode terang & gelap dari token yang sama.'
        : input.medium === 'print'
        ? 'Siapkan file cetak: bleed 3mm, 300dpi, convert ke CMYK terkontrol.'
        : 'Dokumentasikan mapping HEX→CMYK untuk konsistensi lintas media.',
    ],
    deliverables: rng.pickMany(
      [
        'Style guide 1 halaman (warna, font, spacing)',
        'Komponen UI kit (Figma / kode)',
        'Template social media & cover',
        'Logo lockup + clearspace rules',
        'Panduan fotografi & ilustrasi',
        'File master cetak siap produksi',
      ],
      4
    ),
  }
}

/* ------------------------------------------------------------------ */
/* Interactive assistant (rule-based Q&A over the generated system)    */
/* ------------------------------------------------------------------ */

function buildAssistant(input, result) {
  const name = input.projectName || 'proyek ini'
  const primary = result.palette.colors[0]
  const faqs = [
    {
      q: `Warna apa untuk tombol utama (CTA) di ${name}?`,
      a: `Gunakan ${primary.role} ${primary.hex} dengan teks ${primary.text}. Ini warna brand dominan dan paling menarik perhatian.`,
    },
    {
      q: 'Font apa untuk judul dan isi teks?',
      a: `Judul: ${result.typography.pair.heading} (${result.typography.pair.vibe}). Isi teks: ${result.typography.pair.body}. Skala ${result.typography.ratioLabel}.`,
    },
    {
      q: 'Bagaimana menjaga desain tetap terbaca?',
      a: `${result.palette.contrastNote} Pastikan setiap teks lolos WCAG AA (≥4.5:1) dan gunakan line-height body 1.6.`,
    },
    {
      q: 'Bagaimana agar tidak terlihat mainstream?',
      a: result.references.antiMainstream,
    },
    {
      q: 'Berapa banyak warna sebaiknya dipakai per layout?',
      a: `Maksimal ${Math.min(input.paletteCount, 3)} warna dominan, sisanya aksen di bawah 10% area.`,
    },
  ]
  return { faqs }
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export function generateDesignSystem(input) {
  const rng = makeRng(input)
  const palette = buildPalette(input, rng)
  const typography = buildTypography(input, rng)
  const layout = buildLayout(input, rng)
  const references = buildReferences(input, rng)
  const rules = buildRules(input, rng, palette)
  const implementation = buildImplementation(input, rng, palette, typography)

  const result = { palette, typography, layout, references, rules, implementation }
  result.assistant = buildAssistant(input, result)
  return result
}

function clampN(v, min, max) {
  return Math.max(min, Math.min(max, v))
}
