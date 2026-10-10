import { useState } from 'react'
import { Copy, Check } from './Icons.jsx'

export default function CopyButton({ value, label = 'Salin', className = '' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      // Fallback for environments without clipboard API.
      const ta = document.createElement('textarea')
      ta.value = value
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 transition hover:bg-white/10 ${className}`}
      aria-label={label}
    >
      {copied ? <Check width={14} height={14} /> : <Copy width={14} height={14} />}
      {copied ? 'Tersalin' : label}
    </button>
  )
}
