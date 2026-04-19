import { useEffect, useMemo, useRef, useState } from 'react'
import {
  educationItems as educationItemsEn,
  projectCards as projectCardsEn,
  projectDeepDives as projectDeepDivesEn,
  skillGroups as skillGroupsEn,
} from './data.ts'
import {
  educationItems as educationItemsFr,
  projectCards as projectCardsFr,
  projectDeepDives as projectDeepDivesFr,
  skillGroups as skillGroupsFr,
} from './data.fr.ts'

type Language = 'en' | 'fr'

const uiText: Record<Language, Record<string, string>> = {
  en: {
    sections: 'SECTIONS',
    goAbout: 'Go to About',
    goProjects: 'Go to Projects',
    goExperience: 'Go to Education and Skills',
    about: 'About',
    projects: 'Projects',
    educationAndSkills: 'Education and Skills',
    status: 'STATUS: BACKEND_ENGINEERING_STUDENT',
    titleTop: 'BACKEND',
    titleBottom: 'ENGINEER',
    heroIntro:
      'Full-Stack Software Engineering student at 1337 with strong foundations in systems programming, networking, and backend development. Currently seeking a Full-Stack / Backend internship. I build scalable and secure applications with',
    statsProjects: 'PROJECTS',
    statsStack: 'TECH STACK',
    statsSchool: 'SCHOOL',
    terminalInit: 'initializing backend systems...',
    currentFocus: 'CURRENT_FOCUS',
    honingSkills: 'Honing More Skills',
    focusDescription:
      'Currently focused on building more systems using Django for authentication and data management, PostgreSQL, NestJS for WebSockets, Docker, and Redis.',
    selectedProjects: 'SELECTED_PROJECTS',
    hoverForDiagnostics: 'HOVER_OR_FOCUS_A_CARD_FOR_DIAGNOSTICS',
    projectBrief: 'PROJECT_BRIEF',
    keyChallenges: 'KEY_CHALLENGES',
    myRole: 'MY_ROLE',
    tradeoff: 'TRADEOFF',
    proof: 'PROOF',
    githubSoon: 'GITHUB_REPO_LINK_COMING_SOON',
    educationSkills: 'EDUCATION_AND_SKILLS',
    foundation: 'Rigorous foundation + modern full-stack execution',
    education: 'Education',
    technicalSkills: 'Technical Skills',
    languages: 'Languages',
    languageDetails: 'Fluent in English and French. Native in Arabic.',
  },
  fr: {
    sections: 'SECTIONS',
    goAbout: 'Aller a Profil',
    goProjects: 'Aller aux Projets',
    goExperience: 'Aller a Formation et Competences',
    about: 'Profil',
    projects: 'Projets',
    educationAndSkills: 'Formation et Competences',
    status: 'STATUT: ETUDIANT_INGENIERIE_BACKEND',
    titleTop: 'INGENIEUR',
    titleBottom: 'BACKEND',
    heroIntro:
      'Etudiant en ingenierie logicielle full-stack a 1337, avec des bases solides en programmation systeme, reseaux et backend. Actuellement a la recherche d un stage Full-Stack / Backend. Je construis des applications scalables et securisees avec',
    statsProjects: 'PROJETS',
    statsStack: 'TECH STACK',
    statsSchool: 'ECOLE',
    terminalInit: 'initialisation des systemes backend...',
    currentFocus: 'FOCUS_ACTUEL',
    honingSkills: 'Renforcer les competences',
    focusDescription:
      'Actuellement concentre sur la construction de systemes avec Django pour l authentification et la gestion de donnees, PostgreSQL, NestJS pour les WebSockets, Docker et Redis.',
    selectedProjects: 'PROJETS_SELECTIONNES',
    hoverForDiagnostics: 'SURVOLER_OU_FOCUS_UNE_CARTE_POUR_DIAGNOSTICS',
    projectBrief: 'RESUME_PROJET',
    keyChallenges: 'DEFIS_CLES',
    myRole: 'MON_ROLE',
    tradeoff: 'COMPROMIS',
    proof: 'PREUVE',
    githubSoon: 'LIEN_GITHUB_BIENTOT_DISPONIBLE',
    educationSkills: 'FORMATION_ET_COMPETENCES',
    foundation: 'Base rigoureuse + execution full-stack moderne',
    education: 'Formation',
    technicalSkills: 'Competences Techniques',
    languages: 'Langues',
    languageDetails: 'Courant en anglais et francais. Arabe langue maternelle.',
  },
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'en'
    }

    const stored = window.localStorage.getItem('portfolio-language')
    return stored === 'fr' ? 'fr' : 'en'
  })
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [activeSection, setActiveSection] = useState('architecture')
  const [scrollProgress, setScrollProgress] = useState(0)

  const revealRefs = useRef<HTMLElement[]>([])
  const tiltRefs = useRef<HTMLElement[]>([])

  const text = uiText[language]
  const currentProjectCards = language === 'fr' ? projectCardsFr : projectCardsEn
  const currentProjectDeepDives = language === 'fr' ? projectDeepDivesFr : projectDeepDivesEn
  const currentEducationItems = language === 'fr' ? educationItemsFr : educationItemsEn
  const currentSkillGroups = language === 'fr' ? skillGroupsFr : skillGroupsEn
  const activeProject = currentProjectCards[activeProjectIndex] ?? currentProjectCards[0]

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem('portfolio-language', language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    setActiveProjectIndex(0)
  }, [language])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const ratio = scrollable > 0 ? (scrollTop / scrollable) * 100 : 0
      setScrollProgress(ratio)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      return
    }

    const cleanupFns: Array<() => void> = []

    tiltRefs.current.forEach((card) => {
      if (!card) {
        return
      }

      const onMove = (event: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const px = (event.clientX - rect.left) / rect.width
        const py = (event.clientY - rect.top) / rect.height
        const rotateY = (px - 0.5) * 14
        const rotateX = (0.5 - py) * 12

        card.style.setProperty('--mx', `${Math.round(px * 100)}%`)
        card.style.setProperty('--my', `${Math.round(py * 100)}%`)
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      }

      const onLeave = () => {
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
      }

      card.addEventListener('mousemove', onMove)
      card.addEventListener('mouseleave', onLeave)

      cleanupFns.push(() => {
        card.removeEventListener('mousemove', onMove)
        card.removeEventListener('mouseleave', onLeave)
      })
    })

    return () => {
      cleanupFns.forEach((cleanup) => cleanup())
    }
  }, [])

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      revealRefs.current.forEach((el) => {
        el.classList.add('is-visible')
        el.style.opacity = '1'
        el.style.transform = 'translateY(0)'
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            ;(entry.target as HTMLElement).style.opacity = '1'
            ;(entry.target as HTMLElement).style.transform = 'translateY(0)'
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.18 },
    )

    revealRefs.current.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const sectionIds = ['architecture', 'projects', 'experience']
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (!sections.length) {
      return
    }

    const updateActiveSection = () => {
      const probeY = window.scrollY + window.innerHeight * 0.42

      for (let i = 0; i < sections.length; i += 1) {
        const currentTop = sections[i].offsetTop
        const nextTop = sections[i + 1]?.offsetTop ?? Number.POSITIVE_INFINITY

        if (probeY >= currentTop && probeY < nextTop) {
          setActiveSection((prev) => (prev === sections[i].id ? prev : sections[i].id))
          break
        }
      }
    }

    let rafId: number | null = null
    const onScrollOrResize = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
      rafId = requestAnimationFrame(updateActiveSection)
    }

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    updateActiveSection()

    return () => {
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [])

  const activeProjectDive = useMemo(
    () => currentProjectDeepDives[activeProject.title],
    [activeProject.title, currentProjectDeepDives],
  )

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#020617] antialiased selection:bg-emerald-400/30 selection:text-white">
      <div className="ambient-grid" />
      <div className="ambient-vignette" />

      <nav className="fixed top-0 z-40 flex w-full items-center justify-between border-b border-white/5 bg-[#020617]/80 px-4 py-5 sm:px-8 backdrop-blur-lg">
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
            onClick={() => setLanguage('en')}
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
            onClick={() => setLanguage('fr')}
            type="button"
          >
            FR
          </button>
        </div>

        <div className="nav-contact-rail absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 px-2 py-1 md:flex">
          <a aria-label="Email Ayoub" className="nav-contact-icon" href="mailto:ayoub.chbia@gmail.com" title="Email">
            <span className="material-symbols-outlined text-[18px]">mail</span>
            <span className="sr-only">Email</span>
          </a>
          <a
            aria-label="Open GitHub"
            className="nav-contact-icon"
            href="https://github.com/TiredFr0g"
            rel="noreferrer"
            target="_blank"
            title="GitHub"
          >
            <span className="material-symbols-outlined text-[18px]">code</span>
            <span className="sr-only">GitHub</span>
          </a>
          <a
            aria-label="Open LinkedIn"
            className="nav-contact-icon"
            href="https://www.linkedin.com/in/ayoub-chbira-98b152398/"
            rel="noreferrer"
            target="_blank"
            title="LinkedIn"
          >
            <span className="material-symbols-outlined text-[18px]">work</span>
            <span className="sr-only">LinkedIn</span>
          </a>
        </div>
        <div className="scroll-progress" style={{ width: `${scrollProgress.toFixed(2)}%` }} />
      </nav>

      <aside className="fixed top-1/2 right-5 z-50 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        <p className="font-mono-tech text-[9px] tracking-[0.22em] text-slate-600">{text.sections}</p>
        <a
          className={`side-scroll-btn ${activeSection === 'architecture' ? 'is-active' : ''}`}
          href="#architecture"
          onClick={() => setActiveSection('architecture')}
          title={text.goAbout}
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="sr-only">{text.about}</span>
        </a>
        <a
          className={`side-scroll-btn ${activeSection === 'projects' ? 'is-active' : ''}`}
          href="#projects"
          onClick={() => setActiveSection('projects')}
          title={text.goProjects}
        >
          <span className="material-symbols-outlined text-[22px]">deployed_code</span>
          <span className="sr-only">{text.projects}</span>
        </a>
        <a
          className={`side-scroll-btn ${activeSection === 'experience' ? 'is-active' : ''}`}
          href="#experience"
          onClick={() => setActiveSection('experience')}
          title={text.goExperience}
        >
          <span className="material-symbols-outlined text-[22px]">school</span>
          <span className="sr-only">{text.educationAndSkills}</span>
        </a>
      </aside>

      <main>
        <section id="architecture" className="relative flex min-h-[85vh] items-center overflow-hidden px-4 sm:px-8 md:px-16">
          <div className="hero-backdrop pointer-events-none absolute inset-0 z-0" />

          <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 pt-14 md:pt-16 lg:grid-cols-12">
            <div
              ref={(el) => {
                if (el) {
                  revealRefs.current[0] = el
                }
              }}
              className="reveal lg:col-span-7"
            >
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

            <div
              ref={(el) => {
                if (el) {
                  revealRefs.current[1] = el
                  tiltRefs.current[0] = el
                }
              }}  
              className="reveal z-20 flex justify-center lg:col-span-5 lg:justify-self-end lg:self-center lg:-mr-4"
            >
              <div className="group relative mx-auto w-full max-w-sm">
                <div className="absolute -inset-2 bg-linear-to-br from-[#22c55e]/10 via-transparent to-transparent blur-2xl opacity-60 transition-opacity group-hover:opacity-80" />

                <div className="hero-avatar-frame tilt-card relative mx-auto h-64 w-64 overflow-hidden border border-[#22c55e]/20 bg-[#020617] p-2 md:h-80 md:w-80">
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

                  <img alt="Ayoub" className="hero-avatar-image h-full w-full object-cover object-top brightness-95 transition-all duration-700 hover:brightness-100" src="/last_pfp.png" />
                  <div className="pointer-events-none absolute inset-2 border border-[#22c55e]/20 opacity-0 transition duration-300 group-hover:opacity-100" />
                </div>
              </div>  
            </div>

            <div
              ref={(el) => {
                if (el) {
                  revealRefs.current[2] = el
                }
              }}
              className="reveal lg:col-span-12"
            >
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

        <section id="projects" className="relative mx-auto max-w-7xl px-4 py-40 sm:px-8">
          <div className="absolute top-20 left-1/2 hidden max-w-full -translate-x-1/2 font-mono-tech text-[9px] tracking-[0.22em] text-slate-700 md:block">
            {text.hoverForDiagnostics}
          </div>

          <h2
            ref={(el) => {
              if (el) revealRefs.current[3] = el
            }}
            className="reveal mb-20 text-center font-headline text-4xl font-black tracking-tighter"
          >
            {text.selectedProjects}
          </h2>

          <div className="grid grid-cols-1 items-start gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {currentProjectCards.map((project, index) => (
                <div key={project.title} className="contents">
                  <div
                    ref={(el) => {
                      if (el) {
                        revealRefs.current[4 + index] = el
                        tiltRefs.current[1 + index] = el
                      }
                    }}
                    className={`border-data tilt-card reveal group relative cursor-pointer overflow-hidden p-12 ${
                      activeProjectIndex === index
                        ? 'border-[#22c55e]/65 bg-[#22c55e]/10 shadow-[0_0_24px_-10px_rgba(34,197,94,0.85)]'
                        : ''
                    }`}
                    onMouseEnter={() => setActiveProjectIndex(index)}
                    onFocus={() => setActiveProjectIndex(index)}
                    onClick={() => setActiveProjectIndex(index)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setActiveProjectIndex(index)
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="mb-10 flex items-center justify-between">
                      <span className={`material-symbols-outlined text-3xl ${project.iconColor}`}>{project.icon}</span>
                      <span className="font-mono-tech text-[10px] text-slate-600">{project.version}</span>
                    </div>
                    <h3 className={`font-headline mb-4 text-xl font-bold transition-colors ${project.hoverText}`}>
                      {project.title}
                    </h3>
                    <p className="mb-10 text-sm leading-relaxed text-slate-400">{project.description}</p>
                    <div className="tag-scroll flex flex-nowrap gap-3 overflow-x-auto pb-1 font-mono-tech text-[9px] text-slate-500">
                      {project.tech.map((item) => (
                        <span key={item} className="shrink-0">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {activeProjectIndex === index ? (
                    <aside
                      id="tags-mobile"
                      className="border border-white/10 bg-white/2 p-6 md:hidden"
                    >
                      <p className="font-mono-tech text-[10px] tracking-[0.2em] text-slate-500">{text.projectBrief}</p>
                      <h3 className={`mt-3 font-headline text-2xl font-black ${activeProject.iconColor}`}>
                        {activeProject.title}
                      </h3>
                      <p className="mt-2 font-mono-tech text-[10px] tracking-wider text-slate-500">
                        {activeProject.version}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-slate-400">{activeProjectDive.architectureTitle}</p>

                      <div className="mt-5 space-y-4 text-sm text-slate-300">
                        <div>
                          <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">
                            {text.keyChallenges}
                          </p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
                            {activeProjectDive.keyChallenges.slice(0, 2).map((item) => (
                              <li key={`${activeProject.title}-mobile-challenge-${item}`}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.myRole}</p>
                          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
                            {activeProjectDive.myContribution.slice(0, 2).map((item) => (
                              <li key={`${activeProject.title}-mobile-contribution-${item}`}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.tradeoff}</p>
                          <p className="mt-2 leading-relaxed text-slate-400">{activeProjectDive.tradeoffs[0]}</p>
                        </div>

                        <div>
                          <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.proof}</p>
                          <p className="mt-2 leading-relaxed text-slate-400">{activeProjectDive.proof[0]}</p>
                        </div>
                      </div>

                      <div className="tag-scroll mt-5 flex flex-nowrap gap-3 overflow-x-auto pb-1 font-mono-tech text-[10px] text-slate-400">
                        {activeProject.tech.map((item) => (
                          <span key={`${activeProject.title}-mobile-${item}`} className="shrink-0 border border-white/10 px-3 py-1">
                            {item}
                          </span>
                        ))}
                      </div>
                      <p className="mt-5 font-mono-tech text-[10px] tracking-[0.14em] text-slate-500">
                        {text.githubSoon}
                      </p>
                    </aside>
                  ) : null}
                </div>
              ))}
            </div>

            <aside
              id="tags"
              ref={(el) => {
                if (el) revealRefs.current[9] = el
              }}
              className="reveal hidden border border-white/10 bg-white/2 p-6 md:block xl:sticky xl:top-28"
            >
              <p className="font-mono-tech text-[10px] tracking-[0.2em] text-slate-500">{text.projectBrief}</p>
              <h3 className={`mt-3 font-headline text-2xl font-black ${activeProject.iconColor}`}>{activeProject.title}</h3>
              <p className="mt-2 font-mono-tech text-[10px] tracking-wider text-slate-500">{activeProject.version}</p>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">{activeProjectDive.architectureTitle}</p>

              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <div>
                  <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.keyChallenges}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
                    {activeProjectDive.keyChallenges.slice(0, 2).map((item) => (
                      <li key={`${activeProject.title}-challenge-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.myRole}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
                    {activeProjectDive.myContribution.slice(0, 2).map((item) => (
                      <li key={`${activeProject.title}-contribution-${item}`}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.tradeoff}</p>
                  <p className="mt-2 leading-relaxed text-slate-400">{activeProjectDive.tradeoffs[0]}</p>
                </div>

                <div>
                  <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.proof}</p>
                  <p className="mt-2 leading-relaxed text-slate-400">{activeProjectDive.proof[0]}</p>
                </div>
              </div>

              <div className="tag-scroll mt-5 flex flex-nowrap gap-3 overflow-x-auto pb-1 font-mono-tech text-[10px] text-slate-400">
                {activeProject.tech.map((item) => (
                  <span key={`${activeProject.title}-${item}`} className="shrink-0 border border-white/10 px-3 py-1">
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-5 font-mono-tech text-[10px] tracking-[0.14em] text-slate-500">
                {text.githubSoon}
              </p>
            </aside>
          </div>
        </section>

        <section id="experience" className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
          <div
            ref={(el) => {
              if (el) revealRefs.current[10] = el
            }}
            className="reveal border border-white/10 bg-white/2 p-8 md:p-10"
          >
            <p className="font-mono-tech text-[10px] tracking-[0.25em] text-slate-500">{text.educationSkills}</p>
            <h3 className="mt-4 max-w-xl text-balance font-headline text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl md:text-4xl lg:text-left">
              {text.foundation}
            </h3>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div>
                <h4 className="font-headline text-xl font-bold text-[#22c55e]">{text.education}</h4>
                <div className="mt-4 space-y-6">
                  {currentEducationItems.map((item) => (
                    <article key={item.school} className="border border-white/5 bg-black/20 p-4">
                      <p className="font-mono-tech text-[10px] tracking-widest text-slate-500">{item.school}</p>
                      <p className="mt-2 text-sm font-semibold text-white">{item.program}</p>
                      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400">
                        {item.details.map((detail) => (
                          <li key={detail}>{detail}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-headline text-xl font-bold text-[#3b82f6]">{text.technicalSkills}</h4>
                <div className="mt-4 space-y-4">
                  {currentSkillGroups.map((group) => (
                    <article key={group.category} className="border border-white/5 bg-black/20 p-4">
                      <p className="font-mono-tech text-[10px] tracking-widest text-slate-500">{group.category}</p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-300">{group.value}</p>
                    </article>
                  ))}
                </div>

                <article className="mt-6 border border-white/5 bg-black/20 p-4">
                  <p className="font-mono-tech text-[10px] tracking-widest text-slate-500">{text.languages}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    {text.languageDetails}
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-24 text-center">
        <div className="font-mono-tech text-[10px] tracking-widest text-slate-600">
          AYOUB_CHBIRA /// 2026
        </div>
      </footer>
    </div>
  )
}
