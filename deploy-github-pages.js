/**
 * GitHub Pages Deployment Script for MTC Event Check-In QR Tool
 * This script prepares the application for GitHub Pages deployment
 */

const fs = require('fs');
const path = require('path');

class GitHubPagesDeployer {
    constructor() {
        this.environment = 'production';
    }
    
    /**
     * Deploy for GitHub Pages
     */
    async deploy() {
        try {
            console.log('🚀 Preparing MTC Event Check-In QR Tool for GitHub Pages deployment...');
            
            // Update configuration for GitHub Pages
            await this.updateConfigForGitHubPages();
            
            // Update HTML for production
            await this.updateHtmlForProduction();
            
            // Create deployment info
            await this.createDeploymentInfo();
            
            console.log('✅ Successfully prepared for GitHub Pages deployment');
            console.log('');
            console.log('📋 Next steps:');
            console.log('1. Commit and push your changes to GitHub');
            console.log('2. Enable GitHub Pages in your repository settings');
            console.log('3. When you visit your GitHub Pages site, you will be prompted for your Google Apps Script URL');
            console.log('4. Enter your Google Apps Script URL to enable attendance tracking');
            console.log('');
            console.log('🔗 Your site will be available at: https://[username].github.io/[repository-name]');
            
        } catch (error) {
            console.error('❌ GitHub Pages deployment preparation failed:', error.message);
            process.exit(1);
        }
    }
    
    /**
     * Update configuration for GitHub Pages
     */
    async updateConfigForGitHubPages() {
        // Copy production config to main config.json
        if (fs.existsSync('config.production.json')) {
            const prodConfig = JSON.parse(fs.readFileSync('config.production.json', 'utf8'));
            
            // Update build time
            prodConfig.BUILD_TIME = new Date().toISOString();
            prodConfig.DEPLOYMENT_TARGET = 'github-pages';
            
            fs.writeFileSync('config.json', JSON.stringify(prodConfig, null, 2));
            console.log('⚙️  Updated config.json for GitHub Pages');
        }
    }
    
    /**
     * Update HTML for production
     */
    async updateHtmlForProduction() {
        let htmlContent = fs.readFileSync('index.html', 'utf8');
        
        // Update meta tags for production
        const metaTags = [
            '<meta name="env-node_env" content="production">',
            '<meta name="env-deployment_target" content="github-pages">',
            '<meta name="env-enable_attendance_tracking" content="true">',
            '<meta name="env-feature_google_sheets" content="true">',
            '<meta name="env-show_debug_info" content="false">'
        ];
        
        // Remove existing environment meta tags
        htmlContent = htmlContent.replace(/<meta name="env-[^"]*" content="[^"]*">/g, '');
        
        // Insert new meta tags after the secure config meta tag
        const secureMetaIndex = htmlContent.indexOf('<meta name="secure-google_apps_script_url"');
        if (secureMetaIndex !== -1) {
            const insertPoint = htmlContent.indexOf('>', secureMetaIndex) + 1;
            const newMetaTags = '\n    \n    <!-- Production Environment Meta Tags -->\n    ' + 
                               metaTags.join('\n    ') + '\n';
            htmlContent = htmlContent.slice(0, insertPoint) + newMetaTags + htmlContent.slice(insertPoint);
        }
        
        fs.writeFileSync('index.html', htmlContent);
        console.log('🏷️  Updated HTML meta tags for production');
    }
    
    /**
     * Create deployment information file
     */
    async createDeploymentInfo() {
        const deploymentInfo = {
            target: 'github-pages',
            environment: 'production',
            buildTime: new Date().toISOString(),
            version: '2.0.0',
            features: {
                googleSheets: true,
                attendanceTracking: true,
                qrGeneration: true
            },
            instructions: {
                setup: [
                    'Visit your GitHub Pages site',
                    'You will be prompted for your Google Apps Script URL',
                    'Enter the URL from your Google Apps Script deployment',
                    'The URL should look like: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec'
                ],
                googleAppsScript: [
                    'Go to script.google.com',
                    'Create a new project',
                    'Copy the code from google-apps-script.js',
                    'Update the SHEET_ID with your Google Sheet ID',
                    'Deploy as a web app with "Anyone" access',
                    'Copy the web app URL for use in the frontend'
                ]
            }
        };
        
        fs.writeFileSync('deployment-info.json', JSON.stringify(deploymentInfo, null, 2));
        console.log('📄 Created deployment information file');
    }
}

// Run deployment if called directly
if (require.main === module) {
    const deployer = new GitHubPagesDeployer();
    deployer.deploy();
}

module.exports = GitHubPagesDeployer;
