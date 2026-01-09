#!/usr/bin/env node

/**
 * Test Results Grid Generator
 * Parses Playwright test results and generates a formatted grid for GitHub Actions
 */

const fs = require('fs');
const path = require('path');

class TestResultsParser {
    /**
     * Remove ANSI color codes from a string
     */
    stripAnsi(str) {
        if (!str) return str;
        return str.replace(/[\u001b\u009b][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
    }
    constructor() {
        this.results = [];
        this.summary = {
            total: 0,
            passed: 0,
            failed: 0,
            flaky: 0,
            duration: 0
        };
    }

    /**
     * Parse test results from JSON files
     */
    parseResults(artifactsPath) {
        try {
            // Find all test result directories (both test-results-* and playwright-results-*)
            const resultDirs = fs.readdirSync(artifactsPath)
                .filter(dir => dir.startsWith('test-results-') || dir.startsWith('playwright-results-'))
                .map(dir => path.join(artifactsPath, dir));

            for (const resultDir of resultDirs) {
                const jsonFile = path.join(resultDir, 'test-results.json');
                if (fs.existsSync(jsonFile)) {
                    this.parseJsonResult(jsonFile);
                }
            }
        } catch (error) {
            console.error('Error parsing results:', error);
        }
    }

    /**
     * Parse individual JSON result file
     */
    parseJsonResult(jsonFile) {
        try {
            const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

            // Extract project info from file path
            const fileName = path.basename(path.dirname(jsonFile));
            const testResultsMatch = fileName.match(/test-results-(\w+)-?(\d+)?/);
            const playwrightResultsMatch = fileName.match(/playwright-results-(\w+)-?(\d+)?/);
            const [, project] = testResultsMatch || playwrightResultsMatch || ['', 'unknown'];

            // Exclude skipped from total, and do not track skipped
            const total = data.stats.expected + data.stats.unexpected + data.stats.flaky;
            const result = {
                project: project,
                total: total,
                passed: data.stats.expected,
                failed: data.stats.unexpected,
                flaky: data.stats.flaky,
                duration: Math.round(data.stats.duration / 1000),
                status: data.stats.unexpected > 0 ? 'failed' : 'passed',
                tests: this.extractTestDetails(data.suites)
            };

            this.results.push(result);
            this.updateSummary(result);
        } catch (error) {
            console.error(`Error parsing ${jsonFile}:`, error);
        }
    }

    /**
     * Extract individual test details
     */
    extractTestDetails(suites) {
        const tests = [];

        const extractFromSuite = (suite) => {
            if (suite.specs) {
                for (const spec of suite.specs) {
                    tests.push({
                        title: spec.title,
                        file: spec.file,
                        status: this.getTestStatus(spec),
                        duration: spec.tests?.[0]?.results?.[0]?.duration || 0,
                        error: this.getTestError(spec)
                    });
                }
            }
            if (suite.suites) {
                for (const subSuite of suite.suites) {
                    extractFromSuite(subSuite);
                }
            }
        };

        if (Array.isArray(suites)) {
            suites.forEach(extractFromSuite);
        }

        return tests;
    }

    /**
     * Get test status from spec
     */
    getTestStatus(spec) {
        if (!spec.tests || spec.tests.length === 0) return 'skipped';

        const test = spec.tests[0];
        if (!test.results || test.results.length === 0) return 'skipped';

        const result = test.results[0];
        return result.status || 'unknown';
    }

    /**
     * Get test error message
     */
    getTestError(spec) {
        if (!spec.tests || spec.tests.length === 0) return null;

        const test = spec.tests[0];
        if (!test.results || test.results.length === 0) return null;

        const result = test.results[0];
        return result.error?.message || null;
    }

    /**
     * Update summary statistics
     */
    updateSummary(result) {
        this.summary.total += result.total;
        this.summary.passed += result.passed;
        this.summary.failed += result.failed;
        this.summary.flaky += result.flaky;
        this.summary.duration += result.duration;
    }

    /**
     * Generate markdown grid
     */
    generateMarkdownGrid() {
        let markdown = '';

        // Header
        markdown += '# 🎭 Playwright Test Results Dashboard\n\n';

        // Metadata
        markdown += this.generateMetadataTable();
        markdown += '\n';

        // Results grid
        markdown += '## Test Results Grid\n\n';
        markdown += '| Browser | Status | Total | ✅ Passed | ❌ Failed | 🔄 Flaky | ⏱️ Duration |\n';
        markdown += '|---------|--------|-------|-----------|-----------|----------|------------|\n';

        // Sort results by project
        const sortedResults = this.results.sort((a, b) => a.project.localeCompare(b.project));

        for (const result of sortedResults) {
            const browserIcon = this.getBrowserIcon(result.project);
            const statusIcon = result.status === 'passed' ? '✅ Passed' : '❌ Failed';
            markdown += `| ${browserIcon} ${result.project} | ${statusIcon} | ${result.total} | ${result.passed} | ${result.failed} | ${result.flaky} | ${result.duration}s |\n`;
        }

        markdown += '\n';

        // Test statistics
        markdown += this.generateTestStatistics();

        // Passed tests details (collapsible)
        markdown += this.generatePassedTestsSection();

        // Failed tests details (if any)
        markdown += this.generateFailedTestsSection();

        // Reports section
        markdown += this.generateReportsSection();

        return markdown;
    }

    /**
     * Generate metadata table
     */
    generateMetadataTable() {
        const metadata = [
            ['🔗 Workflow', `[\`${process.env.GITHUB_WORKFLOW || 'Playwright Tests'}\`](${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID})`],
            ['📝 Commit', `[\`${(process.env.GITHUB_SHA || '').substring(0, 7)}\`](${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/commit/${process.env.GITHUB_SHA})`],
            ['🌿 Branch', `\`${process.env.GITHUB_REF_NAME || 'unknown'}\``],
            ['👤 Triggered by', `\`${process.env.GITHUB_ACTOR || 'unknown'}\``],
            ['🕐 Timestamp', `\`${new Date().toISOString().replace('T', ' ').substring(0, 19)} UTC\``]
        ];

        let table = '| Metadata | Value |\n|----------|-------|\n';
        for (const [key, value] of metadata) {
            table += `| ${key} | ${value} |\n`;
        }
        return table;
    }

    /**
     * Generate test statistics
     */
    generateTestStatistics() {
        const total = this.summary.total || 1; // Avoid division by zero
        const successRate = ((this.summary.passed / total) * 100).toFixed(1);

        let section = '## � Test Statistics\n\n';
        section += `- 🎯 **Success Rate**: ${successRate}%\n`;
        section += `- 📊 **Total Tests**: ${this.summary.total}\n`;
        section += `- ⏱️ **Total Duration**: ${this.summary.duration}s\n`;
        section += `- 🔄 **Flaky Tests**: ${this.summary.flaky}\n`;
        section += '\n';

        return section;
    }

    /**
     * Generate passed tests section in collapsible markdown
     */
    generatePassedTestsSection() {
        const passedTests = this.results
            .flatMap(result => result.tests.filter(test => test.status === 'passed'))
            .slice(0, 100); // Limit to first 100 passed tests for brevity

        if (passedTests.length === 0) return '';

        let section = '## ✅ Passed Tests\n\n';
        section += '<details><summary>Show list (' + passedTests.length + ')</summary>\n\n';
        section += '| Test | File |\n';
        section += '|------|------|\n';

        for (const test of passedTests) {
            section += `| ${test.title} | \`${path.basename(test.file)}\` |\n`;
        }

        section += '\n</details>\n\n';
        return section;
    }

    /**
     * Generate failed tests section
     */
    generateFailedTestsSection() {
        const failedTests = this.results
            .flatMap(result => result.tests.filter(test => test.status === 'failed'))
            .slice(0, 10); // Limit to first 10 failed tests

        if (failedTests.length === 0) return '';

        let section = '## ❌ Failed Tests\n\n';
        section += '| Test | File | Error |\n';
        section += '|------|------|-------|\n';

        for (const test of failedTests) {
            let error = test.error || 'Unknown error';
            error = this.stripAnsi(error);
            // Only show the first line (summary) of the error
            error = error.split('\n')[0];
            error = error.substring(0, 100);
            section += `| ${test.title} | \`${path.basename(test.file)}\` | ${error}${error.length >= 100 ? '...' : ''} |\n`;
        }

        section += '\n';
        return section;
    }

    /**
     * Generate reports section
     */
    generateReportsSection() {
        let section = '## 📋 Reports\n\n';
        section += `- 📊 Download the **playwright-report** artifact below for the [HTML Report]()\n`;
        section += '\n';
        return section;
    }

    /**
     * Get browser icon
     */
    getBrowserIcon(browser) {
        const icons = {
            chromium: '🌐',
            firefox: '🦊',
            webkit: '🧭',
            chrome: '🌐',
            edge: '📘'
        };
        return icons[browser.toLowerCase()] || '🌐';
    }

    /**
     * Generate JSON summary for GitHub outputs
     */
    generateJsonSummary() {
        return JSON.stringify({
            summary: this.summary,
            results: this.results.map(r => ({
                project: r.project,
                status: r.status,
                total: r.total,
                passed: r.passed,
                failed: r.failed,
                flaky: r.flaky,
                duration: r.duration
            }))
        }, null, 2);
    }
}

// Main execution
if (require.main === module) {
    const parser = new TestResultsParser();
    const artifactsPath = process.argv[2] || './artifacts';

    if (fs.existsSync(artifactsPath)) {
        parser.parseResults(artifactsPath);

        // Generate markdown
        const markdown = parser.generateMarkdownGrid();
        fs.writeFileSync('test-results.md', markdown);

        // Generate JSON summary
        const jsonSummary = parser.generateJsonSummary();
        fs.writeFileSync('test-results-summary.json', jsonSummary);

        console.log('Grid generated successfully!');
        console.log('\nMarkdown Summary:');
        console.log(markdown);
    } else {
        console.error(`Artifacts path not found: ${artifactsPath}`);
        process.exit(1);
    }
}

module.exports = TestResultsParser;