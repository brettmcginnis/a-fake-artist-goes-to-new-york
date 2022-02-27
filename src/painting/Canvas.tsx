import { useEffect, useRef } from 'react'
import rough from 'roughjs'

function Canvas() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
    
        const rc = rough.canvas(canvas);
        rc.rectangle(10, 10, 200, 200);
    }, [])

    return (
        <div>
            <canvas ref={canvasRef} width={640} height={425} />
        </div>
    )
}

export default Canvas
