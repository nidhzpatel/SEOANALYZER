import React from 'react';
import {
    Document, Page, Text, View, StyleSheet
} from '@react-pdf/renderer';

const colors = {
    primary: '#1e293b',
    secondary: '#334155',
    muted: '#64748b',
    white: '#ffffff',
    blue: '#3b82f6',
    green: '#10b981',
    amber: '#f59e0b',
    red: '#ef4444',
    purple: '#8b5cf6',
    lightGray: '#f1f5f9',
    borderColor: '#e2e8f0',
};

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        backgroundColor: colors.white,
        paddingTop: 36,
        paddingBottom: 48,
        paddingHorizontal: 40,
        fontSize: 10,
        color: colors.primary,
    },
    // Header
    header: {
        borderBottom: `2px solid ${colors.blue}`,
        paddingBottom: 16,
        marginBottom: 20,
    },
    appTitle: {
        fontSize: 22,
        fontFamily: 'Helvetica-Bold',
        color: colors.blue,
        marginBottom: 4,
    },
    urlText: {
        fontSize: 10,
        color: colors.muted,
        marginBottom: 4,
    },
    reportDate: {
        fontSize: 9,
        color: colors.muted,
    },
    // Section titles
    sectionTitle: {
        fontSize: 13,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginBottom: 10,
        marginTop: 18,
        borderBottom: `1px solid ${colors.borderColor}`,
        paddingBottom: 4,
    },
    subTitle: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: colors.secondary,
        marginBottom: 6,
        marginTop: 10,
    },
    // Score Section
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: colors.lightGray,
        borderRadius: 6,
        padding: 14,
    },
    scoreBig: {
        fontSize: 36,
        fontFamily: 'Helvetica-Bold',
        marginRight: 14,
    },
    scoreRight: {
        flex: 1,
    },
    gradeBadge: {
        fontSize: 14,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 4,
    },
    scoreSubLabel: {
        fontSize: 9,
        color: colors.muted,
    },
    // Category cards row
    cardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 14,
        gap: 8,
    },
    card: {
        flex: 1,
        backgroundColor: colors.lightGray,
        borderRadius: 6,
        padding: 10,
        marginHorizontal: 2,
    },
    cardTitle: {
        fontSize: 8,
        color: colors.muted,
        marginBottom: 4,
    },
    cardScore: {
        fontSize: 18,
        fontFamily: 'Helvetica-Bold',
    },
    // Table
    table: {
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: `1px solid ${colors.borderColor}`,
        paddingVertical: 5,
        paddingHorizontal: 4,
    },
    tableRowAlt: {
        backgroundColor: colors.lightGray,
    },
    tableLabel: {
        flex: 1,
        fontSize: 9,
        color: colors.secondary,
        fontFamily: 'Helvetica-Bold',
    },
    tableValue: {
        flex: 2,
        fontSize: 9,
        color: colors.primary,
    },
    // Check rows
    checkRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 4,
        borderBottom: `1px solid ${colors.borderColor}`,
    },
    checkIcon: {
        width: 14,
        fontSize: 10,
        marginRight: 6,
    },
    checkLabel: {
        flex: 1,
        fontSize: 9,
        color: colors.secondary,
    },
    checkStatus: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
    },
    // Issue item
    issueItem: {
        marginBottom: 6,
        padding: 8,
        borderRadius: 4,
    },
    issueTitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
    },
    issueMsg: {
        fontSize: 8,
        color: colors.secondary,
        lineHeight: 1.4,
    },
    // Recommendation
    recItem: {
        marginBottom: 8,
        padding: 8,
        backgroundColor: colors.lightGray,
        borderRadius: 4,
        borderLeft: `3px solid ${colors.blue}`,
    },
    recPriority: {
        fontSize: 8,
        fontFamily: 'Helvetica-Bold',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    recTitle: {
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
        marginBottom: 3,
    },
    recDesc: {
        fontSize: 8,
        color: colors.secondary,
        lineHeight: 1.4,
    },
    recImpact: {
        fontSize: 8,
        color: colors.green,
        marginTop: 3,
    },
    // Keyword row
    kwRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        borderBottom: `1px solid ${colors.borderColor}`,
    },
    kwWord: {
        flex: 1,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
    },
    kwCount: {
        width: 40,
        fontSize: 9,
        color: colors.muted,
        textAlign: 'center',
    },
    kwDensity: {
        width: 50,
        fontSize: 9,
        color: colors.blue,
        textAlign: 'right',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: colors.muted,
        borderTop: `1px solid ${colors.borderColor}`,
        paddingTop: 6,
    },
    // Strategy items
    strategyItem: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 4,
    },
    strategyBullet: {
        width: 12,
        fontSize: 8,
    },
    strategyText: {
        flex: 1,
        fontSize: 8.5,
        color: colors.secondary,
        lineHeight: 1.4,
    },
    // Metrics grid
    metricsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 6,
    },
    metricBox: {
        flex: 1,
        backgroundColor: colors.lightGray,
        borderRadius: 4,
        padding: 8,
        alignItems: 'center',
    },
    metricLabel: {
        fontSize: 8,
        color: colors.muted,
        marginBottom: 2,
        fontFamily: 'Helvetica-Bold',
    },
    metricValue: {
        fontSize: 11,
        fontFamily: 'Helvetica-Bold',
        color: colors.primary,
    },
    metricDesc: {
        fontSize: 7,
        color: colors.muted,
        marginTop: 2,
        textAlign: 'center',
    },
    // Content analysis scores
    contentScoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    contentScoreLabel: {
        width: 90,
        fontSize: 9,
        color: colors.secondary,
    },
    contentScoreBarBg: {
        flex: 1,
        height: 6,
        backgroundColor: colors.borderColor,
        borderRadius: 3,
        marginHorizontal: 8,
    },
    contentScoreBarFill: {
        height: 6,
        borderRadius: 3,
    },
    contentScoreVal: {
        width: 30,
        fontSize: 9,
        fontFamily: 'Helvetica-Bold',
        textAlign: 'right',
    },
});

