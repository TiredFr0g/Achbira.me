type SectionItem = {
  id: string
  label: string
  icon: string
}

type SectionsSidebarProps = {
  activeSection: string
  sectionItems: readonly SectionItem[]
  onSectionChange: (sectionId: string) => void
}

export default function SectionsSidebar({ activeSection, sectionItems, onSectionChange }: SectionsSidebarProps) {
  return (
    <aside className="fixed top-1/2 right-4 z-50 hidden -translate-y-1/2 md:flex">
      <div className="border border-white/10 bg-[#020617]/80 px-3 py-3 backdrop-blur-lg">
        <div className="relative flex flex-col items-center gap-3 pl-4 before:absolute before:top-0 before:bottom-0 before:left-2 before:w-px before:bg-white/10">
          {sectionItems.map((section) => {
            const isActive = activeSection === section.id

            return (
              <a
                key={section.id}
                className={`group relative flex items-center gap-3 transition ${isActive ? 'text-white' : 'text-slate-500 hover:text-slate-200'}`}
                href={`#${section.id}`}
                onClick={() => onSectionChange(section.id)}
                title={section.label}
              >
                <span
                  className={`absolute -left-4 h-3 w-3 rounded-full border transition-all ${
                    isActive
                      ? 'border-[#22c55e] bg-[#22c55e] shadow-[0_0_14px_rgba(34,197,94,0.95)]'
                      : 'border-white/20 bg-[#020617] group-hover:border-white/40'
                  }`}
                />
                <span className={`material-symbols-outlined text-[20px] transition ${isActive ? 'text-[#86efac]' : 'text-current'}`}>
                  {section.icon}
                </span>
              </a>
            )
          })}
        </div>
      </div>
    </aside>
  )
}