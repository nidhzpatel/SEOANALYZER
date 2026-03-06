import { useEffect, useRef } from 'react'

export default function ScoreGauge({ score, grade, size = 180 }) {
    const canvasRef = useRef(null)
    const animatedScore = useRef(0)

    const getScoreColor = (s) => {
        if (s >= 90) return '#10b981'
        if (s >= 70) return '#f59e0b'
        if (s >= 50) return '#f97316'
        return '#ef4444'
    }

    const getGradeLabel = (g) => {
        const labels = { A: 'Excellent', B: 'Good', C: 'Average', D: 'Below Average', F: 'Poor' }
        return labels[g] || 'Unknown'
    }

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        canvas.width = size * dpr
        canvas.height = size * dpr
        ctx.scale(dpr, dpr)

        const centerX = size / 2
        const centerY = size / 2
        const radius = size / 2 - 16
        const lineWidth = 10

        const startAngle = 0.75 * Math.PI
        const endAngle = 2.25 * Math.PI
        const totalAngle = endAngle - startAngle

        let currentVal = 0
        const targetVal = Math.round(score)
        const duration = 1500
        const startTime = performance.now()

        const animate = (now) => {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3)
            currentVal = eased * targetVal

            ctx.clearRect(0, 0, size, size)

            // Background arc
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, startAngle, endAngle)
            ctx.strokeStyle = 'rgba(255,255,255,0.06)'
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.stroke()

            // Score arc
            const scoreAngle = startAngle + (currentVal / 100) * totalAngle
            const color = getScoreColor(currentVal)

            // Glow effect
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, startAngle, scoreAngle)
            ctx.strokeStyle = color
            ctx.lineWidth = lineWidth + 4
            ctx.lineCap = 'round'
            ctx.shadowColor = color
            ctx.shadowBlur = 20
            ctx.stroke()
            ctx.shadowBlur = 0

            // Main arc
            ctx.beginPath()
            ctx.arc(centerX, centerY, radius, startAngle, scoreAngle)
            ctx.strokeStyle = color
            ctx.lineWidth = lineWidth
            ctx.lineCap = 'round'
            ctx.stroke()

            // Score text
            ctx.fillStyle = '#f1f5f9'
            ctx.font = `800 ${size * 0.24}px Inter, sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(Math.round(currentVal), centerX, centerY - 8)

            // "/ 100" text
            ctx.fillStyle = '#64748b'
            ctx.font = `500 ${size * 0.08}px Inter, sans-serif`
            ctx.fillText('/ 100', centerX, centerY + size * 0.13)

            if (progress < 1) {
                requestAnimationFrame(animate)
            }
        }

        requestAnimationFrame(animate)
    }, [score, size])

    return (
        <div className="score-gauge" style={{ animation: 'scoreReveal 0.8s ease-out both' }}>
            <canvas
                ref={canvasRef}
                style={{ width: `${size}px`, height: `${size}px` }}
            />
            <div className="grade-badge" style={{ backgroundColor: getScoreColor(score) + '20', color: getScoreColor(score) }}>
                <span className="grade-letter">{grade}</span>
                <span className="grade-label">{getGradeLabel(grade)}</span>
            </div>
        </div>
    )
}
