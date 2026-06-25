import React from 'react';

const AIStrategy = ({ strategy }) => {
    if (!strategy || Object.keys(strategy).length === 0) return null;

    return (
        <section className="ai-strategy-section glass-card animate-fade-in-up" style={{ animationDelay: '0.2s', borderColor: 'var(--accent-purple)' }}>
            <div className="ai-header">
                <span className="ai-sparkle">🚀</span>
                <h2>AI SEO Strategy</h2>
            </div>

            <div className="strategy-grid">
                {strategy.target_keywords && strategy.target_keywords.length > 0 && (
                    <div className="strategy-card">
                        <h3>Target Keywords</h3>
                        <ul>
                            {strategy.target_keywords.map((kw, idx) => (
                                <li key={idx}>🎯 {kw}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {strategy.content_suggestions && strategy.content_suggestions.length > 0 && (
                    <div className="strategy-card">
                        <h3>Content Strategy</h3>
                        <ul>
                            {strategy.content_suggestions.map((sug, idx) => (
                                <li key={idx}>📝 {sug}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {strategy.backlink_strategy && strategy.backlink_strategy.length > 0 && (
                    <div className="strategy-card">
                        <h3>Backlink Strategy</h3>
                        <ul>
                            {strategy.backlink_strategy.map((sug, idx) => (
                                <li key={idx}>🔗 {sug}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </section>
    );
};

export default AIStrategy;
