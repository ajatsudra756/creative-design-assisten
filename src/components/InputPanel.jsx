import { Spark, Refresh } from './Icons.jsx'

const STYLES = [
  { id: 'minimalis', label: 'Minimalis', desc: 'Bersih, lega, presisi' },
  { id: 'maksimalis', label: 'Maksimalis', desc: 'Padat, berani, berlapis' },
  { id: 'ekspresionis', label: 'Ekspresionis', desc: 'Emosional, dinamis' },
]

const MEDIUMS = [
  { id: 'digital', label: 'Digital' },
  { id: 'print', label: 'Print' },
  { id: 'keduanya', label: 'Keduanya' },
]

export default function InputPanel({ form, setForm, onGenerate, onReset, canGenerate }) {
  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (canGenerate) onGenerate()
      }}
      className="card p-5 sm:p-6 space-y-5"
    >
      <div>
        <label className="label" htmlFor="projectName">
          Nama Proyek
        </label>
        <input
          id="projectName"
          className="field"
          placeholder="Mis. NOVA — streetwear lokal Gen-Z"
          value={form.projectName}
          onChange={update('projectName')}
        />
      </div>

      <div>
        <label className="label" htmlFor="projectDesc">
          Deskripsi Proyek
        </label>
        <textarea
          id="projectDesc"
          rows={3}
          className="field resize-none"
          placeholder="Contoh: Brand fashion streetwear lokal untuk Gen-Z, tone edgy dan futuristik..."
          value={form.projectDesc}
          onChange={update('projectDesc')}
        />
      </div>

      <div>
        <label className="label" htmlFor="audience">
          Target Audiens & Industri
        </label>
        <textarea
          id="audience"
          rows={2}
          className="field resize-none"
          placeholder="Contoh: Usia 18–25, industri musik indie, urban lifestyle..."
          value={form.audience}
          onChange={update('audience')}
        />
      </div>

      <div>
        <label className="label" htmlFor="mood">
          Mood & Emosi Desain
        </label>
        <input
          id="mood"
          className="field"
          placeholder="Contoh: Bold, rebellious, optimistik, mysterious, playful..."
          value={form.mood}
          onChange={update('mood')}
        />
      </div>

      <div>
        <label className="label" htmlFor="references">
          Referensi Visual / Inspirasi
        </label>
        <input
          id="references"
          className="field"
          placeholder="Contoh: Bauhaus, Brutalism, Memphis Group, Y2K, Wabi-Sabi..."
          value={form.references}
          onChange={update('references')}
        />
      </div>

      {/* Style selector */}
      <div>
        <span className="label">Gaya Desain Utama</span>
        <div className="grid grid-cols-3 gap-2">
          {STYLES.map((s) => {
            const active = form.style === s.id
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, style: s.id }))}
                className={`rounded-xl border px-3 py-2.5 text-left transition ${
                  active
                    ? 'border-accent/70 bg-accent/15 ring-2 ring-accent/30'
                    : 'border-white/10 bg-ink-900/40 hover:border-white/20'
                }`}
              >
                <span className="block text-sm font-semibold text-white">{s.label}</span>
                <span className="block text-[11px] text-slate-400 leading-tight mt-0.5">
                  {s.desc}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Medium selector */}
      <div>
        <span className="label">Medium Output Desain</span>
        <div className="grid grid-cols-3 gap-2">
          {MEDIUMS.map((m) => {
            const active = form.medium === m.id
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, medium: m.id }))}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'border-accent/70 bg-accent/15 text-white ring-2 ring-accent/30'
                    : 'border-white/10 bg-ink-900/40 text-slate-300 hover:border-white/20'
                }`}
              >
                {m.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Palette count */}
      <div>
        <div className="flex items-center justify-between">
          <span className="label mb-0">Jumlah Warna dalam Palet</span>
          <span className="pill">{form.paletteCount} warna</span>
        </div>
        <input
          type="range"
          min={2}
          max={8}
          step={1}
          value={form.paletteCount}
          onChange={(e) => setForm((f) => ({ ...f, paletteCount: Number(e.target.value) }))}
          className="mt-3 w-full accent-accent"
          aria-label="Jumlah warna dalam palet"
        />
        <div className="mt-1 flex justify-between text-[10px] text-slate-500">
          {[2, 3, 4, 5, 6, 7, 8].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" className="btn-primary flex-1" disabled={!canGenerate}>
          <Spark width={18} height={18} />
          Generate Design System
        </button>
        <button type="button" className="btn-ghost" onClick={onReset} aria-label="Reset">
          <Refresh width={16} height={16} />
        </button>
      </div>

      {!canGenerate && (
        <p className="text-xs text-slate-500 text-center">
          Isi minimal Nama/Deskripsi Proyek, Audiens, Mood, dan Referensi untuk menghasilkan konten.
        </p>
      )}
    </form>
  )
}
