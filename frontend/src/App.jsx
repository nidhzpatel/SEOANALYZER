import { useState, useEffect } from 'react'
import UrlForm from './components/UrlForm'
import ScoreGauge from './components/ScoreGauge'
import ReportCard from './components/ReportCard'
import IssueList from './components/IssueList'
import ReportHistory from './components/ReportHistory'
import AIRecommendations from './components/AIRecommendations'
import TechnicalSEO from './components/TechnicalSEO'
import KeywordDensity from './components/KeywordDensity'
import AIStrategy from './components/AIStrategy'
import SEOReportPDF from './components/SEOReportPDF'
import { PDFDownloadLink } from '@react-pdf/renderer'
import { analyzeUrl, fetchReports, fetchReport } from './api'
import './App.css'

function App() {
    const [report, setReport] = useState(null)
    const [reports, setReports] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        loadReports()
    }, [])

    const loadReports = async () => {
        try {
            const data = await fetchReports()
            setReports(data)
        } catch {
            // Ignore - reports will load when available
        }
    }

    const handleAnalyze = async (url) => {
        setIsLoading(true)
        setError('')
        setReport(null)

        try {
            const result = await analyzeUrl(url)
            setReport(result)
            loadReports() // Refresh history
        } catch (err) {
            setError(err.message || 'Analysis failed. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSelectReport = async (id) => {
        try {
            const data = await fetchReport(id)
            setReport(data)
            setError('')
        } catch {
            setError('Failed to load report')
        }
    }

    const getChecks = (issues, category) => {
        const catIssues = issues.filter((i) => i.category === category)
        return {
            pass: catIssues.filter((i) => i.severity === 'pass').length,
            warning: catIssues.filter((i) => i.severity === 'warning' || i.severity === 'info').length,
            critical: catIssues.filter((i) => i.severity === 'critical').length,
        }
    }

    return (
        <div className="app">
            {/* Hero Section */}
            <header className="hero">
                <UrlForm onAnalyze={handleAnalyze} isLoading={isLoading} />
            </header>

            {/* Loading State */}
            {isLoading && (
                <div className="loading-state animate-fade-in-up">
                    <div className="loading-card glass-card">
                        <div className="loading-spinner-lg" />
                        <h2>Analyzing your website…</h2>
                        <p className="loading-subtitle">Running LangGraph + AI pipeline</p>
                        <div className="pipeline-steps">
                            <div className="pipeline-step active">
                                <span className="step-dot" />
                                <span>Crawl</span>
                            </div>
                            <div className="pipeline-line" />
                            <div className="pipeline-step">
                                <span className="step-dot" />
                                <span>SEO</span>
                            </div>
                            <div className="pipeline-line" />
                            <div className="pipeline-step">
                                <span className="step-dot" />
                                <span>Speed</span>
                            </div>
                            <div className="pipeline-line" />
                            <div className="pipeline-step">
                                <span className="step-dot" />
                                <span>🤖 AI</span>
                            </div>
                            <div className="pipeline-line" />
                            <div className="pipeline-step">
                                <span className="step-dot" />
                                <span>Score</span>
                            </div>
                            <div className="pipeline-line" />
                            <div className="pipeline-step">
                                <span className="step-dot" />
                                <span>✨ Tips</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Error State */}
            {error && !isLoading && (
                <div className="error-state animate-fade-in-up">
                    <div className="error-card glass-card">
                        <span className="error-icon">⚠️</span>
                        <h3>Analysis Failed</h3>
                        <p>{error}</p>
                    </div>
                </div>
            )}

            {/* Report Dashboard */}
            {report && !isLoading && (
                <main id="report-dashboard" className="report-dashboard animate-fade-in-up">
                    {/* Score Overview */}
                    <section className="score-section">
                        <PDFDownloadLink
                            document={<SEOReportPDF report={report} />}
                            fileName={`SEO_Report_${new URL(report.url).hostname}.pdf`}
                            className="download-btn"
                            id="download-btn"
                        >
                            {({ loading }) =>
                                loading
                                    ? <><span className="btn-icon">⏳</span> Preparing PDF...</>
                                    : <><span className="btn-icon">📥</span> Download Report</>
                            }
                        </PDFDownloadLink>
                        <div className="analyzed-url">
                            <span className="url-label">Results for</span>
                            <a href={report.url} target="_blank" rel="noopener noreferrer" className="url-link">
                                {report.url}
                            </a>
                        </div>
                        <ScoreGauge score={report.overall_score} grade={report.grade} />
                    </section>

                    {/* Category Cards */}
                    <section className="category-cards">
                        <ReportCard
                            title="On-Page SEO"
                            score={report.onpage_seo_score}
                            icon="📝"
                            color="#3b82f6"
                            checks={getChecks(report.issues, 'onpage')}
                        />
                        <ReportCard
                            title="Technical SEO"
                            score={report.technical_seo_score}
                            icon="⚙️"
                            color="#8b5cf6"
                            checks={getChecks(report.issues, 'technical')}
                        />
                        <ReportCard
                            title="Performance"
                            score={report.performance_score}
                            icon="⚡"
                            color="#10b981"
                            checks={getChecks(report.issues, 'performance')}
                        />
                        <ReportCard
                            title="AI Content"
                            score={report.ai_score || 50}
                            icon="🤖"
                            color="#a855f7"
                            checks={getChecks(report.issues, 'content')}
                        />
                    </section>

                    {/* Advanced Analysis Sections */}
                    <KeywordDensity report={report} />
                    <TechnicalSEO report={report} />

                    {/* AI Recommendations & Strategy */}
                    <AIStrategy strategy={report.ai_recommendations && !Array.isArray(report.ai_recommendations) ? report.ai_recommendations.strategy : null} />
                    <AIRecommendations report={report} />

                    {/* Issues */}
                    {report.issues && report.issues.length > 0 && (
                        <section style={{ animationDelay: '0.4s' }} className="animate-fade-in-up">
                            <IssueList issues={report.issues} />
                        </section>
                    )}
                </main>
            )}

            {/* Report History Sidebar */}
            {reports.length > 0 && (
                <aside className="sidebar">
                    <ReportHistory
                        reports={reports}
                        onSelect={handleSelectReport}
                        activeId={report?.id}
                    />
                </aside>
            )}
        </div>
    )
}

export default App
