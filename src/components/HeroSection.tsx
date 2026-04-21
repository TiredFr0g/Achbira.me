import { useRef } from 'react'
import { useRevealOnScroll, useTiltInteractions } from './sectionMotion'

type HeroSectionProps = {
  text: Record<string, string>
}

export default function HeroSection({ text }: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)

  useRevealOnScroll(sectionRef)
  useTiltInteractions(sectionRef)

  return (
    <section ref={sectionRef} id="architecture" className="relative flex min-h-[85vh] items-center overflow-hidden px-4 pt-24 sm:px-8 sm:pt-28 md:px-16 md:pt-0">
      <div className="hero-backdrop pointer-events-none absolute inset-0 z-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 pt-14 md:pt-16 lg:grid-cols-12">
        <div className="reveal lg:col-span-7">
          <div className="mb-8 inline-block max-w-full wrap-break-word border border-[#22c55e]/20 bg-[#22c55e]/10 px-4 py-1.5 font-mono-tech text-[10px] tracking-widest text-[#22c55e]">
            {text.status}
          </div>
          <h1 className="font-headline mb-8 text-4xl leading-[0.95] font-black tracking-tight md:text-6xl">
            <span className="text-[#22c55e]">{text.titleTop}</span> {text.titleBottom}
          </h1>
          <p className="mb-10 max-w-xl text-base leading-relaxed font-light text-slate-400 md:text-lg">
            {text.heroIntro}{' '}
            <span className="text-white">Django, React, PostgreSQL, Redis, and Docker</span>.
          </p>

          <div className="mb-8 max-w-xl border border-white/10 bg-black/20 p-4 sm:p-5">
            <p className="font-mono-tech text-[10px] tracking-[0.18em] text-slate-500">{text.aboutMeLabel}</p>
            <h3 className="mt-2 font-headline text-lg font-bold text-white sm:text-xl">{text.aboutMeTitle}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{text.aboutMeDescription}</p>
            <div className="mt-4 flex flex-wrap gap-2 font-mono-tech text-[10px] tracking-[0.14em] text-slate-300">
              <span className="border border-[#22c55e]/35 bg-[#22c55e]/10 px-2.5 py-1">{text.traitAnalysis}</span>
              <span className="border border-[#3b82f6]/35 bg-[#3b82f6]/10 px-2.5 py-1">{text.traitSolving}</span>
              <span className="border border-white/20 bg-white/5 px-2.5 py-1">{text.traitPuzzles}</span>
            </div>
          </div>

          <div className="mt-6 flex gap-6 font-mono-tech text-xs text-slate-400">
            <div>
              <p className="text-lg text-white">3+</p>
              <p>{text.statsProjects}</p>
            </div>
            <div>
              <p className="text-lg text-white">5+</p>
              <p>{text.statsStack}</p>
            </div>
            <div>
              <p className="text-lg text-white">1337</p>
              <p>{text.statsSchool}</p>
            </div>
          </div>

          <p className="mt-4 font-mono-tech text-xs text-[#22c55e]">
            {'>'} {text.terminalInit}
            <span className="hero-cursor ml-1">|</span>
          </p>
        </div>

        <div className="reveal z-20 flex justify-center lg:col-span-5 lg:justify-self-end lg:self-center lg:-mr-4">
          <div className="group relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-2 bg-linear-to-br from-[#22c55e]/10 via-transparent to-transparent blur-2xl opacity-60 transition-opacity group-hover:opacity-80" />

            <a
              className="hero-avatar-frame tilt-card relative mx-auto block h-64 w-64 overflow-hidden border border-[#22c55e]/20 bg-[#020617] p-2 md:h-80 md:w-80"
              href="https://www.linkedin.com/in/ayoub-chbira-98b152398/"
              rel="noreferrer"
              target="_blank"
              title="Open LinkedIn"
            >
              <div className="pointer-events-none absolute inset-0 opacity-[0.06]">
                <div className="h-full w-full bg-[linear-gradient(rgba(34,197,94,0.15)_1px,transparent_1px)] bg-size-[100%_4px]" />
              </div>

              <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-2 left-2 font-mono-tech text-[10px] tracking-[0.18em] text-[#22c55e] opacity-70">
                  LIVE_FEED
                </div>
                <div className="absolute right-2 bottom-2 font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">
                  ID: 042
                </div>
                <div className="absolute top-0 left-0 h-4 w-4 border-t border-l border-[#22c55e]/40" />
                <div className="absolute top-0 right-0 h-4 w-4 border-t border-r border-[#22c55e]/40" />
                <div className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-[#22c55e]/40" />
                <div className="absolute right-0 bottom-0 h-4 w-4 border-b border-r border-[#22c55e]/40" />
              </div>

              <img alt="Ayoub" className="hero-avatar-image h-full w-full object-cover object-top brightness-95 transition-all duration-700 hover:brightness-100" src="/pfp.png" />
              <div className="pointer-events-none absolute inset-2 border border-[#22c55e]/20 opacity-0 transition duration-300 group-hover:opacity-100" />
            </a>
          </div>
        </div>

        <div className="reveal lg:col-span-12">
          <div className="hero-focus-dock border border-white/10 bg-white/2 p-6 md:p-8">
            <p className="font-mono-tech text-[10px] tracking-[0.22em] text-slate-500">{text.currentFocus}</p>
            <h3 className="mt-3 font-headline text-xl font-bold text-white">{text.honingSkills}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{text.focusDescription}</p>

            <div className="mt-5 flex flex-wrap gap-2 font-mono-tech text-[10px] tracking-wide">
              <span className="border border-[#22c55e]/40 bg-[#22c55e]/10 px-2.5 py-1 text-[#22c55e]">
                DJANGO AUTH + DATA
              </span>
              <span className="border border-[#3b82f6]/40 bg-[#3b82f6]/10 px-2.5 py-1 text-[#93c5fd]">
                NESTJS + WEBSOCKETS
              </span>
              <span className="border border-white/20 px-2.5 py-1 text-slate-300">POSTGRESQL</span>
              <span className="border border-white/20 px-2.5 py-1 text-slate-300">DOCKER</span>
              <span className="border border-white/20 px-2.5 py-1 text-slate-300">REDIS</span>
            </div>

            <div className="mt-6 space-y-3">
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="absolute inset-y-0 left-0 w-4/5 bg-[#22c55e]" />
              </div>
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="absolute inset-y-0 left-0 w-3/4 bg-[#3b82f6]" />
              </div>
              <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="absolute inset-y-0 left-0 w-2/3 bg-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}