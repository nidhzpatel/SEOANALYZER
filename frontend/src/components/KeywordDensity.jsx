import React from 'react';

const KeywordDensity = ({ report }) => {
    if (!report || !report.seo_signals || !report.seo_signals.keyword_density) return null;

    const keywords = report.seo_signals.keyword_density.top_keywords || [];
    if (keywords.length === 0) return null;

    return (
        <section className="keyword-density-section glass-card animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="section-title">Keyword Analysis</h2>

            <div className="keywords-grid">
                <div className="keyword-list">
                    <h3>Top Keywords Detected</h3>
                    <div className="keyword-bars">
                        {keywords.map((kw, idx) => (
                            <div key={idx} className="kw-bar-container">
                                <div className="kw-info">
                                    <span className="kw-word">{kw.word}</span>
                                    <span className="kw-stat">{kw.count}x ({kw.density}%)</span>
                                </div>
                                <div className="kw-progress-track">
                                    <div
                                        className="kw-progress-fill"
                                        style={{ width: `${Math.min(100, kw.density * 5)}%`, backgroundColor: kw.density > 5 ? 'var(--accent-rose)' : 'var(--accent-blue)' }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default KeywordDensity;
