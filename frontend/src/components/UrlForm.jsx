import { useState } from 'react'

export default function UrlForm({ onAnalyze, isLoading }) {
    const [url, setUrl] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        let trimmed = url.trim()
        if (!trimmed) {
            setError('Please enter a URL')
            return
        }

        // Auto-add https:// if missing
        if (!/^https?:\/\//i.test(trimmed)) {
            trimmed = 'https://' + trimmed
            setUrl(trimmed)
        }

        try {
            new URL(trimmed)
        } catch {
            setError('Please enter a valid URL')
            return
        }

        onAnalyze(trimmed)
    }

    return (
        <div className="url-form-wrapper">
            <div className="url-form-header">
                <div className="logo-mark">
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                        <rect width="40" height="40" rx="12" fill="url(#logo-grad)" />
                        <path d="M12 20C12 15.58 15.58 12 20 12C22.21 12 24.21 12.9 25.66 14.34L23.83 16.17C22.9 15.24 21.52 14.67 20 14.67C17.05 14.67 14.67 17.05 14.67 20C14.67 22.95 17.05 25.33 20 25.33C22.42 25.33 24.44 23.72 25.07 21.5H20V18.83H28V20C28 24.42 24.42 28 20 28C15.58 28 12 24.42 12 20Z" fill="white" />
                        <defs>
                            <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40">
                                <stop stopColor="#3b82f6" />
                                <stop offset="1" stopColor="#8b5cf6" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                <h1>SEO Analyzer</h1>
                <p className="subtitle">Powered by LangGraph AI Pipeline</p>
            </div>

            <form onSubmit={handleSubmit} className="url-form">
                <div className="input-group">
                    <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        id="url-input"
                        placeholder="Enter website URL (e.g., example.com)"
                        value={url}
                        onChange={(e) => { setUrl(e.target.value); setError(''); }}
                        disabled={isLoading}
                        autoComplete="url"
                    />
                    <button type="submit" id="analyze-btn" disabled={isLoading}>
                        {isLoading ? (
                            <span className="btn-loading">
                                <span className="spinner" />
                                Analyzing...
                            </span>
                        ) : (
                            <span className="btn-content">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                Analyze
                            </span>
                        )}
                    </button>
                </div>
                {error && <p className="form-error">{error}</p>}
            </form>

            <div className="features-row">
                {[
                    { icon: '🔍', text: 'Deep crawling' },
                    { icon: '📊', text: 'SEO scoring' },
                    { icon: '⚡', text: 'Performance check' },
                    { icon: '📋', text: 'Issue detection' },
                ].map((f, i) => (
                    <div key={i} className="feature-chip">
                        <span>{f.icon}</span>
                        <span>{f.text}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
