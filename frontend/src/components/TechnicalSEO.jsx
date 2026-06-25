import React from 'react';

const TechnicalSEO = ({ report }) => {
    if (!report) return null;

    const signals = report.seo_signals || {};
    const speed = report.pagespeed_data || {};

    const renderStatus = (status) => {
        if (status === 'pass') return <span className="status-badge pass">✓</span>;
        if (status === 'warning') return <span className="status-badge warning">⚠</span>;
        if (status === 'fail' || status === 'critical') return <span className="status-badge fail">✗</span>;
        return <span className="status-badge info">ℹ</span>;
    };

    return (
        <section className="technical-seo-section glass-card animate-fade-in-up">
            <h2 className="section-title">Technical SEO Analysis</h2>

            <div className="tech-grid">
                {/* Tech Checks */}
                <div className="tech-card">
                    <h3>Core Technical Checks</h3>
                    <ul className="tech-list">
                        <li>
                            {renderStatus(signals.url_structure?.status)}
                            <span>HTTPS Enabled</span>
                        </li>
                        <li>
                            {renderStatus(signals.robots_txt?.status)}
                            <span>Robots.txt Present</span>
                        </li>
                        <li>
                            {renderStatus(signals.sitemap_xml?.status)}
                            <span>XML Sitemap Present</span>
                        </li>
                        <li>
                            {renderStatus(signals.canonical?.status)}
                            <span>Canonical Tag</span>
                        </li>
                        <li>
                            {renderStatus(signals.viewport?.status)}
                            <span>Mobile Viewport</span>
                        </li>
                        <li>
                            {renderStatus(signals.structured_data?.status)}
                            <span>Structured Data (JSON-LD)</span>
                        </li>
                    </ul>
                </div>

                {/* Core Web Vitals */}
                <div className="tech-card">
                    <h3>Core Web Vitals</h3>
                    <div className="metrics-simple-grid">
                        <div className="metric-box">
                            <span className="metric-name">LCP</span>
                            <span className="metric-val">{speed.lcp?.displayValue || 'N/A'}</span>
                            <span className="metric-desc">Largest Contentful Paint</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-name">CLS</span>
                            <span className="metric-val">{speed.cls?.displayValue || 'N/A'}</span>
                            <span className="metric-desc">Cumulative Layout Shift</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-name">INP</span>
                            <span className="metric-val">{speed.inp?.value || 'N/A'}</span>
                            <span className="metric-desc">Interaction to Next Paint</span>
                        </div>
                        <div className="metric-box">
                            <span className="metric-name">TBT</span>
                            <span className="metric-val">{speed.tbt?.displayValue || 'N/A'}</span>
                            <span className="metric-desc">Total Blocking Time</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Suggestions */}
            {speed.optimization_suggestions && speed.optimization_suggestions.length > 0 && (
                <div className="optimization-suggestions">
                    <h3>Page Speed Optimizations</h3>
                    <ul className="suggestion-list">
                        {speed.optimization_suggestions.map((sug, idx) => (
                            <li key={idx}>
                                <strong>{sug.title}</strong>
                                <p>{sug.description?.split('.')[0]}.</p>
                                {sug.savings_ms > 0 && <span className="savings-badge">Save {(sug.savings_ms / 1000).toFixed(2)}s</span>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default TechnicalSEO;
