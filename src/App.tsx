import { useEffect, useState } from 'react'
import { portfolioContent as portfolioContentEn } from './data.ts'
import { portfolioContent as portfolioContentFr } from './data.fr.ts'
import HeroSection from './components/HeroSection'
import ProjectsSection from './components/ProjectsSection'
import ExperienceSection from './components/ExperienceSection'
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

  const text = uiText[language]
  const currentPortfolioContent = language === 'fr' ? portfolioContentFr : portfolioContentEn

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem('portfolio-language', language)
    document.documentElement.lang = language
  }, [language])

  return (
    <div className="min-h-screen w-full overflow-x-clip bg-[#020617] antialiased selection:bg-emerald-400/30 selection:text-white">
      <div className="ambient-grid" />
      <div className="ambient-vignette" />

      <SiteHeader text={text} language={language} onLanguageChange={setLanguage} />

      <SectionsSidebar text={text} />

      <main>
        <HeroSection text={text} />
        <ProjectsSection text={text} projectCards={currentPortfolioContent.projectCards} projectDeepDives={currentPortfolioContent.projectDeepDives} />
        <ExperienceSection
          text={text}
          currentEducationItems={currentPortfolioContent.educationItems}
          currentSkillGroups={currentPortfolioContent.skillGroups}
        />
      </main>

      <footer className="border-t border-white/5 py-24 text-center">
        <div className="font-mono-tech text-[10px] tracking-widest text-slate-600">
          AYOUB_CHBIRA /// 2026
        </div>
      </footer>
    </div>
  )
}
