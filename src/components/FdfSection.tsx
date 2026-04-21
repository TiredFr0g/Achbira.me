import FdfCanvas from './FdfCanvas'

type FdfSectionProps = {
  text: Record<string, string>
  registerRevealRef: (index: number) => (element: HTMLElement | null) => void
}

export default function FdfSection({ text, registerRevealRef }: FdfSectionProps) {
  return (
    <section id="fdf" className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-8 sm:pt-8">
      <div ref={registerRevealRef(11)} className="reveal border border-white/10 bg-white/2 p-5 sm:p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono-tech text-[10px] tracking-[0.22em] text-slate-500">{text.fdfLabel}</p>
            <h3 className="mt-2 font-headline text-2xl font-black text-white sm:text-3xl">{text.fdfTitle}</h3>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400">{text.fdfDescription}</p>
        </div>

        <div className="mt-6 overflow-hidden border border-white/10 bg-[#020617]">
          <FdfCanvas className="h-80 sm:h-105 md:h-130" />
        </div>
      </div>
    </section>
  )
}