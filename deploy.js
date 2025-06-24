/**
 * Deployment Script for MTC Event Check-In QR Tool
 * Handles environment-specific configuration and deployment
 */

const fs = require('fs');
const path = require('path');

class Deployer {
    constructor() {
        this.environments = ['development', 'staging', 'production'];
        this.currentEnv = process.env.NODE_ENV || 'development';
    }
    
    /**
     * Deploy to specific environment
     */
    async deploy(environment = this.currentEnv) {
        try {
            console.log(`🚀 Deploying MTC Event Check-In QR Tool to ${environment}...`);
            
            // Validate environment
            if (!this.environments.includes(environment)) {
                throw new Error(`Invalid environment: ${environment}. Valid options: ${this.environments.join(', ')}`);
            }
            
            // Load environment configuration
            await this.loadEnvironmentConfig(environment);
            
            // Generate configuration files
            await this.generateConfigFiles(environment);
            
            // Update HTML with environment-specific meta tags
            await this.updateHtmlMetaTags(environment);
            
            // Generate environment-specific config.json
            await this.generatePublicConfig(environment);
            
            // Validate deployment
            await this.validateDeployment(environment);
            
            console.log(`✅ Successfully deployed to ${environment}`);
            
        } catch (error) {
            console.error(`❌ Deployment failed:`, error.message);
            process.exit(1);
        }
    }
    
    /**
     * Load environment configuration
     */
    async loadEnvironmentConfig(environment) {
        const envFile = `.env.${environment}`;
        
        if (!fs.existsSync(envFile)) {
            throw new Error(`Environment file ${envFile} not found`);
        }
        
        // Parse environment file
        const envContent = fs.readFileSync(envFile, 'utf8');
        this.config = this.parseEnvFile(envContent);
        
        console.log(`📄 Loaded configuration from ${envFile}`);
    }
    
    /**
     * Parse environment file
     */
    parseEnvFile(content) {
        const config = {};
        const lines = content.split('\n');
        
        lines.forEach(line => {
            line = line.trim();
            if (line && !line.startsWith('#') && line.includes('=')) {
                const [key, ...valueParts] = line.split('=');
                const value = valueParts.join('=').trim();
                config[key.trim()] = value;
            }
        });
        
        return config;
    }
    
    /**
     * Generate configuration files
     */
    async generateConfigFiles(environment) {
        // Generate public configuration (safe for client-side)
        const publicConfig = this.getPublicConfig();
        
        // Write config.json
        fs.writeFileSync('config.json', JSON.stringify(publicConfig, null, 2));
        console.log(`📝 Generated config.json for ${environment}`);
        
        // Generate environment info file
        const envInfo = {
            environment: environment,
            buildTime: new Date().toISOString(),
            version: this.config.APP_VERSION || '2.0.0',
            features: this.getEnabledFeatures()
        };
        
        fs.writeFileSync('env-info.json', JSON.stringify(envInfo, null, 2));
        console.log(`📝 Generated env-info.json for ${environment}`);
    }
    
    /**
     * Get public (non-sensitive) configuration
     */
    getPublicConfig() {
        const sensitiveKeys = [
            'GOOGLE_APPS_SCRIPT_URL',
            'GOOGLE_SHEET_ID',
            'API_KEY',
            'SECRET_KEY'
        ];
        
        const publicConfig = {};
        
        Object.keys(this.config).forEach(key => {
            if (!sensitiveKeys.includes(key)) {
                publicConfig[key] = this.parseConfigValue(this.config[key]);
            }
        });
        
        return publicConfig;
    }
    
    /**
     * Parse configuration value to appropriate type
     */
    parseConfigValue(value) {
        if (value === 'true') return true;
        if (value === 'false') return false;
        if (/^\d+$/.test(value)) return parseInt(value, 10);
        if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
        return value;
    }
    
    /**
     * Get enabled features
     */
    getEnabledFeatures() {
        const features = [];
        
        Object.keys(this.config).forEach(key => {
            if (key.startsWith('FEATURE_') && this.config[key] === 'true') {
                features.push(key.replace('FEATURE_', '').toLowerCase());
            }
        });
        
        return features;
    }
    
