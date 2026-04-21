import { useScrollProgress } from './sectionMotion'

type SiteHeaderProps = {
  text: Record<string, string>
  language: 'en' | 'fr'
  onLanguageChange: (language: 'en' | 'fr') => void
}

export default function SiteHeader({ text, language, onLanguageChange }: SiteHeaderProps) {
  const scrollProgress = useScrollProgress()

  return (
    <nav className="fixed top-0 z-40 flex w-full items-center justify-between border-b border-white/5 bg-[#020617]/80 px-4 py-5 backdrop-blur-lg sm:px-8">
      <div className="flex items-center gap-3">
        <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#22c55e]" />
        <span className="font-headline text-xl font-black uppercase tracking-tighter">Ayoub.sh</span>
      </div>

      <div className="ml-auto flex items-center gap-2 md:mr-2">
        <button
          aria-label="Switch to English"
          className={`border px-2 py-1 font-mono-tech text-[10px] tracking-wide transition ${
            language === 'en'
              ? 'border-[#22c55e]/70 bg-[#22c55e]/15 text-[#86efac]'
              : 'border-white/20 bg-transparent text-slate-400 hover:text-white'
          }`}
          onClick={() => onLanguageChange('en')}
          type="button"
        >
          EN
        </button>
        <button
          aria-label="Passer en francais"
          className={`border px-2 py-1 font-mono-tech text-[10px] tracking-wide transition ${
            language === 'fr'
              ? 'border-[#22c55e]/70 bg-[#22c55e]/15 text-[#86efac]'
              : 'border-white/20 bg-transparent text-slate-400 hover:text-white'
          }`}
          onClick={() => onLanguageChange('fr')}
          type="button"
        >
          FR
        </button>
      </div>

      <div className="nav-contact-rail absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 px-2 py-1 md:flex">
        <a aria-label={text.email} className="nav-contact-icon" href="mailto:ayoub.chbia@gmail.com" title={text.email}>
          <span className="material-symbols-outlined text-[18px]">mail</span>
          <span className="sr-only">{text.email}</span>
        </a>
        <a
          aria-label={text.github}
          className="nav-contact-icon"
          href="https://github.com/TiredFr0g"
          rel="noreferrer"
          target="_blank"
          title={text.github}
        >
          <span className="material-symbols-outlined text-[18px]">code</span>
          <span className="sr-only">{text.github}</span>
        </a>
        <a
          aria-label={text.linkedin}
          className="nav-contact-icon"
          href="https://www.linkedin.com/in/ayoub-chbira-98b152398/"
          rel="noreferrer"
          target="_blank"
          title={text.linkedin}
        >
          <span className="material-symbols-outlined text-[18px]">work</span>
          <span className="sr-only">{text.linkedin}</span>
        </a>
      </div>
      <div className="scroll-progress" style={{ width: `${scrollProgress.toFixed(2)}%` }} />
    </nav>
  )
}