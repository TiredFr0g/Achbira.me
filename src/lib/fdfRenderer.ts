type MapPoint = {
  x: number
  y: number
  z: number
  color: number
}

type Vector3 = {
  x: number
  y: number
  z: number
}

type ParsedMap = {
  width: number
  height: number
  points: MapPoint[]
}

type RenderDimensions = {
  width: number
  height: number
  centerX: number
  centerY: number
  scale: number
}

type ProjectedPoint = {
  x: number
  y: number
  z: number
}

type ColoredProjectedPoint = ProjectedPoint & {
  color: number
}

export type FdfRendererOptions = {
  source?: string
  maxDevicePixelRatio?: number
}

export type FdfRenderer = {
  start: () => void
  destroy: () => void
  resize: () => void
}

const DEFAULT_MAP_SOURCE = createDefaultMapSource(16, 16)

function createDefaultMapSource(width: number, height: number): string {
  const rows: string[] = []

  for (let y = 0; y < height; y += 1) {
    const cells: string[] = []

    for (let x = 0; x < width; x += 1) {
      const centeredX = x - (width - 1) / 2
      const centeredY = y - (height - 1) / 2
      const wave = Math.sin(centeredX * 0.55) + Math.cos(centeredY * 0.45)
      const ridge = Math.sin((centeredX + centeredY) * 0.35)
      const heightValue = Math.round((wave + ridge) * 2.2)
      cells.push(String(heightValue))
    }

    rows.push(cells.join(' '))
  }

  return rows.join('\n')
}

function parseColorToken(token: string | undefined, fallbackColor: number): number {
  if (!token) {
    return fallbackColor
  }

  const normalized = token.trim().replace(/^0x/i, '').replace(/^#/, '')
  const parsed = Number.parseInt(normalized, 16)

  if (Number.isNaN(parsed)) {
    return fallbackColor
  }

  return parsed
}

function parseMapSource(source: string): ParsedMap {
  const rows = source
    .trim()
    .split(/\r?\n/)
    .map((row) => row.trim().split(/\s+/).filter(Boolean))
    .filter((row) => row.length > 0)

  const height = rows.length
  const width = rows[0]?.length ?? 0
  const points: MapPoint[] = []

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const rawToken = rows[y][x]
      const [zPart, colorPart] = rawToken.split(',')
      const z = Number.parseInt(zPart, 10) || 0
      const fallbackColor = z >= 0 ? 0x9dd6ff : 0x7ce38b
      const color = colorPart ? parseColorToken(colorPart, fallbackColor) : fallbackColor

      points.push({
        x,
        y,
        z,
        color,
      })
    }
  }

  return {
    width,
    height,
    points,
  }
}

function rotatePoint(point: Vector3, angles: { x: number; y: number; z: number }): Vector3 {
  const cosX = Math.cos(angles.x)
  const sinX = Math.sin(angles.x)
  const cosY = Math.cos(angles.y)
  const sinY = Math.sin(angles.y)
  const cosZ = Math.cos(angles.z)
  const sinZ = Math.sin(angles.z)

  let x = point.x
  let y = point.y
  let z = point.z

  const rotatedY = y * cosX - z * sinX
  const rotatedZ = y * sinX + z * cosX
  y = rotatedY
  z = rotatedZ

  const rotatedX = x * cosY + z * sinY
  const rotatedZ2 = -x * sinY + z * cosY
  x = rotatedX
  z = rotatedZ2

  const rotatedX2 = x * cosZ - y * sinZ
  const rotatedY2 = x * sinZ + y * cosZ

  return {
    x: rotatedX2,
    y: rotatedY2,
    z,
  }
}

function projectPoint(point: { x: number; y: number; z: number }, dimensions: RenderDimensions): ProjectedPoint {
  const isoX = (point.x - point.y) * Math.cos(0.52)
  const isoY = (point.x + point.y) * Math.sin(0.52) - point.z
  const perspective = 1 / (1 + Math.max(-0.35, point.z * 0.0035))

  return {
    x: dimensions.centerX + isoX * dimensions.scale * perspective,
    y: dimensions.centerY + isoY * dimensions.scale * perspective,
    z: point.z,
  }
}

function mixColor(colorA: number, colorB: number, weight: number): string {
  const clampWeight = Math.max(0, Math.min(1, weight))
  const aR = (colorA >> 16) & 0xff
  const aG = (colorA >> 8) & 0xff
  const aB = colorA & 0xff
  const bR = (colorB >> 16) & 0xff
  const bG = (colorB >> 8) & 0xff
  const bB = colorB & 0xff

  const red = Math.round(aR + (bR - aR) * clampWeight)
  const green = Math.round(aG + (bG - aG) * clampWeight)
  const blue = Math.round(aB + (bB - aB) * clampWeight)

  return `rgb(${red} ${green} ${blue})`
}

