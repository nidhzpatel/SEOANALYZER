/**
 * Exports the report dashboard as a proper PDF using html2pdf.js
 */
export async function exportReportAsPDF(elementId = 'report-dashboard') {
    const element = document.getElementById(elementId);
    if (!element) {
        alert('Report not found. Please run an analysis first.');
        return;
    }

    const btn = document.getElementById('download-btn');
    if (btn) {
        btn.innerText = '⏳ Generating PDF...';
        btn.disabled = true;
    }

    try {
        // Dynamically import html2pdf.js to avoid SSR issues
        const html2pdf = (await import('html2pdf.js')).default;

        const opt = {
            margin: [10, 10, 10, 10],
            filename: 'SEO_Analysis_Report.pdf',
            image: { type: 'jpeg', quality: 0.95 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                backgroundColor: '#0a0e1a',
                logging: false,
                scrollY: 0,
                scrollX: 0,
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };

        await html2pdf().set(opt).from(element).save();

    } catch (err) {
        console.error('PDF export failed:', err);
        alert('PDF export failed: ' + err.message);
    } finally {
        if (btn) {
            btn.innerText = '📥 Download Report';
            btn.disabled = false;
        }
    }
}
