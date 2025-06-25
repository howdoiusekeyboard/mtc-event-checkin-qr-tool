/**
 * Environment Configuration Loader for MTC Event Check-In QR Tool
 * This module handles loading and validating environment variables
 * for browser-based applications
 */

class EnvironmentConfig {
    constructor() {
        this.config = {};
        this.isLoaded = false;
        this.errors = [];
        this.warnings = [];
        
        // Default configuration values
        this.defaults = {
            // Google Sheets
            GOOGLE_APPS_SCRIPT_URL: '',
            GOOGLE_SHEET_ID: '',
            GOOGLE_SHEET_NAME: 'Attendance',
            GOOGLE_REQUEST_TIMEOUT: 10000,
            GOOGLE_MAX_RETRIES: 3,
            
            // Application
            NODE_ENV: 'development',
            APP_NAME: 'MTC Event Check-In QR Tool',
            APP_VERSION: '2.0.0',
            DEFAULT_EVENT_NAME: 'MTC Event',
            ENABLE_ATTENDANCE_TRACKING: true,
            ENABLE_QR_GENERATION: true,
            
            // UI/UX
            SHOW_ATTENDANCE_MESSAGES: true,
            SHOW_ATTENDANCE_COUNTER: false,
            SHOW_DEBUG_INFO: false,
            AUTO_CLEAR_FORM: false,
            ENABLE_KEYBOARD_SHORTCUTS: true,
            
            // Theme
            PRIMARY_COLOR: '#0078D4',
            SECONDARY_COLOR: '#106ebe',
            BACKGROUND_COLOR: '#f0f2f5',
            CONTAINER_BACKGROUND: '#ffffff',
            TEXT_COLOR: '#333333',
            
            // Security
            ENABLE_EMAIL_VALIDATION: true,
            ENABLE_NAME_VALIDATION: true,
            MIN_NAME_LENGTH: 2,
            MAX_NAME_LENGTH: 100,
            MAX_EMAIL_LENGTH: 254,
            
            // Logging
            ENABLE_CONSOLE_LOGGING: true,
            ENABLE_ERROR_LOGGING: true,
            ENABLE_ATTENDANCE_LOGGING: true,
            ENABLE_QR_LOGGING: true,
            LOG_LEVEL: 'info',
            ENABLE_DEBUG_MODE: false,
            
            // QR Code
            QR_CODE_SIZE: 256,
            QR_CODE_COLOR_DARK: '#000000',
            QR_CODE_COLOR_LIGHT: '#ffffff',
            QR_CODE_CORRECTION_LEVEL: 'M',
            QR_CODE_MARGIN: 4,
            QR_DATA_INCLUDE_TIMESTAMP: false,
            QR_DATA_INCLUDE_EVENT_NAME: true,
            QR_DATA_CUSTOM_FORMAT: 'Name: {name}\\nEmail: {email}',
            
            // Performance
            REQUEST_TIMEOUT: 10000,
            RETRY_ATTEMPTS: 3,
            RETRY_DELAY: 1000,
            
            // Feature Flags
            FEATURE_GOOGLE_SHEETS: true,
            FEATURE_EVENT_NAME_FIELD: true,
            FEATURE_BULK_CHECKIN: false,
            FEATURE_EXPORT_DATA: false,
            FEATURE_REAL_TIME_STATS: false,
            FEATURE_EMAIL_NOTIFICATIONS: false,
            
            // Experimental
            EXPERIMENTAL_OFFLINE_MODE: false,
            EXPERIMENTAL_PWA_SUPPORT: false,
            EXPERIMENTAL_DARK_MODE: false
        };
    }
    
    /**
     * Load environment configuration
     */
    async load() {
        try {
            // Try to load from environment endpoint first
            await this.loadFromEndpoint();
        } catch (error) {
            console.warn('Could not load from environment endpoint, using defaults:', error.message);
            // Fall back to loading from window object or defaults
            this.loadFromWindow();
        }
        
        this.validateConfiguration();
        this.isLoaded = true;
        
        if (this.get('ENABLE_DEBUG_MODE')) {
            console.log('Environment configuration loaded:', this.config);
        }
        
        return this.config;
    }
    
