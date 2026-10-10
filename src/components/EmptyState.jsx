import {
  Palette,
  TypeIcon,
  Grid,
  Lightbulb,
  Shield,
  Wrench,
  Chat,
} from './Icons.jsx'

const PLACEHOLDERS = [
  { icon: Palette, title: 'Palet Warna Utama' },
  { icon: TypeIcon, title: 'Tipografi & Rasio Font' },
  { icon: Grid, title: 'Sistem Komposisi & Layout' },
  { icon: Lightbulb, title: 'Referensi Desain & Ide Segar' },
  { icon: Shield, title: 'Aturan & Prinsip Desain' },
  { icon: Wrench, title: 'Panduan Implementasi Praktis' },
  { icon: Chat, title: 'Asisten Desain Interaktif' },
]

export default function EmptyState() {
  return (
    <div className="space-y-3">
      {PLACEHOLDERS.map(({ icon: Icon, title }) => (
        <div key={title} className="card p-5">
          <div className="mb-3 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-slate-500">
              <Icon width={18} height={18} />
            </span>
            <h3 className="section-title text-slate-300">{title}</h3>
          </div>
          <p className="text-sm text-slate-500">
            Isi Nama & Deskripsi Proyek, Target Audiens & Industri, Mood & Emosi Desain, dan
            Referensi Visual untuk menghasilkan konten.
          </p>
          <div className="mt-3 space-y-2">
            <div className="h-2.5 w-3/4 rounded-full bg-white/5" />
            <div className="h-2.5 w-1/2 rounded-full bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  )
}
