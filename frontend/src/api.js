const API_BASE = '/api';

/**
 * Submit a URL for SEO analysis.
 * @param {string} url - The URL to analyze
 * @returns {Promise<object>} The analysis report
 */
export async function analyzeUrl(url) {
    const response = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Analysis failed' }));
        throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
}

/**
 * Fetch all saved reports.
 * @returns {Promise<object[]>} List of report summaries
 */
export async function fetchReports() {
    const response = await fetch(`${API_BASE}/reports`);
    if (!response.ok) throw new Error('Failed to fetch reports');
    return response.json();
}

/**
 * Fetch a specific report by ID.
 * @param {number} id - Report ID
 * @returns {Promise<object>} The full report
 */
export async function fetchReport(id) {
    const response = await fetch(`${API_BASE}/reports/${id}`);
    if (!response.ok) throw new Error('Report not found');
    return response.json();
}
