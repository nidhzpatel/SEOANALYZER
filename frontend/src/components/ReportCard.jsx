export default function ReportCard({ title, score, icon, checks, color }) {
    const getBarColor = (s) => {
        if (s >= 90) return 'var(--score-green)'
        if (s >= 70) return 'var(--score-yellow)'
        if (s >= 50) return 'var(--score-orange)'
        return 'var(--score-red)'
    }

    const barColor = getBarColor(score)

    return (
        <div className="report-card glass-card">
            <div className="report-card-header">
                <div className="report-card-icon" style={{ background: color + '15', color: color }}>
                    {icon}
                </div>
                <div className="report-card-title">
                    <h3>{title}</h3>
                    <span className="report-card-score" style={{ color: barColor }}>
                        {Math.round(score)}<span className="score-small">/100</span>
                    </span>
                </div>
            </div>

            <div className="score-bar-track">
                <div
                    className="score-bar-fill"
                    style={{
                        width: `${score}%`,
                        backgroundColor: barColor,
                        boxShadow: `0 0 12px ${barColor}50`,
                    }}
                />
            </div>

            {checks && (
                <div className="checks-summary">
                    {checks.pass > 0 && (
                        <span className="check-tag pass">✓ {checks.pass} passed</span>
                    )}
                    {checks.warning > 0 && (
                        <span className="check-tag warning">⚠ {checks.warning} warnings</span>
                    )}
                    {checks.critical > 0 && (
                        <span className="check-tag critical">✕ {checks.critical} critical</span>
                    )}
                </div>
            )}
        </div>
    )
}
