import { useEffect, useRef, useState } from 'react'
import rough from 'roughjs'
import './Canvas.css'

interface Point {
    x: number,
    y: number
}

interface Line {
    points: Array<Point>
}

function Canvas() {
    const [height, setHeight] = useState(640)
    const [width, setWidth] = useState(640)
    const divRef = useRef(null)

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

    console.log({ lines })

    useEffect(() => {
        const currentHeight: number = divRef?.current?.clientHeight || 640
        const calculatedWidth = (currentHeight / 16) * 9
        console.log({height: currentHeight, width: calculatedWidth})
        setHeight(currentHeight)
        setWidth(calculatedWidth)
    }, [])

    useEffect(() => {
        console.log('canvas')
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

    }, [lines, currentLine]) // seperate

    useEffect(() => document.addEventListener("touchmove", (e) => { e.preventDefault() }, { passive: false }), [])

    const addPoint = (x, y) => {
        if (isMouseDown) {
            setCurrentLine({ points: [...currentLine.points, { x, y }] })
        }
    }

    return (
        <div className='Painting' ref={divRef}>
            <canvas
                width={width}
                height={height}
                ref={canvasRef}
                onMouseDown={() => setMouseDown()}
                onMouseUp={() => setMouseUp()}
                onMouseOut={() => setMouseUp()}
                onMouseMove={(e) => {
                    const rect = canvasRef.current.getBoundingClientRect()

                    addPoint(e.clientX - rect.left, e.clientY - rect.top)
                    console.log({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                }}
                onTouchStart={() => setMouseDown()}
                onTouchEnd={() => setMouseUp()}
                onTouchMove={(e) => {
                    console.log({ touchCount: e.touches.length, e })
                    if (e.touches.length > 0) {
                        const rect = canvasRef.current.getBoundingClientRect()
                        const x = e.touches[0].clientX
                        const y = e.touches[0].clientY
                        // console.log({x,y})
                        addPoint(x - rect.left, y - rect.top)
                    }
                    // const rect = canvasRef.current.getBoundingClientRect();

                }}
            />
        </div>
    )
}

export default Canvas
