import { useState } from 'react'

const priorityColors = {
    high: '#f43f5e',
    medium: '#f59e0b',
    low: '#10b981',
}

const priorityLabels = {
    high: '🔴 High',
    medium: '🟡 Medium',
    low: '🟢 Low',
}

function AIRecommendations({ report }) {
    const [expandedIdx, setExpandedIdx] = useState(null)

    const {
        ai_recommendations = [],
        ai_suggested_title = '',
        ai_suggested_meta = '',
        ai_summary = '',
        ai_content_analysis = {},
        ai_score = 50,
    } = report

    if (!ai_summary && ai_recommendations.length === 0) return null

    const toggleExpand = (idx) => {
        setExpandedIdx(expandedIdx === idx ? null : idx)
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
    }

    return (
        <section className="ai-section animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            {/* AI Header */}
            <div className="ai-header">
                <span className="ai-sparkle">✨</span>
                <h2>AI-Powered Insights</h2>
                <span className="ai-badge">Powered by Ollama</span>
            </div>

            {/* AI Summary */}
            {ai_summary && (
                <div className="ai-summary glass-card">
                    <h3>🧠 SEO Intelligence Summary</h3>
                    <p>{ai_summary}</p>
                </div>
            )}

            {/* AI Content Score */}
            {ai_content_analysis && ai_content_analysis.content_summary && (
                <div className="ai-content-card glass-card">
                    <h3>📊 Content Analysis</h3>
                    <div className="content-scores">
                        {[
                            { label: 'Quality', key: 'content_quality_score' },
                            { label: 'Readability', key: 'readability_score' },
                            { label: 'Keywords', key: 'keyword_relevance' },
                            { label: 'Topic Clarity', key: 'topic_clarity' },
                            { label: 'Depth', key: 'content_depth' },
                        ].map(({ label, key }) => {
                            const val = ai_content_analysis[key]
                            if (val === undefined) return null
                            return (
                                <div key={key} className="content-score-item">
                                    <span className="content-score-label">{label}</span>
                                    <div className="content-score-bar">
                                        <div
                                            className="content-score-fill"
                                            style={{
                                                width: `${val * 10}%`,
                                                backgroundColor:
                                                    val >= 7 ? '#10b981' : val >= 4 ? '#f59e0b' : '#f43f5e',
                                            }}
                                        />
                                    </div>
                                    <span className="content-score-val">{val}/10</span>
                                </div>
                            )
                        })}
                    </div>
                    <p className="content-summary-text">{ai_content_analysis.content_summary}</p>
                </div>
            )}

            {/* Suggested Meta Tags */}
            {(ai_suggested_title || ai_suggested_meta) && (
                <div className="ai-meta-card glass-card">
                    <h3>🏷️ Suggested Meta Tags</h3>
                    {ai_suggested_title && (
                        <div className="meta-suggestion">
                            <div className="meta-label-row">
                                <span className="meta-label">Title Tag</span>
                                <button
                                    className="copy-btn"
                                    onClick={() => copyToClipboard(ai_suggested_title)}
                                    title="Copy to clipboard"
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <code className="meta-code">{ai_suggested_title}</code>
                            <span className="meta-chars">{ai_suggested_title.length} characters</span>
                        </div>
                    )}
                    {ai_suggested_meta && (
                        <div className="meta-suggestion">
                            <div className="meta-label-row">
                                <span className="meta-label">Meta Description</span>
                                <button
                                    className="copy-btn"
                                    onClick={() => copyToClipboard(ai_suggested_meta)}
                                    title="Copy to clipboard"
                                >
                                    📋 Copy
                                </button>
                            </div>
                            <code className="meta-code">{ai_suggested_meta}</code>
                            <span className="meta-chars">{ai_suggested_meta.length} characters</span>
                        </div>
                    )}
                </div>
            )}

            {/* Recommendations */}
            {ai_recommendations.length > 0 && (
                <div className="ai-recs-card glass-card">
                    <h3>🎯 Actionable Recommendations</h3>
                    <div className="recs-list">
                        {ai_recommendations.map((rec, idx) => (
                            <div
                                key={idx}
                                className={`rec-item ${expandedIdx === idx ? 'expanded' : ''}`}
                                onClick={() => toggleExpand(idx)}
                            >
                                <div className="rec-header">
                                    <span
                                        className="rec-priority"
                                        style={{
                                            color: priorityColors[rec.priority] || '#f59e0b',
                                        }}
                                    >
                                        {priorityLabels[rec.priority] || '🟡 Medium'}
                                    </span>
                                    <span className="rec-title">{rec.title}</span>
                                    <span className="rec-expand">{expandedIdx === idx ? '▲' : '▼'}</span>
                                </div>
                                {expandedIdx === idx && (
                                    <div className="rec-body">
                                        <p className="rec-desc">{rec.description}</p>
                                        {rec.impact && (
                                            <p className="rec-impact">
                                                <strong>Expected Impact:</strong> {rec.impact}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    )
}

export default AIRecommendations
