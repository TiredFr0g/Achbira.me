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
import HeroSection from './components/HeroSection'
import ProjectsSection from './components/ProjectsSection'
import ExperienceSection from './components/ExperienceSection'
import FdfSection from './components/FdfSection'
import SectionsSidebar from './components/SectionsSidebar'
import SiteHeader from './components/SiteHeader'
import { uiText, type Language } from './content/uiText.ts'

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') {
      return 'en'
    }

    const stored = window.localStorage.getItem('portfolio-language')
    return stored === 'fr' ? 'fr' : 'en'
  })
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [isMobileProjectModalOpen, setIsMobileProjectModalOpen] = useState(false)
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
  const sectionItems = [
    { id: 'architecture', label: text.about, icon: 'home' },
    { id: 'projects', label: text.projects, icon: 'deployed_code' },
    { id: 'experience', label: text.educationAndSkills, icon: 'school' },
  ] as const

  const registerRevealRef = (index: number) => (element: HTMLElement | null) => {
    if (element) {
      revealRefs.current[index] = element
    }
  }

  const registerTiltRef = (index: number) => (element: HTMLElement | null) => {
    if (element) {
      tiltRefs.current[index] = element
    }
  }

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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileProjectModalOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

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

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)

        if (!visible.length) {
          return
        }

        visible.sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))
        const nextActive = visible[0].target.id

        setActiveSection((prev) => (prev === nextActive ? prev : nextActive))
      },
      {
        rootMargin: '-28% 0px -52% 0px',
        threshold: [0.05, 0.2, 0.45, 0.7],
      },
    )

    sections.forEach((section) => observer.observe(section))

    const syncEdges = () => {
      const lastSection = sections[sections.length - 1]
      if (window.scrollY <= 2) {
        setActiveSection((prev) => (prev === sections[0].id ? prev : sections[0].id))
      } else if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) {
        setActiveSection((prev) => (prev === lastSection.id ? prev : lastSection.id))
      }
    }

    window.addEventListener('scroll', syncEdges, { passive: true })
    syncEdges()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', syncEdges)
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

      <SiteHeader text={text} language={language} onLanguageChange={setLanguage} scrollProgress={scrollProgress} />

      <SectionsSidebar
        activeSection={activeSection}
        sectionItems={sectionItems}
        onSectionChange={setActiveSection}
      />

      <main>
        <HeroSection text={text} registerRevealRef={registerRevealRef} registerTiltRef={registerTiltRef} />
        <ProjectsSection
          text={text}
          currentProjectCards={currentProjectCards}
          activeProjectIndex={activeProjectIndex}
          setActiveProjectIndex={setActiveProjectIndex}
          activeProject={activeProject}
          activeProjectDive={activeProjectDive}
          isMobileProjectModalOpen={isMobileProjectModalOpen}
          setIsMobileProjectModalOpen={setIsMobileProjectModalOpen}
          registerRevealRef={registerRevealRef}
          registerTiltRef={registerTiltRef}
        />
        <ExperienceSection
          text={text}
          currentEducationItems={currentEducationItems}
          currentSkillGroups={currentSkillGroups}
          registerRevealRef={registerRevealRef}
        />
        {/* <FdfSection text={text} registerRevealRef={registerRevealRef} /> */}
      </main>

      <footer className="border-t border-white/5 py-24 text-center">
        <div className="font-mono-tech text-[10px] tracking-widest text-slate-600">
          AYOUB_CHBIRA /// 2026
        </div>
      </footer>
    </div>
  )
}
