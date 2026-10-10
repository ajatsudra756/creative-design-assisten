export default function Section({ icon: Icon, title, children, actions }) {
  return (
    <section className="card p-5 sm:p-6 animate-fade-up">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent-soft">
            {Icon ? <Icon width={18} height={18} /> : null}
          </span>
          <h3 className="section-title">{title}</h3>
        </div>
        {actions}
      </header>
      {children}
    </section>
  )
}
