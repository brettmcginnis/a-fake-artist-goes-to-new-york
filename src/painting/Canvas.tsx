import { useEffect, useRef, useState } from 'react'
import rough from 'roughjs'

interface Point {
    x: number,
    y: number
}

interface Line {
    points: Array<Point>
}

function Canvas() {
    const canvasRef = useRef(null)

    const [isMouseDown, setIsMouseDown] = useState(false)
    const setMouseDown = () => {
        setIsMouseDown(true)

        if (currentLine.points.length > 0) {
            setLines([...lines, currentLine])
            setCurrentLine({ points: Array<Point>() })
        }
    }
    const setMouseUp = () => setIsMouseDown(false)

    const [lines, setLines] = useState(Array<Line>())
    const [currentLine, setCurrentLine] = useState<Line>({ points: Array<Point>() })

    console.log({lines})

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        const rc = rough.canvas(canvas);

        const drawLine = (points: Point[]) => {
            points.forEach((v, i) => {
                const next = points[i + 1]

                if (v && next) {
                    rc.line(v.x, v.y, next.x, next.y)
                }
            })
        }

        lines.forEach((line) => drawLine(line.points))
        drawLine(currentLine.points)

    }, [lines, currentLine])

    const addPoint = (x, y) => {
        if (isMouseDown) {
            setCurrentLine({ points: [...currentLine.points, { x, y }] })
        }
    }

    return (
        <div>
            <canvas
                ref={canvasRef}
                width={640}
                height={425}
                onMouseDown={() => setMouseDown()}
                onMouseUp={() => setMouseUp()}
                onMouseOut={() => setMouseUp()}
                onMouseMove={(e) => {
                    const rect = canvasRef.current.getBoundingClientRect();
                    addPoint(e.clientX - rect.left, e.clientY - rect.top)
                }}
            />
        </div>
    )
}

export default Canvas
