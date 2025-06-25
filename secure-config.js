/**
 * Secure Configuration Handler for MTC Event Check-In QR Tool
 * This module handles sensitive configuration data securely
 * and provides safe access to environment variables
 */

class SecureConfig {
    constructor() {
        this.sensitiveKeys = new Set([
            'GOOGLE_APPS_SCRIPT_URL',
            'GOOGLE_SHEET_ID',
            'API_KEY',
            'SECRET_KEY',
            'DATABASE_URL',
            'PRIVATE_KEY'
        ]);
        
        this.config = {};
        this.isInitialized = false;
        this.secureStorage = this.initializeSecureStorage();
    }
    
    /**
     * Initialize secure storage mechanism
     */
    initializeSecureStorage() {
        // Use sessionStorage for sensitive data (cleared on tab close)
        // Only in development, production should use server-side configuration
        if (this.isDevelopment() && typeof sessionStorage !== 'undefined') {
            return {
                get: (key) => {
                    try {
                        const encrypted = sessionStorage.getItem(`secure_${key}`);
                        return encrypted ? this.simpleDecrypt(encrypted) : null;
                    } catch (error) {
                        console.warn('Failed to retrieve secure config:', error);
                        return null;
                    }
                },
                set: (key, value) => {
                    try {
                        const encrypted = this.simpleEncrypt(value);
                        sessionStorage.setItem(`secure_${key}`, encrypted);
                    } catch (error) {
                        console.warn('Failed to store secure config:', error);
                    }
                },
                remove: (key) => {
                    try {
                        sessionStorage.removeItem(`secure_${key}`);
                    } catch (error) {
                        console.warn('Failed to remove secure config:', error);
                    }
                }
            };
        }
        
        // Fallback to memory storage (less secure but works everywhere)
        const memoryStorage = {};
        return {
            get: (key) => memoryStorage[key] || null,
            set: (key, value) => { memoryStorage[key] = value; },
            remove: (key) => { delete memoryStorage[key]; }
        };
    }
    
    /**
     * Simple encryption for client-side storage (development only)
     * Note: This is NOT cryptographically secure, just obfuscation
     */
    simpleEncrypt(text) {
        if (!text) return '';
        return btoa(text.split('').reverse().join(''));
    }
    
    /**
     * Simple decryption for client-side storage
     */
    simpleDecrypt(encrypted) {
        if (!encrypted) return '';
        try {
            return atob(encrypted).split('').reverse().join('');
        } catch (error) {
            return '';
        }
    }
    
    /**
     * Check if running in development mode
     */
    isDevelopment() {
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               window.location.hostname.includes('local');
    }
    
    /**
     * Initialize secure configuration
     */
    async initialize() {
        try {
            // Load public configuration first
            await this.loadPublicConfig();
            
            // Load sensitive configuration securely
            await this.loadSensitiveConfig();
            
            this.isInitialized = true;
            
            // Dispatch initialization event
            window.dispatchEvent(new CustomEvent('secure-config-initialized', {
                detail: { publicConfig: this.getPublicConfig() }
            }));
            
            return true;
            
        } catch (error) {
            console.error('Failed to initialize secure configuration:', error);
            return false;
        }
    }
    
    /**
     * Load public (non-sensitive) configuration
     */
    async loadPublicConfig() {
        try {
            // Try to load from config.json
            const response = await fetch('/config.json');
            if (response.ok) {
                const publicConfig = await response.json();
                Object.keys(publicConfig).forEach(key => {
                    if (!this.sensitiveKeys.has(key)) {
                        this.config[key] = publicConfig[key];
                    }
                });
            }
        } catch (error) {
            console.warn('Could not load public config, using defaults');
        }
        
        // Ensure we have default values
        this.setDefaults();
    }
    
    /**
     * Load sensitive configuration
     */
    async loadSensitiveConfig() {
        // In development, try to load from various sources
        if (this.isDevelopment()) {
            await this.loadSensitiveFromDevelopmentSources();
        } else {
            // In production, sensitive config should come from server
            await this.loadSensitiveFromProduction();
        }
    }
    
    /**
     * Load sensitive config from development sources
     */
    async loadSensitiveFromDevelopmentSources() {
        // Try to load from secure storage first
        this.sensitiveKeys.forEach(key => {
            const value = this.secureStorage.get(key);
            if (value) {
                this.config[key] = value;
            }
        });
        
        // Try to load from meta tags (server-rendered)
        this.loadSensitiveFromMetaTags();
        
        // Try to load from prompt (development only)
        if (this.isDevelopment() && !this.config.GOOGLE_APPS_SCRIPT_URL) {
            this.promptForSensitiveConfig();
        }
    }
    
    /**
     * Load sensitive config from meta tags
     */
    loadSensitiveFromMetaTags() {
        this.sensitiveKeys.forEach(key => {
            const metaTag = document.querySelector(`meta[name="secure-${key.toLowerCase()}"]`);
            if (metaTag) {
                const value = metaTag.getAttribute('content');
                if (value && !value.includes('YOUR_') && !value.includes('PLACEHOLDER')) {
                    this.config[key] = value;
                    this.secureStorage.set(key, value);
                }
            }
        });
    }
    