function drawLine(
  ctx: CanvasRenderingContext2D,
  from: ProjectedPoint,
  to: ProjectedPoint,
  color: string,
  alpha: number,
) {
  ctx.beginPath()
  ctx.moveTo(from.x, from.y)
  ctx.lineTo(to.x, to.y)
  ctx.strokeStyle = color
  ctx.globalAlpha = alpha
  ctx.stroke()
}

function createRenderDimensions(canvas: HTMLCanvasElement, map: ParsedMap): RenderDimensions {
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(1, rect.width)
  const height = Math.max(1, rect.height)
  const base = Math.min(width, height)
  const density = Math.max(map.width, map.height) || 1

  return {
    width,
    height,
    centerX: width / 2,
    centerY: height / 2,
    scale: base / (density * 0.8),
  }
}

function computePointGrid(map: ParsedMap, dimensions: RenderDimensions, time: number) {
  const vertices: ColoredProjectedPoint[] = new Array(map.points.length)
  const angles = {
    x: -0.65,
    y: 0.4 + Math.sin(time * 0.00018) * 0.2,
    z: time * 0.00008,
  }

  for (let index = 0; index < map.points.length; index += 1) {
    const point = map.points[index]
    const centeredPoint = {
      x: point.x - (map.width - 1) / 2,
      y: point.y - (map.height - 1) / 2,
      z: point.z * 0.7,
    }
    const rotated = rotatePoint(centeredPoint, angles)
    vertices[index] = { ...projectPoint(rotated, dimensions), color: point.color }
  }

  return vertices
}

function renderFrame(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, map: ParsedMap, time: number) {
  const dimensions = createRenderDimensions(canvas, map)
  const vertices = computePointGrid(map, dimensions, time)

  ctx.clearRect(0, 0, dimensions.width, dimensions.height)
  ctx.fillStyle = 'rgba(2, 6, 23, 0.35)'
  ctx.fillRect(0, 0, dimensions.width, dimensions.height)
  ctx.lineWidth = Math.max(0.75, dimensions.width / 1100)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'

  for (let y = 0; y < map.height; y += 1) {
    for (let x = 0; x < map.width; x += 1) {
      const currentIndex = y * map.width + x
      const currentPoint = vertices[currentIndex]

      if (x + 1 < map.width) {
        const rightPoint = vertices[currentIndex + 1]
        const ratio = (currentPoint.z + rightPoint.z + 12) / 24
        drawLine(
          ctx,
          currentPoint,
          rightPoint,
          mixColor(currentPoint.color, rightPoint.color, 0.5),
          0.25 + Math.max(0, Math.min(0.4, ratio * 0.16)),
        )
      }

      if (y + 1 < map.height) {
        const belowPoint = vertices[currentIndex + map.width]
        const ratio = (currentPoint.z + belowPoint.z + 12) / 24
        drawLine(
          ctx,
          currentPoint,
          belowPoint,
          mixColor(currentPoint.color, belowPoint.color, 0.5),
          0.25 + Math.max(0, Math.min(0.4, ratio * 0.16)),
        )
      }
    }
  }

  ctx.globalAlpha = 1
}

export function createFdfRenderer(canvas: HTMLCanvasElement, options: FdfRendererOptions = {}): FdfRenderer {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return {
      start() {},
      destroy() {},
      resize() {},
    }
  }

  const map = parseMapSource(options.source ?? DEFAULT_MAP_SOURCE)
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const maxDevicePixelRatio = options.maxDevicePixelRatio ?? 1.5
  let rafId = 0
  let disposed = false

  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect()
    const devicePixelRatio = Math.min(window.devicePixelRatio || 1, maxDevicePixelRatio)

    canvas.width = Math.max(1, Math.floor(rect.width * devicePixelRatio))
    canvas.height = Math.max(1, Math.floor(rect.height * devicePixelRatio))
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
  }

  const draw = (time: number) => {
    if (disposed) {
      return
    }

    renderFrame(ctx, canvas, map, time)

    if (!reducedMotion) {
      rafId = window.requestAnimationFrame(draw)
    }
  }

  const start = () => {
    resizeCanvas()
    draw(0)
  }

  const destroy = () => {
    disposed = true
    if (rafId) {
      window.cancelAnimationFrame(rafId)
    }
  }

  return {
    start,
    destroy,
    resize: resizeCanvas,
  }
}