    /**
     * Update HTML with environment-specific meta tags
     */
    async updateHtmlMetaTags(environment) {
        let htmlContent = fs.readFileSync('index.html', 'utf8');
        
        // Update environment-specific meta tags
        const metaTags = [
            `<meta name="env-node_env" content="${environment}">`,
            `<meta name="env-app_name" content="${this.config.APP_NAME || 'MTC Event Check-In QR Tool'}">`,
            `<meta name="env-app_version" content="${this.config.APP_VERSION || '2.0.0'}">`,
            `<meta name="env-default_event_name" content="${this.config.DEFAULT_EVENT_NAME || 'MTC Event'}">`,
            `<meta name="env-enable_attendance_tracking" content="${this.config.ENABLE_ATTENDANCE_TRACKING || 'false'}">`,
            `<meta name="env-feature_google_sheets" content="${this.config.FEATURE_GOOGLE_SHEETS || 'false'}">`,
            `<meta name="env-show_debug_info" content="${this.config.SHOW_DEBUG_INFO || 'false'}">`
        ];
        
        // Replace existing meta tags
        const metaTagRegex = /<meta name="env-[^"]*" content="[^"]*">/g;
        htmlContent = htmlContent.replace(metaTagRegex, '');
        
        // Insert new meta tags after the title tag
        const titleTagIndex = htmlContent.indexOf('</title>');
        if (titleTagIndex !== -1) {
            const insertPoint = titleTagIndex + '</title>'.length;
            const newMetaTags = '\n    \n    <!-- Environment Configuration Meta Tags -->\n    ' + 
                               metaTags.join('\n    ') + '\n';
            htmlContent = htmlContent.slice(0, insertPoint) + newMetaTags + htmlContent.slice(insertPoint);
        }
        
        fs.writeFileSync('index.html', htmlContent);
        console.log(`🏷️  Updated HTML meta tags for ${environment}`);
    }
    
    /**
     * Generate public configuration file
     */
    async generatePublicConfig(environment) {
        const publicConfig = this.getPublicConfig();
        
        // Add environment-specific information
        publicConfig.ENVIRONMENT = environment;
        publicConfig.BUILD_TIME = new Date().toISOString();
        publicConfig.FEATURES_ENABLED = this.getEnabledFeatures();
        
        fs.writeFileSync('config.json', JSON.stringify(publicConfig, null, 2));
        console.log(`⚙️  Generated public configuration for ${environment}`);
    }
    
    /**
     * Validate deployment
     */
    async validateDeployment(environment) {
        const validations = [
            () => this.validateConfigFiles(),
            () => this.validateHtmlFile(),
            () => this.validateEnvironmentConfig(environment)
        ];
        
        for (const validation of validations) {
            await validation();
        }
        
        console.log(`✅ Deployment validation passed for ${environment}`);
    }
    
    /**
     * Validate configuration files
     */
    validateConfigFiles() {
        const requiredFiles = ['config.json', 'env-info.json'];
        
        requiredFiles.forEach(file => {
            if (!fs.existsSync(file)) {
                throw new Error(`Required file ${file} not found`);
            }
        });
        
        // Validate config.json structure
        const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));
        const requiredKeys = ['NODE_ENV', 'APP_NAME', 'APP_VERSION'];
        
        requiredKeys.forEach(key => {
            if (!(key in config)) {
                throw new Error(`Required configuration key ${key} missing from config.json`);
            }
        });
    }
    
    /**
     * Validate HTML file
     */
    validateHtmlFile() {
        const htmlContent = fs.readFileSync('index.html', 'utf8');
        
        // Check for required scripts
        const requiredScripts = ['env-loader.js', 'secure-config.js', 'script.js'];
        
        requiredScripts.forEach(script => {
            if (!htmlContent.includes(script)) {
                throw new Error(`Required script ${script} not found in HTML`);
            }
        });
        
        // Check for environment meta tags
        if (!htmlContent.includes('name="env-node_env"')) {
            throw new Error('Environment meta tags not found in HTML');
        }
    }
    
    /**
     * Validate environment-specific configuration
     */
    validateEnvironmentConfig(environment) {
        // Environment-specific validations
        if (environment === 'production') {
            if (this.config.SHOW_DEBUG_INFO === 'true') {
                console.warn('⚠️  Warning: Debug info is enabled in production');
            }
            
            if (this.config.ENABLE_CONSOLE_LOGGING === 'true') {
                console.warn('⚠️  Warning: Console logging is enabled in production');
            }
        }
        
        // Check for placeholder values
        const placeholderKeys = ['GOOGLE_APPS_SCRIPT_URL', 'GOOGLE_SHEET_ID'];
        placeholderKeys.forEach(key => {
            if (this.config[key] && this.config[key].includes('YOUR_')) {
                console.warn(`⚠️  Warning: ${key} contains placeholder value`);
            }
        });
    }
}

// CLI interface
if (require.main === module) {
    const environment = process.argv[2] || 'development';
    const deployer = new Deployer();
    deployer.deploy(environment);
}

module.exports = Deployer;
