
type ProjectCard = {
  icon: string
  iconColor: string
  version: string
  title: string
  description: string
  tech: string[]
  hoverText: string
}

type ProjectDeepDive = {
  architectureTitle: string
  architectureDiagram: string[]
  keyChallenges: string[]
  myContribution: string[]
  tradeoffs: string[]
  proof: string[]
  eliteNext: string[]
}

export type { ProjectCard, ProjectDeepDive }