    /**
     * Load sensitive config from production sources
     */
    async loadSensitiveFromProduction() {
        try {
            // Check if this is GitHub Pages deployment
            if (this.isGitHubPages()) {
                await this.loadSensitiveFromGitHubPages();
                return;
            }

            // In production, sensitive config should come from server endpoint
            const response = await fetch('/api/secure-config', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const sensitiveConfig = await response.json();
                Object.keys(sensitiveConfig).forEach(key => {
                    if (this.sensitiveKeys.has(key)) {
                        this.config[key] = sensitiveConfig[key];
                    }
                });
            }
        } catch (error) {
            console.warn('Could not load production sensitive config:', error);
            // Fallback to GitHub Pages method if server endpoint fails
            if (this.isGitHubPages()) {
                await this.loadSensitiveFromGitHubPages();
            }
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
     * Load sensitive config for GitHub Pages deployment
     */
    async loadSensitiveFromGitHubPages() {
        // For GitHub Pages, we need to prompt for the Google Apps Script URL
        // since we can't store it securely in the repository
        if (!this.config.GOOGLE_APPS_SCRIPT_URL || this.config.GOOGLE_APPS_SCRIPT_URL.includes('YOUR_')) {
            this.promptForGoogleAppsScriptUrl();
        }

        // Load GitHub Pages specific configuration
        if (window.GITHUB_PAGES_CONFIG) {
            Object.keys(window.GITHUB_PAGES_CONFIG).forEach(key => {
                this.config[key] = window.GITHUB_PAGES_CONFIG[key];
            });
        }
    }
    
    /**
     * Prompt for sensitive configuration (development and GitHub Pages)
     */
    promptForSensitiveConfig() {
        if (!this.isDevelopment() && !this.isGitHubPages()) return;

        // Only prompt for Google Apps Script URL if Google Sheets feature is enabled
        if (this.config.FEATURE_GOOGLE_SHEETS && !this.config.GOOGLE_APPS_SCRIPT_URL) {
            this.promptForGoogleAppsScriptUrl();
        }
    }

    /**
     * Prompt specifically for Google Apps Script URL
     */
    promptForGoogleAppsScriptUrl() {
        const url = prompt(
            'Enter your Google Apps Script URL for attendance tracking:\n' +
            '(Leave empty to disable attendance tracking)'
        );

        if (url && url.trim() && !url.includes('YOUR_')) {
            this.config.GOOGLE_APPS_SCRIPT_URL = url.trim();
            if (this.secureStorage) {
                this.secureStorage.set('GOOGLE_APPS_SCRIPT_URL', url.trim());
            }
            this.config.ENABLE_ATTENDANCE_TRACKING = true;
            this.config.FEATURE_GOOGLE_SHEETS = true;
        } else {
            this.config.ENABLE_ATTENDANCE_TRACKING = false;
            this.config.FEATURE_GOOGLE_SHEETS = false;
        }
    }
    
    /**
     * Set default configuration values
     */
    setDefaults() {
        const defaults = {
            NODE_ENV: this.isDevelopment() ? 'development' : 'production',
            APP_NAME: 'MTC Event Check-In QR Tool',
            APP_VERSION: '2.0.0',
            DEFAULT_EVENT_NAME: 'MTC Event',
            ENABLE_QR_GENERATION: true,
            ENABLE_ATTENDANCE_TRACKING: false,
            FEATURE_EVENT_NAME_FIELD: true,
            FEATURE_GOOGLE_SHEETS: false,
            SHOW_ATTENDANCE_MESSAGES: true,
            SHOW_DEBUG_INFO: this.isDevelopment(),
            ENABLE_CONSOLE_LOGGING: this.isDevelopment(),
            QR_CODE_SIZE: 256,
            QR_CODE_COLOR_DARK: '#000000',
            QR_CODE_COLOR_LIGHT: '#ffffff',
            PRIMARY_COLOR: '#0078D4'
        };
        
        Object.keys(defaults).forEach(key => {
            if (this.config[key] === undefined) {
                this.config[key] = defaults[key];
            }
        });
    }
    
    /**
     * Get configuration value
     */
    get(key, defaultValue = null) {
        if (!this.isInitialized) {
            console.warn('Secure configuration not initialized yet');
        }
        
        return this.config[key] !== undefined ? this.config[key] : defaultValue;
    }
    
    /**
     * Get public (non-sensitive) configuration
     */
    getPublicConfig() {
        const publicConfig = {};
        Object.keys(this.config).forEach(key => {
            if (!this.sensitiveKeys.has(key)) {
                publicConfig[key] = this.config[key];
            }
        });
        return publicConfig;
    }
    
    /**
     * Check if sensitive configuration is available
     */
    hasSensitiveConfig() {
        return Array.from(this.sensitiveKeys).some(key => 
            this.config[key] && 
            !this.config[key].includes('YOUR_') && 
            !this.config[key].includes('PLACEHOLDER')
        );
    }
    
    /**
     * Update sensitive configuration
     */
    updateSensitiveConfig(key, value) {
        if (!this.sensitiveKeys.has(key)) {
            console.warn(`${key} is not a sensitive configuration key`);
            return false;
        }
        
        this.config[key] = value;
        this.secureStorage.set(key, value);
        return true;
    }
    
    /**
     * Clear sensitive configuration
     */
    clearSensitiveConfig() {
        this.sensitiveKeys.forEach(key => {
            delete this.config[key];
            this.secureStorage.remove(key);
        });
    }
    
    /**
     * Check if feature is enabled
     */
    isFeatureEnabled(feature) {
        return this.get(`FEATURE_${feature.toUpperCase()}`, false);
    }
}

// Create and export global instance
const secureConfig = new SecureConfig();

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        secureConfig.initialize();
    });
} else {
    secureConfig.initialize();
}

// Export for global use
window.SecureConfig = secureConfig;

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = secureConfig;
}
