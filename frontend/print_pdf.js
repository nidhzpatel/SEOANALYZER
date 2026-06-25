const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Go to the locally running frontend
    await page.goto('http://localhost:5173/');

    // Type the URL to analyze
    await page.waitForSelector('input[type="url"]');
    await page.type('input[type="url"]', 'https://www.wikipedia.org');

    // Click analyze
    await page.click('button[type="submit"]');

    // Wait for the report to load (e.g., waiting for the score section to appear)
    await page.waitForSelector('.score-section', { timeout: 60000 });

    // Wait a bit for animations to settle
    await new Promise(r => setTimeout(r, 2000));

    // Print to PDF
    await page.pdf({
        path: 'test_report.pdf',
        format: 'A4',
        printBackground: true
    });

    console.log('PDF saved as test_report.pdf');
    await browser.close();
})();
