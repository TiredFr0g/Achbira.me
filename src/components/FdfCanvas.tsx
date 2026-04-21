import { useEffect, useRef } from 'react'
import { createFdfRenderer } from '../lib/fdfRenderer.ts'

type FdfCanvasProps = {
  className?: string
}

export default function FdfCanvas({ className = '' }: FdfCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) {
      return undefined
    }

    const renderer = createFdfRenderer(canvas, {
      maxDevicePixelRatio: 1.35,
    })

    renderer.start()

    const handleResize = () => renderer.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.destroy()
    }
  }, [])

  return <canvas ref={canvasRef} className={`block h-full w-full ${className}`} aria-hidden="true" />
}