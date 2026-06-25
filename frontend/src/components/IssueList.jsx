import { useState } from 'react'

export default function IssueList({ issues }) {
    const [filter, setFilter] = useState('all')
    const [expandedId, setExpandedId] = useState(null)

    const severityOrder = { critical: 0, warning: 1, info: 2, pass: 3 }

    const filtered = filter === 'all'
        ? issues
        : issues.filter((i) => i.severity === filter)

    const counts = {
        all: issues.length,
        critical: issues.filter((i) => i.severity === 'critical').length,
        warning: issues.filter((i) => i.severity === 'warning').length,
        info: issues.filter((i) => i.severity === 'info').length,
    }

    const getSeverityIcon = (sev) => {
        switch (sev) {
            case 'critical': return '✕'
            case 'warning': return '⚠'
            case 'info': return 'ℹ'
            case 'pass': return '✓'
            default: return '•'
        }
    }

    const getCategoryIcon = (cat) => {
        switch (cat) {
            case 'onpage': return '📝'
            case 'technical': return '⚙️'
            case 'performance': return '⚡'
            default: return '📋'
        }
    }

    return (
        <div className="issue-list-wrapper">
            <div className="issue-list-header">
                <h2>Priority Fix Roadmap</h2>
                <div className="issue-filters">
                    {['all', 'critical', 'warning', 'info'].map((f) => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? 'active' : ''} ${f}`}
                            onClick={() => setFilter(f)}
                            id={`filter-${f}`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                            <span className="filter-count">{counts[f]}</span>
                        </button>
                    ))}
                </div>
            </div>

            <div className="issue-list">
                {filtered.length === 0 ? (
                    <div className="no-issues">
                        <span>🎉</span>
                        <p>No issues found in this category!</p>
                    </div>
                ) : (
                    filtered.map((issue, idx) => (
                        <div
                            key={idx}
                            className={`issue-item glass-card ${issue.severity}`}
                            onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                            style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                            <div className="issue-item-main">
                                <span className={`severity-badge ${issue.severity}`}>
                                    {getSeverityIcon(issue.severity)}
                                </span>
                                <div className="issue-info">
                                    <div className="issue-title-row">
                                        <h4>{issue.title}</h4>
                                        <span className="category-tag">
                                            {getCategoryIcon(issue.category)} {issue.category}
                                        </span>
                                    </div>
                                    <p className="issue-message">{issue.message}</p>
                                </div>
                                <span className={`expand-icon ${expandedId === idx ? 'expanded' : ''}`}>
                                    ›
                                </span>
                            </div>
                            {expandedId === idx && issue.details && (
                                <div className="issue-details animate-fade-in">
                                    <p>{issue.details}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
