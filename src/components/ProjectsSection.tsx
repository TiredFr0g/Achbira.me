import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { ProjectCard, ProjectDeepDive } from '../types/project.ts'
import { useRevealOnScroll, useTiltInteractions } from './sectionMotion'

type ProjectsSectionProps = {
  text: Record<string, string>
  projectCards: ProjectCard[]
  projectDeepDives: Record<string, ProjectDeepDive>
}

function ProjectDetails({
  text,
  project,
  projectDive,
  onClose,
}: {
  text: Record<string, string>
  project: ProjectCard
  projectDive: ProjectDeepDive
  onClose?: () => void
}) {
  return (
    <>
      {onClose ? (
        <div className="mb-4 flex items-center justify-between">
          <p className="font-mono-tech text-[10px] tracking-[0.2em] text-slate-500">{text.projectBrief}</p>
          <button
            type="button"
            className="border border-white/20 px-2.5 py-1 font-mono-tech text-[10px] tracking-[0.14em] text-slate-300"
            onClick={onClose}
            aria-label={text.close}
          >
            {text.close}
          </button>
        </div>
      ) : null}

      <h3 className={`mt-2 font-headline text-xl font-black ${project.iconColor}`}>{project.title}</h3>
      <p className="mt-2 font-mono-tech text-[10px] tracking-wider text-slate-500">{project.version}</p>
      <p className="mt-3 text-sm leading-relaxed text-slate-400">{projectDive.architectureTitle}</p>

      <div className="mt-5 space-y-4 text-sm text-slate-300">
        <div>
          <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.keyChallenges}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
            {projectDive.keyChallenges.slice(0, 2).map((item) => (
              <li key={`${project.title}-challenge-${item}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.myRole}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
            {projectDive.myContribution.slice(0, 2).map((item) => (
              <li key={`${project.title}-contribution-${item}`}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.tradeoff}</p>
          <p className="mt-2 leading-relaxed text-slate-400">{projectDive.tradeoffs[0]}</p>
        </div>

        <div>
          <p className="font-mono-tech text-[10px] tracking-[0.16em] text-slate-500">{text.proof}</p>
          <p className="mt-2 leading-relaxed text-slate-400">{projectDive.proof[0]}</p>
        </div>
      </div>

      <div className="tag-scroll mt-5 flex flex-nowrap gap-3 overflow-x-auto pb-1 font-mono-tech text-[10px] text-slate-400">
        {project.tech.map((item) => (
          <span key={`${project.title}-${onClose ? 'mobile-' : ''}${item}`} className="shrink-0 border border-white/10 px-3 py-1">
            {item}
          </span>
        ))}
      </div>
      <p className="mt-5 font-mono-tech text-[10px] tracking-[0.14em] text-slate-500">{text.githubSoon}</p>
    </>
  )
}

export default function ProjectsSection({ text, projectCards, projectDeepDives }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [isMobileProjectModalOpen, setIsMobileProjectModalOpen] = useState(false)

  useRevealOnScroll(sectionRef)
  useTiltInteractions(sectionRef)

  useEffect(() => {
    setActiveProjectIndex(0)
    setIsMobileProjectModalOpen(false)
  }, [projectCards])

  const activeProject = projectCards[activeProjectIndex] ?? projectCards[0]
  const activeProjectDive = activeProject ? projectDeepDives[activeProject.title] : undefined

  const isMobileViewport = () => window.matchMedia('(max-width: 767px)').matches

  const selectProject = (index: number) => {
    setActiveProjectIndex(index)

    if (isMobileViewport()) {
      setIsMobileProjectModalOpen(true)
    }
  }

  const handleProjectKeyDown = (index: number) => (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectProject(index)
    }
  }

  if (!activeProject || !activeProjectDive) {
    return null
  }

  return (
    <section ref={sectionRef} id="projects" className="relative mx-auto max-w-7xl px-4 py-24 sm:px-8 sm:py-32 md:py-40">
      <div className="absolute top-20 left-1/2 hidden max-w-full -translate-x-1/2 font-mono-tech text-[9px] tracking-[0.22em] text-slate-700 md:block">
        {text.hoverForDiagnostics}
      </div>

      <h2 className="reveal mb-12 text-center font-headline text-3xl font-black tracking-tighter sm:mb-16 sm:text-4xl">
        {text.selectedProjects}
      </h2>

      <div className="grid grid-cols-1 items-start gap-6 md:gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,1fr)]">
        <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
          <p className="font-mono-tech text-[10px] tracking-[0.18em] text-slate-500 md:hidden">{text.tapForDetails}</p>

          {projectCards.map((project, index) => (
            <div
              key={project.title}
              className={`border-data tilt-card reveal group relative cursor-pointer overflow-hidden p-5 sm:p-7 md:p-12 ${
                activeProjectIndex === index ? 'border-[#22c55e]/65 bg-[#22c55e]/10 shadow-[0_0_24px_-10px_rgba(34,197,94,0.85)]' : ''
              }`}
              onMouseEnter={() => setActiveProjectIndex(index)}
              onFocus={() => setActiveProjectIndex(index)}
              onClick={() => selectProject(index)}
              onKeyDown={handleProjectKeyDown(index)}
              role="button"
              tabIndex={0}
            >
              <div className="mb-4 flex items-center justify-between sm:mb-6 md:mb-10">
                <span className={`material-symbols-outlined text-2xl sm:text-3xl ${project.iconColor}`}>
                  {project.icon}
                </span>
                <span className="font-mono-tech text-[9px] text-slate-500 sm:text-[10px]">{project.version}</span>
              </div>
              <h3 className={`font-headline mb-2 text-base font-bold transition-colors sm:mb-3 sm:text-lg md:mb-4 md:text-xl ${project.hoverText}`}>
                {project.title}
              </h3>
              <p className="mb-5 text-xs leading-relaxed text-slate-400 sm:mb-6 sm:text-sm md:mb-10">{project.description}</p>
              <div className="tag-scroll flex flex-nowrap gap-2 overflow-x-auto pb-1 font-mono-tech text-[9px] text-slate-400 sm:gap-3">
                {project.tech.map((item) => (
                  <span key={item} className="shrink-0 border border-white/8 px-2.5 py-1">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <aside id="tags" className="reveal hidden border border-white/10 bg-white/2 p-6 md:block xl:sticky xl:top-28">
          <ProjectDetails text={text} project={activeProject} projectDive={activeProjectDive} />
        </aside>
      </div>

      {isMobileProjectModalOpen ? (
        <div className="fixed inset-0 z-70 bg-black/70 p-4 backdrop-blur-sm md:hidden" onClick={() => setIsMobileProjectModalOpen(false)} role="presentation">
          <aside
            id="tags-mobile"
            className="mx-auto mt-16 max-h-[78vh] w-full max-w-xl overflow-y-auto border border-white/12 bg-[#020617] p-5"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={text.projectBrief}
          >
            <ProjectDetails text={text} project={activeProject} projectDive={activeProjectDive} onClose={() => setIsMobileProjectModalOpen(false)} />
          </aside>
        </div>
      ) : null}
    </section>
  )
}