    /**
     * Load configuration from environment endpoint
     */
    async loadFromEndpoint() {
        try {
            // Check if this is GitHub Pages first
            if (this.isGitHubPages()) {
                await this.loadFromGitHubPages();
                return;
            }

            const response = await fetch('/api/env', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const envData = await response.json();
                this.mergeConfiguration(envData);
            } else {
                throw new Error(`Environment endpoint returned ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Failed to load from endpoint: ${error.message}`);
        }
    }

    /**
     * Check if running on GitHub Pages
     */
    isGitHubPages() {
        const hostname = window.location.hostname;
        return hostname.includes('github.io') || hostname.includes('github.com');
    }

    /**
     * Load configuration for GitHub Pages deployment
     */
    async loadFromGitHubPages() {
        try {
            // Try to load production config
            const response = await fetch('/config.production.json');
            if (response.ok) {
                const prodConfig = await response.json();
                this.mergeConfiguration(prodConfig);
            } else {
                // Fallback to regular config.json
                const fallbackResponse = await fetch('/config.json');
                if (fallbackResponse.ok) {
                    const config = await fallbackResponse.json();
                    this.mergeConfiguration(config);
                }
            }
        } catch (error) {
            console.warn('Could not load GitHub Pages config, using defaults:', error);
        }
    }
    
    /**
     * Load configuration from window object (fallback)
     */
    loadFromWindow() {
        // Check if environment variables are available on window object
        if (typeof window !== 'undefined' && window.ENV_CONFIG) {
            this.mergeConfiguration(window.ENV_CONFIG);
        } else {
            // Use defaults
            this.config = { ...this.defaults };
        }
    }
    
    /**
     * Merge configuration with defaults
     */
    mergeConfiguration(envData) {
        this.config = { ...this.defaults };
        
        // Override with environment values
        Object.keys(envData).forEach(key => {
            if (key in this.defaults) {
                this.config[key] = this.parseValue(envData[key], key);
            }
        });
    }
    
    /**
     * Parse environment value to appropriate type
     */
    parseValue(value, key) {
        if (value === null || value === undefined) {
            return this.defaults[key];
        }
        
        // Convert string values to appropriate types
        if (typeof value === 'string') {
            // Boolean values
            if (value.toLowerCase() === 'true') return true;
            if (value.toLowerCase() === 'false') return false;
            
            // Number values
            if (/^\d+$/.test(value)) return parseInt(value, 10);
            if (/^\d+\.\d+$/.test(value)) return parseFloat(value);
        }
        
        return value;
    }
    
    /**
     * Validate configuration
     */
    validateConfiguration() {
        this.errors = [];
        this.warnings = [];
        
        // Required fields validation
        const requiredFields = [
            'APP_NAME',
            'DEFAULT_EVENT_NAME'
        ];
        
        requiredFields.forEach(field => {
            if (!this.config[field]) {
                this.errors.push(`Required field ${field} is missing`);
            }
        });
        
        // Google Sheets validation
        if (this.config.FEATURE_GOOGLE_SHEETS && this.config.ENABLE_ATTENDANCE_TRACKING) {
            if (!this.config.GOOGLE_APPS_SCRIPT_URL || this.config.GOOGLE_APPS_SCRIPT_URL.includes('YOUR_SCRIPT_ID')) {
                this.warnings.push('Google Apps Script URL not configured - attendance tracking will be disabled');
            }
        }
        
        // Validation ranges
        if (this.config.QR_CODE_SIZE < 128 || this.config.QR_CODE_SIZE > 1024) {
            this.warnings.push('QR_CODE_SIZE should be between 128 and 1024 pixels');
        }
        
        if (this.config.MIN_NAME_LENGTH < 1 || this.config.MIN_NAME_LENGTH > 50) {
            this.warnings.push('MIN_NAME_LENGTH should be between 1 and 50 characters');
        }
        
        // Log validation results
        if (this.errors.length > 0) {
            console.error('Environment configuration errors:', this.errors);
        }
        
        if (this.warnings.length > 0) {
            console.warn('Environment configuration warnings:', this.warnings);
        }
    }
    
    /**
     * Get configuration value
     */
    get(key, defaultValue = null) {
        if (!this.isLoaded) {
            console.warn('Environment configuration not loaded yet');
            return this.defaults[key] || defaultValue;
        }
        
        return this.config[key] !== undefined ? this.config[key] : defaultValue;
    }
    
    /**
     * Check if a feature is enabled
     */
    isFeatureEnabled(featureName) {
        return this.get(`FEATURE_${featureName.toUpperCase()}`, false);
    }
    
    /**
     * Check if in development mode
     */
    isDevelopment() {
        return this.get('NODE_ENV') === 'development';
    }
    
    /**
     * Check if in production mode
     */
    isProduction() {
        return this.get('NODE_ENV') === 'production';
    }
    
    /**
     * Get all configuration
     */
    getAll() {
        return { ...this.config };
    }
    
    /**
     * Get validation errors
     */
    getErrors() {
        return [...this.errors];
    }
    
    /**
     * Get validation warnings
     */
    getWarnings() {
        return [...this.warnings];
    }
}

// Create global instance
const envConfig = new EnvironmentConfig();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = envConfig;
} else if (typeof window !== 'undefined') {
    window.EnvConfig = envConfig;
}