const getScoreColor = (score) => {
    if (score >= 80) return colors.green;
    if (score >= 60) return colors.amber;
    if (score >= 40) return colors.amber;
    return colors.red;
};

const getStatusIcon = (status) => {
    if (status === 'pass') return '✓';
    if (status === 'warning') return '⚠';
    if (status === 'fail') return '✗';
    return 'ℹ';
};

const getStatusColor = (status) => {
    if (status === 'pass') return colors.green;
    if (status === 'warning') return colors.amber;
    if (status === 'fail') return colors.red;
    return colors.blue;
};

const getSeverityColor = (severity) => {
    if (severity === 'critical') return '#fef2f2';
    if (severity === 'warning') return '#fffbeb';
    if (severity === 'pass') return '#f0fdf4';
    return '#eff6ff';
};

const getSeverityTextColor = (severity) => {
    if (severity === 'critical') return colors.red;
    if (severity === 'warning') return colors.amber;
    if (severity === 'pass') return colors.green;
    return colors.blue;
};

const getPriorityColor = (priority) => {
    if (priority === 'high') return colors.red;
    if (priority === 'medium') return colors.amber;
    return colors.green;
};

const PageFooter = ({ url }) => (
    <Text style={styles.footer} render={({ pageNumber, totalPages }) =>
        `SEO Analysis Report — ${url}  •  Page ${pageNumber} of ${totalPages}  •  Generated by SEO Analyzer`
    } fixed />
);

