import { useEffect, useState, type RefObject } from 'react'

export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0)

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

  return scrollProgress
}

export function useActiveSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0] ?? '')

  useEffect(() => {
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
  }, [sectionIds.join('|')])

  return activeSection
}

export function useRevealOnScroll(rootRef: RefObject<HTMLElement | null>, selector = '.reveal') {
  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const revealElements = Array.from(root.querySelectorAll<HTMLElement>(selector))

    if (!revealElements.length) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      revealElements.forEach((element) => {
        element.classList.add('is-visible')
        element.style.opacity = '1'
        element.style.transform = 'translateY(0)'
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

    revealElements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [rootRef, selector])
}

export function useTiltInteractions(rootRef: RefObject<HTMLElement | null>, selector = '.tilt-card') {
  useEffect(() => {
    const root = rootRef.current

    if (!root) {
      return
    }

    const tiltElements = Array.from(root.querySelectorAll<HTMLElement>(selector))

    if (!tiltElements.length) {
      return
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reducedMotion) {
      return
    }

    const cleanupFns: Array<() => void> = []

    tiltElements.forEach((card) => {
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
  }, [rootRef, selector])
}