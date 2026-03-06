export default function ReportHistory({ reports, onSelect, activeId }) {
    if (!reports || reports.length === 0) return null

    const getScoreColor = (s) => {
        if (s >= 90) return 'var(--score-green)'
        if (s >= 70) return 'var(--score-yellow)'
        if (s >= 50) return 'var(--score-orange)'
        return 'var(--score-red)'
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const truncateUrl = (url) => {
        try {
            const u = new URL(url)
            const path = u.pathname === '/' ? '' : u.pathname
            const display = u.hostname + path
            return display.length > 35 ? display.slice(0, 35) + '…' : display
        } catch {
            return url.slice(0, 35)
        }
    }

    return (
        <div className="report-history">
            <h3 className="history-title">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                </svg>
                Recent Reports
            </h3>
            <div className="history-list">
                {reports.map((r) => (
                    <button
                        key={r.id}
                        className={`history-item glass-card ${activeId === r.id ? 'active' : ''}`}
                        onClick={() => onSelect(r.id)}
                        id={`report-${r.id}`}
                    >
                        <div
                            className="history-score"
                            style={{ color: getScoreColor(r.overall_score) }}
                        >
                            {Math.round(r.overall_score)}
                        </div>
                        <div className="history-info">
                            <span className="history-url">{truncateUrl(r.url)}</span>
                            <span className="history-date">{formatDate(r.created_at)}</span>
                        </div>
                        <span
                            className="history-grade"
                            style={{
                                backgroundColor: getScoreColor(r.overall_score) + '20',
                                color: getScoreColor(r.overall_score),
                            }}
                        >
                            {r.grade}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    )
}
