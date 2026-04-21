type EducationItem = {
  school: string
  program: string
  details: string[]
}

type SkillGroup = {
  category: string
  value: string
}

type ExperienceSectionProps = {
  text: Record<string, string>
  currentEducationItems: EducationItem[]
  currentSkillGroups: SkillGroup[]
  registerRevealRef: (index: number) => (element: HTMLElement | null) => void
}

export default function ExperienceSection({ text, currentEducationItems, currentSkillGroups, registerRevealRef }: ExperienceSectionProps) {
  return (
    <section id="experience" className="mx-auto max-w-7xl px-4 pb-24 sm:px-8">
      <div ref={registerRevealRef(10)} className="reveal border border-white/10 bg-white/2 p-8 md:p-10">
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
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{text.languageDetails}</p>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}