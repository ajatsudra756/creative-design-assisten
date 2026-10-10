import Section from './Section.jsx'
import CopyButton from './CopyButton.jsx'
import {
  Palette,
  TypeIcon,
  Grid,
  Lightbulb,
  Shield,
  Wrench,
  Chat,
} from './Icons.jsx'

function Swatch({ c }) {
  return (
    <div className="group overflow-hidden rounded-xl border border-white/10">
      <div
        className="relative flex h-24 items-end p-2.5"
        style={{ backgroundColor: c.hex, color: c.text }}
      >
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
          {c.role}
        </span>
        <div className="absolute right-2 top-2 opacity-0 transition group-hover:opacity-100">
          <CopyButton value={c.hex} label={c.hex} />
        </div>
      </div>
      <div className="space-y-0.5 bg-ink-900/60 p-2.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs text-slate-200">{c.hex}</span>
        </div>
        {c.hsl && <span className="block font-mono text-[10px] text-slate-500">{c.hsl}</span>}
        <p className="text-[11px] leading-snug text-slate-400">{c.usage}</p>
      </div>
    </div>
  )
}

export default function ResultPanel({ data }) {
  const { palette, typography, layout, references, rules, implementation, assistant } = data

  return (
    <div className="space-y-5">
      {/* PALETTE */}
      <Section
        icon={Palette}
        title="Palet Warna Utama"
        actions={
          <CopyButton
            value={[...palette.colors, ...palette.neutrals].map((c) => `${c.role}: ${c.hex}`).join('\n')}
            label="Salin semua"
          />
        }
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {palette.colors.map((c, i) => (
            <Swatch key={i} c={c} />
          ))}
          {palette.neutrals.map((c, i) => (
            <Swatch key={`n${i}`} c={c} />
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Harmoni warna: <span className="text-slate-200 capitalize">{palette.harmony}</span>.{' '}
          {palette.contrastNote}
        </p>
      </Section>

      {/* TYPOGRAPHY */}
      <Section icon={TypeIcon} title="Tipografi & Rasio Font">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-ink-900/40 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Judul</p>
            <p className="font-display text-2xl text-white">{typography.pair.heading}</p>
            <p className="mt-1 text-xs text-slate-400">{typography.pair.vibe}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500">Isi Teks</p>
            <p className="text-lg text-slate-100">{typography.pair.body}</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-ink-900/40 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-500">Skala Modular</p>
            <p className="text-white">{typography.ratioLabel}</p>
            <ul className="mt-2 space-y-1">
              {typography.scale.map((s) => (
                <li key={s.name} className="flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-400">{s.name}</span>
                  <span className="font-mono text-slate-200">
                    {s.px}px / {s.rem}rem
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
          <span className="pill">Line-height judul {typography.lineHeights.heading}</span>
          <span className="pill">Line-height body {typography.lineHeights.body}</span>
          <span className="pill">Tracking judul {typography.tracking.heading}</span>
          <span className="pill">Bobot {typography.weights.join(' / ')}</span>
        </div>
      </Section>

      {/* LAYOUT */}
      <Section icon={Grid} title="Sistem Komposisi & Layout">
        <div className="grid gap-3 sm:grid-cols-2">
          <Info label="Grid" value={layout.grid} />
          <Info label="Grid (medium)" value={layout.gridMedium} />
          <Info label="Whitespace" value={layout.whitespace} />
          <Info label="Radius sudut" value={layout.radius} />
          <Info label="Rhythm" value={layout.rhythm} />
          <Info label="Titik fokus" value={layout.focalPoint} />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
            Skala spacing (base {layout.spacingBase}px)
          </p>
          <div className="flex flex-wrap items-end gap-2">
            {layout.spacingScale.map((s, i) => (
              <div key={i} className="text-center">
                <div
                  className="mx-auto rounded bg-accent/40"
                  style={{ width: 10, height: Math.max(4, s) }}
                />
                <span className="mt-1 block font-mono text-[10px] text-slate-500">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* REFERENCES & FRESH IDEAS */}
      <Section icon={Lightbulb} title="Referensi Desain & Kombinasi Ide Segar">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              Gerakan / Aliran Rujukan
            </p>
            <div className="flex flex-wrap gap-2">
              {references.movements.map((m) => (
                <span key={m} className="pill">
                  {m}
                </span>
              ))}
            </div>
            <p className="mb-2 mt-4 text-xs uppercase tracking-wide text-slate-500">Moodboard</p>
            <ul className="space-y-1.5">
              {references.moodboard.map((m) => (
                <li key={m} className="flex gap-2 text-sm text-slate-300">
                  <span className="text-accent-soft">•</span>
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
              Ide Segar Anti-Mainstream
            </p>
            <ul className="space-y-2">
              {references.freshIdeas.map((idea, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-white/10 bg-ink-900/40 p-3 text-sm text-slate-200"
                >
                  {idea}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3 text-sm text-slate-100">
          <span className="font-semibold text-accent-soft">Pakem anti-mainstream: </span>
          {references.antiMainstream}
        </div>
      </Section>

      {/* RULES */}
      <Section icon={Shield} title="Aturan & Prinsip Desain Khusus Proyek">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-emerald-400/80">Lakukan</p>
            <ul className="space-y-2">
              {rules.rules.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-200">
                  <span className="text-emerald-400">✓</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wide text-rose-400/80">Hindari</p>
            <ul className="space-y-2">
              {rules.donts.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-200">
                  <span className="text-rose-400">✕</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* IMPLEMENTATION */}
      <Section icon={Wrench} title="Panduan Implementasi Praktis">
        <p className="text-sm text-slate-300">{implementation.colorSpaceNote}</p>
        <ol className="mt-3 space-y-2">
          {implementation.steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm text-slate-200">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs font-semibold text-accent-soft">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>

        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">Deliverables</p>
          <div className="flex flex-wrap gap-2">
            {implementation.deliverables.map((d) => (
              <span key={d} className="pill">
                {d}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs uppercase tracking-wide text-slate-500">Design Tokens (CSS)</p>
            <CopyButton value={implementation.cssVars} label="Salin CSS" />
          </div>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-ink-900/70 p-3 font-mono text-xs leading-relaxed text-slate-300">
            {implementation.cssVars}
          </pre>
        </div>
      </Section>

      {/* ASSISTANT */}
      <Section icon={Chat} title="Asisten Desain Interaktif">
        <p className="mb-3 text-sm text-slate-400">
          Pertanyaan umum yang dijawab berdasarkan sistem desain yang baru dibuat:
        </p>
        <div className="space-y-2">
          {assistant.faqs.map((f, i) => (
            <details
              key={i}
              className="group rounded-xl border border-white/10 bg-ink-900/40 p-3 open:bg-ink-900/70"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-slate-100 marker:hidden">
                <span className="mr-2 text-accent-soft group-open:rotate-90 inline-block transition">
                  ›
                </span>
                {f.q}
              </summary>
              <p className="mt-2 pl-5 text-sm leading-relaxed text-slate-300">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-ink-900/40 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{value}</p>
    </div>
  )
}
