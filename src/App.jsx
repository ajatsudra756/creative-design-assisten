import { useMemo, useState } from 'react'
import InputPanel from './components/InputPanel.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import EmptyState from './components/EmptyState.jsx'
import { Spark } from './components/Icons.jsx'
import { generateDesignSystem } from './lib/generator.js'

const INITIAL_FORM = {
  projectName: '',
  projectDesc: '',
  audience: '',
  mood: '',
  references: '',
  style: 'minimalis',
  medium: 'keduanya',
  paletteCount: 5,
}

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [input, setInput] = useState(null) // the submitted snapshot that drives output

  // Require the four free-text fields before generating (matches the brief).
  const canGenerate =
    (form.projectName.trim() || form.projectDesc.trim()) &&
    form.audience.trim() &&
    form.mood.trim() &&
    form.references.trim()

  const result = useMemo(() => (input ? generateDesignSystem(input) : null), [input])

  const handleGenerate = () => setInput({ ...form })
  const handleReset = () => {
    setForm(INITIAL_FORM)
    setInput(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-ink-900/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-white shadow-glow">
              <Spark width={18} height={18} />
            </span>
            <div className="leading-tight">
              <p className="font-display text-sm font-semibold text-white">
                Creative Design System Assistant
              </p>
              <p className="text-[11px] text-slate-400">Pisau Swiss Army untuk industri kreatif</p>
            </div>
          </div>
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/Accessibility/Understanding_WCAG"
            target="_blank"
            rel="noreferrer"
            className="hidden text-xs text-slate-400 transition hover:text-slate-200 sm:block"
          >
            Kontras mengikuti WCAG
          </a>
        </div>
      </header>

      {/* Intro / hero */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="max-w-3xl">
          <span className="pill mb-4">
            <Spark width={14} height={14} /> AI Design Toolkit
          </span>
          <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
            Selamat datang di Creative Industry Design Assistant
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-400">
            Alat multifungsi untuk desainer kreatif. Tentukan palet warna, komposisi, rasio font,
            layout, referensi desain, dan kombinasi ide segar yang anti-mainstream. Masukkan
            informasi proyek Anda dan biarkan sistem bekerja seperti pisau Swiss Army untuk
            kebutuhan desain industri kreatif Anda.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[380px_1fr]">
        {/* Sticky input on large screens */}
        <div className="lg:sticky lg:top-[72px] lg:self-start">
          <InputPanel
            form={form}
            setForm={setForm}
            onGenerate={handleGenerate}
            onReset={handleReset}
            canGenerate={Boolean(canGenerate)}
          />
        </div>

        {/* Output */}
        <div>{result ? <ResultPanel data={result} /> : <EmptyState />}</div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 pb-10 pt-4 text-center text-xs text-slate-600 sm:px-6">
        Dibuat sebagai alat bantu kreatif. Output bersifat deterministik berdasarkan input proyek
        Anda — ubah input untuk mengeksplorasi arah desain baru.
      </footer>
    </div>
  )
}