const SEOReportPDF = ({ report }) => {
    const {
        url = '',
        overall_score = 0,
        grade = 'F',
        onpage_seo_score = 0,
        technical_seo_score = 0,
        performance_score = 0,
        ai_score = 0,
        issues = [],
        seo_signals = {},
        pagespeed_data = {},
        ai_recommendations = {},
        ai_content_analysis = {},
        ai_summary = '',
        ai_suggested_title = '',
        ai_suggested_meta = '',
        created_at = '',
    } = report;

    const crawl = report.crawl_data || {};
    const keywordDensity = seo_signals.keyword_density?.top_keywords || crawl.keyword_density || [];
    const recsArray = Array.isArray(ai_recommendations) ? ai_recommendations : (ai_recommendations?.recommendations || []);
    const strategy = !Array.isArray(ai_recommendations) ? (ai_recommendations?.strategy || {}) : {};
    const criticalIssues = issues.filter(i => i.severity === 'critical');
    const warningIssues = issues.filter(i => i.severity === 'warning');
    const infoIssues = issues.filter(i => i.severity === 'info');
    const dateStr = created_at ? new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';

    return (
        <Document title={`SEO Report: ${url}`} author="SEO Analyzer" creator="SEO Analyzer">

            {/* ─── Page 1: Overview & Category Scores ─── */}
            <Page style={styles.page}>
                <PageFooter url={url} />

                <View style={styles.header}>
                    <Text style={styles.appTitle}>SEO Analysis Report</Text>
                    <Text style={styles.urlText}>URL: {url}</Text>
                    <Text style={styles.reportDate}>Generated: {dateStr}</Text>
                </View>

                {/* Overall Score */}
                <View style={styles.scoreRow}>
                    <Text style={[styles.scoreBig, { color: getScoreColor(overall_score) }]}>
                        {Math.round(overall_score)}
                    </Text>
                    <View style={styles.scoreRight}>
                        <Text style={[styles.gradeBadge, { color: getScoreColor(overall_score) }]}>
                            Grade: {grade}  —  {overall_score >= 80 ? 'Excellent' : overall_score >= 60 ? 'Good' : overall_score >= 40 ? 'Needs Work' : 'Poor'}
                        </Text>
                        <Text style={styles.scoreSubLabel}>Overall SEO Health Score out of 100</Text>
                    </View>
                </View>

                {/* Category Scores */}
                <Text style={styles.sectionTitle}>Score Breakdown</Text>
                <View style={styles.cardRow}>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>On-Page SEO</Text>
                        <Text style={[styles.cardScore, { color: getScoreColor(onpage_seo_score) }]}>{Math.round(onpage_seo_score)}/100</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Technical SEO</Text>
                        <Text style={[styles.cardScore, { color: getScoreColor(technical_seo_score) }]}>{Math.round(technical_seo_score)}/100</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Performance</Text>
                        <Text style={[styles.cardScore, { color: getScoreColor(performance_score) }]}>{Math.round(performance_score)}/100</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>AI Content</Text>
                        <Text style={[styles.cardScore, { color: getScoreColor(ai_score) }]}>{Math.round(ai_score)}/100</Text>
                    </View>
                </View>

                {/* Meta Tag Summary */}
                <Text style={styles.sectionTitle}>On-Page SEO Details</Text>
                <View style={styles.table}>
                    {[
                        { label: 'Page Title', value: crawl.title || 'Not found', note: crawl.title_length ? ` (${crawl.title_length} chars)` : '' },
                        { label: 'Meta Description', value: crawl.meta_description || 'Missing', note: crawl.meta_description_length ? ` (${crawl.meta_description_length} chars)` : '' },
                        { label: 'H1 Tags', value: crawl.headings?.h1?.join(', ') || 'None' },
                        { label: 'Word Count', value: crawl.word_count ? `${crawl.word_count} words` : 'N/A' },
                        { label: 'Internal Links', value: crawl.internal_links?.toString() || 'N/A' },
                        { label: 'External Links', value: crawl.external_links?.toString() || 'N/A' },
                        { label: 'Images', value: crawl.images_total ? `${crawl.images_total} total, ${crawl.images_without_alt || 0} without alt` : 'N/A' },
                        { label: 'Canonical URL', value: crawl.canonical_url || 'Not set' },
                        { label: 'OG Title', value: crawl.og_title || 'Not set' },
                        { label: 'OG Description', value: crawl.og_description || 'Not set' },
                    ].map((row, idx) => (
                        <View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                            <Text style={styles.tableLabel}>{row.label}</Text>
                            <Text style={styles.tableValue} numberOfLines={2}>{row.value}{row.note || ''}</Text>
                        </View>
                    ))}
                </View>

                {/* Technical Checks */}
                <Text style={styles.sectionTitle}>Technical SEO Checks</Text>
                <View style={styles.table}>
                    {[
                        { label: 'HTTPS / Secure', key: 'url_structure' },
                        { label: 'Robots.txt Present', key: 'robots_txt' },
                        { label: 'XML Sitemap Present', key: 'sitemap_xml' },
                        { label: 'Canonical Tag', key: 'canonical' },
                        { label: 'Mobile Viewport', key: 'viewport' },
                        { label: 'Structured Data (JSON-LD)', key: 'structured_data' },
                        { label: 'Page Favicon', key: 'favicon' },
                        { label: 'Noindex Tag', key: 'noindex' },
                    ].map((check, idx) => {
                        const signal = seo_signals[check.key] || {};
                        const status = signal.status || 'info';
                        return (
                            <View key={idx} style={[styles.checkRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                                <Text style={[styles.checkIcon, { color: getStatusColor(status) }]}>{getStatusIcon(status)}</Text>
                                <Text style={styles.checkLabel}>{check.label}</Text>
                                <Text style={[styles.checkStatus, { color: getStatusColor(status) }]}>{status.toUpperCase()}</Text>
                            </View>
                        );
                    })}
                </View>

                {crawl.schema_types && crawl.schema_types.length > 0 && (
                    <View style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 9, color: colors.muted }}>
                            Schema Types Detected: {crawl.schema_types.join(', ')}
                        </Text>
                    </View>
                )}
            </Page>

            {/* ─── Page 2: Performance & Core Web Vitals + Keywords ─── */}
            <Page style={styles.page}>
                <PageFooter url={url} />
                <Text style={styles.sectionTitle}>Core Web Vitals & Performance</Text>

                {pagespeed_data.performance_score !== null && pagespeed_data.performance_score !== undefined ? (
                    <>
                        <View style={styles.metricsRow}>
                            {[
                                { label: 'Perf Score', value: `${pagespeed_data.performance_score || 'N/A'}/100`, desc: 'Overall Performance' },
                                { label: 'LCP', value: pagespeed_data.lcp?.displayValue || 'N/A', desc: 'Largest Contentful Paint' },
                                { label: 'FCP', value: pagespeed_data.fcp?.displayValue || 'N/A', desc: 'First Contentful Paint' },
                            ].map((m, idx) => (
                                <View key={idx} style={styles.metricBox}>
                                    <Text style={styles.metricLabel}>{m.label}</Text>
                                    <Text style={styles.metricValue}>{m.value}</Text>
                                    <Text style={styles.metricDesc}>{m.desc}</Text>
                                </View>
                            ))}
                        </View>
                        <View style={styles.metricsRow}>
                            {[
                                { label: 'CLS', value: pagespeed_data.cls?.displayValue || 'N/A', desc: 'Cumulative Layout Shift' },
                                { label: 'TBT', value: pagespeed_data.tbt?.displayValue || 'N/A', desc: 'Total Blocking Time' },
                                { label: 'TTI', value: pagespeed_data.tti?.displayValue || 'N/A', desc: 'Time to Interactive' },
                                { label: 'INP', value: pagespeed_data.inp?.value !== undefined ? `${pagespeed_data.inp.value}ms` : 'N/A', desc: 'Interaction to Next Paint' },
                            ].map((m, idx) => (
                                <View key={idx} style={styles.metricBox}>
                                    <Text style={styles.metricLabel}>{m.label}</Text>
                                    <Text style={styles.metricValue}>{m.value}</Text>
                                    <Text style={styles.metricDesc}>{m.desc}</Text>
                                </View>
                            ))}
                        </View>

                        {pagespeed_data.optimization_suggestions?.length > 0 && (
                            <>
                                <Text style={styles.subTitle}>Optimization Opportunities</Text>
                                {pagespeed_data.optimization_suggestions.map((sug, idx) => (
                                    <View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlt : {}]}>
                                        <Text style={styles.tableLabel}>{sug.title}</Text>
                                        <Text style={styles.tableValue} numberOfLines={2}>{sug.savings_ms > 0 ? `Save ~${(sug.savings_ms / 1000).toFixed(2)}s — ` : ''}{(sug.description || '').split('.')[0]}.</Text>
                                    </View>
                                ))}
                            </>
                        )}
                    </>
                ) : (
                    <Text style={{ fontSize: 9, color: colors.muted, marginBottom: 10 }}>PageSpeed data not available for this report.</Text>
                )}

                {/* Keyword Analysis */}
                {keywordDensity.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Keyword Density Analysis</Text>
                        <View style={[styles.tableRow, { backgroundColor: colors.lightGray }]}>
                            <Text style={[styles.kwWord, { color: colors.muted }]}>Keyword</Text>
                            <Text style={[styles.kwCount, { color: colors.muted, fontFamily: 'Helvetica-Bold' }]}>Count</Text>
                            <Text style={[styles.kwDensity, { color: colors.muted, fontFamily: 'Helvetica-Bold' }]}>Density</Text>
                        </View>
                        {keywordDensity.slice(0, 20).map((kw, idx) => (
                            <View key={idx} style={[styles.kwRow, idx % 2 === 1 ? { backgroundColor: colors.lightGray } : {}]}>
                                <Text style={styles.kwWord}>{kw.word}</Text>
                                <Text style={styles.kwCount}>{kw.count}x</Text>
                                <Text style={[styles.kwDensity, { color: kw.density > 5 ? colors.red : colors.blue }]}>{kw.density}%</Text>
                            </View>
                        ))}
                    </>
                )}
            </Page>

            {/* ─── Page 3: AI Insights & Strategy ─── */}
            <Page style={styles.page}>
                <PageFooter url={url} />
                <Text style={styles.sectionTitle}>AI-Powered Content Analysis</Text>

                {ai_content_analysis?.content_summary ? (
                    <>
                        <Text style={{ fontSize: 9, color: colors.secondary, lineHeight: 1.5, marginBottom: 10 }}>
                            {ai_content_analysis.content_summary}
                        </Text>

                        {/* Content Scores */}
                        {[
                            { label: 'Content Quality', key: 'content_quality_score' },
                            { label: 'Readability', key: 'readability_score' },
                            { label: 'Keyword Relevance', key: 'keyword_relevance' },
                            { label: 'Topic Clarity', key: 'topic_clarity' },
                            { label: 'Content Depth', key: 'content_depth' },
                        ].map(({ label, key }) => {
                            const val = ai_content_analysis[key];
                            if (!val) return null;
                            const fillColor = val >= 7 ? colors.green : val >= 4 ? colors.amber : colors.red;
                            return (
                                <View key={key} style={styles.contentScoreRow}>
                                    <Text style={styles.contentScoreLabel}>{label}</Text>
                                    <View style={styles.contentScoreBarBg}>
                                        <View style={[styles.contentScoreBarFill, { width: `${val * 10}%`, backgroundColor: fillColor }]} />
                                    </View>
                                    <Text style={styles.contentScoreVal}>{val}/10</Text>
                                </View>
                            );
                        })}

                        {ai_content_analysis.search_intent && (
                            <Text style={{ fontSize: 9, color: colors.muted, marginTop: 8 }}>
                                Search Intent: <Text style={{ color: colors.primary, fontFamily: 'Helvetica-Bold' }}>{ai_content_analysis.search_intent}</Text>
                            </Text>
                        )}
                        {ai_content_analysis.topic_coverage && (
                            <Text style={{ fontSize: 9, color: colors.muted, marginTop: 4 }}>
                                Topic Coverage Score: <Text style={{ color: colors.primary, fontFamily: 'Helvetica-Bold' }}>{ai_content_analysis.topic_coverage}%</Text>
                            </Text>
                        )}
                        {ai_content_analysis.missing_subtopics?.length > 0 && (
                            <Text style={{ fontSize: 9, color: colors.muted, marginTop: 4 }}>
                                Missing Subtopics: {ai_content_analysis.missing_subtopics.join(', ')}
                            </Text>
                        )}
                        {ai_content_analysis.target_keywords?.length > 0 && (
                            <Text style={{ fontSize: 9, color: colors.muted, marginTop: 4 }}>
                                AI Target Keywords: {ai_content_analysis.target_keywords.join(', ')}
                            </Text>
                        )}
                    </>
                ) : (
                    <Text style={{ fontSize: 9, color: colors.muted }}>AI content analysis not available.</Text>
                )}

                {/* AI SEO Strategy */}
                {strategy && Object.keys(strategy).length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>AI SEO Strategy</Text>
                        {strategy.target_keywords?.length > 0 && (
                            <>
                                <Text style={styles.subTitle}>Target Keywords</Text>
                                {strategy.target_keywords.map((kw, idx) => (
                                    <View key={idx} style={styles.strategyItem}>
                                        <Text style={styles.strategyBullet}>›</Text>
                                        <Text style={styles.strategyText}>{kw}</Text>
                                    </View>
                                ))}
                            </>
                        )}
                        {strategy.content_suggestions?.length > 0 && (
                            <>
                                <Text style={styles.subTitle}>Content Strategy</Text>
                                {strategy.content_suggestions.map((s, idx) => (
                                    <View key={idx} style={styles.strategyItem}>
                                        <Text style={styles.strategyBullet}>›</Text>
                                        <Text style={styles.strategyText}>{s}</Text>
                                    </View>
                                ))}
                            </>
                        )}
                        {strategy.backlink_strategy?.length > 0 && (
                            <>
                                <Text style={styles.subTitle}>Backlink Strategy</Text>
                                {strategy.backlink_strategy.map((s, idx) => (
                                    <View key={idx} style={styles.strategyItem}>
                                        <Text style={styles.strategyBullet}>›</Text>
                                        <Text style={styles.strategyText}>{s}</Text>
                                    </View>
                                ))}
                            </>
                        )}
                    </>
                )}

                {/* AI Summary & Meta suggestions */}
                {ai_summary && (
                    <>
                        <Text style={styles.sectionTitle}>SEO Intelligence Summary</Text>
                        <Text style={{ fontSize: 9, color: colors.secondary, lineHeight: 1.5, marginBottom: 10 }}>{ai_summary}</Text>
                    </>
                )}

                {(ai_suggested_title || ai_suggested_meta) && (
                    <>
                        <Text style={styles.subTitle}>Suggested Meta Tags</Text>
                        {ai_suggested_title && (
                            <View style={[styles.tableRow]}>
                                <Text style={styles.tableLabel}>Suggested Title</Text>
                                <Text style={styles.tableValue} numberOfLines={3}>{ai_suggested_title}</Text>
                            </View>
                        )}
                        {ai_suggested_meta && (
                            <View style={[styles.tableRow, styles.tableRowAlt]}>
                                <Text style={styles.tableLabel}>Suggested Meta Desc.</Text>
                                <Text style={styles.tableValue} numberOfLines={4}>{ai_suggested_meta}</Text>
                            </View>
                        )}
                    </>
                )}
            </Page>

            {/* ─── Page 4: Recommendations & Priority Fix Roadmap ─── */}
            <Page style={styles.page}>
                <PageFooter url={url} />

                {recsArray.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Actionable Recommendations</Text>
                        {recsArray.map((rec, idx) => (
                            <View key={idx} style={[styles.recItem, { borderLeftColor: getPriorityColor(rec.priority) }]}>
                                <Text style={[styles.recPriority, { color: getPriorityColor(rec.priority) }]}>
                                    {rec.priority?.toUpperCase() || 'MEDIUM'} PRIORITY
                                </Text>
                                <Text style={styles.recTitle}>{rec.title}</Text>
                                <Text style={styles.recDesc}>{rec.description}</Text>
                                {rec.impact && <Text style={styles.recImpact}>Impact: {rec.impact}</Text>}
                            </View>
                        ))}
                    </>
                )}

                {/* Priority Fix Roadmap */}
                <Text style={styles.sectionTitle}>Priority Fix Roadmap</Text>

                {criticalIssues.length > 0 && (
                    <>
                        <Text style={[styles.subTitle, { color: colors.red }]}>🔴 Critical Issues ({criticalIssues.length})</Text>
                        {criticalIssues.map((issue, idx) => (
                            <View key={idx} style={[styles.issueItem, { backgroundColor: getSeverityColor('critical') }]}>
                                <Text style={[styles.issueTitle, { color: getSeverityTextColor('critical') }]}>
                                    [{issue.category?.toUpperCase()}] {issue.title}
                                </Text>
                                <Text style={styles.issueMsg}>{issue.message}</Text>
                            </View>
                        ))}
                    </>
                )}

                {warningIssues.length > 0 && (
                    <>
                        <Text style={[styles.subTitle, { color: colors.amber }]}>⚠ Warnings ({warningIssues.length})</Text>
                        {warningIssues.map((issue, idx) => (
                            <View key={idx} style={[styles.issueItem, { backgroundColor: getSeverityColor('warning') }]}>
                                <Text style={[styles.issueTitle, { color: getSeverityTextColor('warning') }]}>
                                    [{issue.category?.toUpperCase()}] {issue.title}
                                </Text>
                                <Text style={styles.issueMsg}>{issue.message}</Text>
                            </View>
                        ))}
                    </>
                )}

                {infoIssues.length > 0 && (
                    <>
                        <Text style={[styles.subTitle, { color: colors.blue }]}>ℹ Info / Opportunities ({infoIssues.length})</Text>
                        {infoIssues.map((issue, idx) => (
                            <View key={idx} style={[styles.issueItem, { backgroundColor: getSeverityColor('info') }]}>
                                <Text style={[styles.issueTitle, { color: getSeverityTextColor('info') }]}>
                                    [{issue.category?.toUpperCase()}] {issue.title}
                                </Text>
                                <Text style={styles.issueMsg}>{issue.message}</Text>
                            </View>
                        ))}
                    </>
                )}
            </Page>
        </Document>
    );
};

export default SEOReportPDF;
