import { useEffect, useRef, useState } from 'react'
import rough from 'roughjs'
import { RoughCanvas } from 'roughjs/bin/canvas'
import './Canvas.css'

interface Point {
    x: number,
    y: number
}

interface Line {
    points: Array<Point>
}

const drawLine = (rc: RoughCanvas, points: Point[]) => {
    points.forEach((v, i) => {
        const next = points[i + 1]

        if (v && next) {
            rc.line(v.x, v.y, next.x, next.y)
        }
    })
}

function Canvas() {
    const [height, setHeight] = useState(640)
    const [width, setWidth] = useState(640)

    const parentDivRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [isMouseDown, setIsMouseDown] = useState(false)

    const [lines, setLines] = useState(Array<Line>())
    const [currentLine, setCurrentLine] = useState<Line>({ points: Array<Point>() })

    const getRough = (): RoughCanvas => rough.canvas(canvasRef.current as HTMLCanvasElement)

    const getCanvasOffset = (): {left :number, top :number} => {
        const rect = canvasRef?.current?.getBoundingClientRect()
        
        return {
            left: rect?.left || 0,
            top: rect?.top || 0
        }
    }

    const addPoint = (x: number, y: number) => {
        if (isMouseDown) {
            setCurrentLine({ points: [...currentLine.points, { x, y }] })
        }
    }

    const setCanvasDimensions = () => {
        const currentHeight: number = parentDivRef?.current?.clientHeight || 640
        const calculatedWidth = (currentHeight / 16) * 9
        setHeight(currentHeight)
        setWidth(calculatedWidth)
    }

    const setMouseUp = () => setIsMouseDown(false)

    const setMouseDown = () => {
        setIsMouseDown(true)

        if (currentLine.points.length > 0) {
            setLines([...lines, currentLine])
            setCurrentLine({ points: Array<Point>() })
        }
    }

    useEffect(() => setCanvasDimensions(), [])
    useEffect(() => document.addEventListener("touchmove", (e) => { e.preventDefault() }, { passive: false }), [])

    useEffect(() => lines.forEach((line) => drawLine(getRough(), line.points)), [lines])
    useEffect(() => drawLine(getRough(), currentLine.points), [currentLine])

    return (
        <div className='Painting' ref={parentDivRef}>
            <canvas
                width={width}
                height={height}
                ref={canvasRef}
                onMouseDown={() => setMouseDown()}
                onMouseUp={() => setMouseUp()}
                onMouseOut={() => setMouseUp()}
                onMouseMove={(e) => {
                    const {left, top} = getCanvasOffset()
                    addPoint(e.clientX - left, e.clientY - top)
                }}
                onTouchStart={() => setMouseDown()}
                onTouchEnd={() => setMouseUp()}
                onTouchMove={(e) => {
                    console.log({ touchCount: e.touches.length, e })
                    if (e.touches.length > 0) {
                        const {left, top} = getCanvasOffset()
                        addPoint(e.touches[0].clientX - left, e.touches[0].clientY - top)
                    }
                }}
            />
        </div>
    )
}

export default Canvas
