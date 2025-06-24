/**
 * Environment Loader for Browser Applications
 * This script safely loads environment variables for client-side use
 * while keeping sensitive data secure
 */

(function() {
    'use strict';
    
    /**
     * Environment Variable Loader
     * Loads configuration from various sources with security considerations
     */
    class EnvLoader {
        constructor() {
            this.loadedConfig = null;
            this.isSecure = window.location.protocol === 'https:';
            this.isDevelopment = this.detectEnvironment();
        }
        
        /**
         * Detect current environment
         */
        detectEnvironment() {
            const hostname = window.location.hostname;
            return hostname === 'localhost' || 
                   hostname === '127.0.0.1' || 
                   hostname.startsWith('192.168.') ||
                   hostname.endsWith('.local');
        }
        
        /**
         * Load environment configuration
         */
        async loadEnvironment() {
            try {
                // Try multiple loading strategies
                const config = await this.tryLoadingStrategies();
                
                // Validate and sanitize configuration
                this.loadedConfig = this.validateAndSanitize(config);
                
                // Set global configuration
                this.setGlobalConfig();
                
                return this.loadedConfig;
                
            } catch (error) {
                console.error('Failed to load environment configuration:', error);
                
                // Fall back to safe defaults
                this.loadedConfig = this.getSafeDefaults();
                this.setGlobalConfig();
                
                return this.loadedConfig;
            }
        }
        
        /**
         * Try different loading strategies
         */
        async tryLoadingStrategies() {
            const strategies = [
                () => this.loadFromMetaTags(),
                () => this.loadFromConfigEndpoint(),
                () => this.loadFromLocalStorage(),
                () => this.loadFromDefaults()
            ];
            
            for (const strategy of strategies) {
                try {
                    const config = await strategy();
                    if (config && Object.keys(config).length > 0) {
                        return config;
                    }
                } catch (error) {
                    console.warn('Loading strategy failed:', error.message);
                }
            }
            
            throw new Error('All loading strategies failed');
        }
        
        /**
         * Load from meta tags (most secure for client-side)
         */
        loadFromMetaTags() {
            const config = {};
            const metaTags = document.querySelectorAll('meta[name^="env-"]');
            
            metaTags.forEach(tag => {
                const key = tag.getAttribute('name').replace('env-', '').toUpperCase();
                const value = tag.getAttribute('content');
                config[key] = value;
            });
            
            return config;
        }
        
        /**
         * Load from configuration endpoint
         */
        async loadFromConfigEndpoint() {
            const endpoints = [
                '/api/config',
                '/config.json',
                '/env.json'
            ];
            
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Cache-Control': 'no-cache'
                        }
                    });
                    
                    if (response.ok) {
                        return await response.json();
                    }
                } catch (error) {
                    // Continue to next endpoint
                }
            }
            
            throw new Error('No configuration endpoint available');
        }
        
        /**
         * Load from localStorage (development only)
         */
        loadFromLocalStorage() {
            if (!this.isDevelopment) {
                throw new Error('localStorage loading only available in development');
            }
            
            const stored = localStorage.getItem('mtc-env-config');
            if (stored) {
                return JSON.parse(stored);
            }
            
            throw new Error('No configuration in localStorage');
        }
        
        /**
         * Load safe defaults
         */
        loadFromDefaults() {
            return this.getSafeDefaults();
        }
        
        /**
         * Get safe default configuration
         */
        getSafeDefaults() {
            return {
                // Application
                NODE_ENV: this.isDevelopment ? 'development' : 'production',
                APP_NAME: 'MTC Event Check-In QR Tool',
                APP_VERSION: '2.0.0',
                DEFAULT_EVENT_NAME: 'MTC Event',
                
                // Features (safe defaults)
                ENABLE_QR_GENERATION: true,
                ENABLE_ATTENDANCE_TRACKING: false, // Disabled by default for security
                FEATURE_EVENT_NAME_FIELD: true,
                
                // UI
                SHOW_ATTENDANCE_MESSAGES: true,
                SHOW_ATTENDANCE_COUNTER: false,
                SHOW_DEBUG_INFO: this.isDevelopment,
                ENABLE_KEYBOARD_SHORTCUTS: true,
                
                // Theme
                PRIMARY_COLOR: '#0078D4',
                SECONDARY_COLOR: '#106ebe',
                BACKGROUND_COLOR: '#f0f2f5',
                CONTAINER_BACKGROUND: '#ffffff',
                TEXT_COLOR: '#333333',
                
                // QR Code
                QR_CODE_SIZE: 256,
                QR_CODE_COLOR_DARK: '#000000',
                QR_CODE_COLOR_LIGHT: '#ffffff',
                QR_CODE_CORRECTION_LEVEL: 'M',
                
                // Validation
                ENABLE_EMAIL_VALIDATION: true,
                ENABLE_NAME_VALIDATION: true,
                MIN_NAME_LENGTH: 2,
                MAX_NAME_LENGTH: 100,
                
                // Logging
                ENABLE_CONSOLE_LOGGING: this.isDevelopment,
                ENABLE_ERROR_LOGGING: true,
                LOG_LEVEL: this.isDevelopment ? 'debug' : 'error'
            };
        }
        
        /**
         * Validate and sanitize configuration
         */
        validateAndSanitize(config) {
            const sanitized = {};
            const allowedKeys = new Set([
                // Application
                'NODE_ENV', 'APP_NAME', 'APP_VERSION', 'DEFAULT_EVENT_NAME',
                
                // Features
                'ENABLE_QR_GENERATION', 'ENABLE_ATTENDANCE_TRACKING',
                'FEATURE_EVENT_NAME_FIELD', 'FEATURE_GOOGLE_SHEETS',
                
                // UI
                'SHOW_ATTENDANCE_MESSAGES', 'SHOW_ATTENDANCE_COUNTER',
                'SHOW_DEBUG_INFO', 'ENABLE_KEYBOARD_SHORTCUTS',
                
                // Theme
                'PRIMARY_COLOR', 'SECONDARY_COLOR', 'BACKGROUND_COLOR',
                'CONTAINER_BACKGROUND', 'TEXT_COLOR',
                
                // QR Code
                'QR_CODE_SIZE', 'QR_CODE_COLOR_DARK', 'QR_CODE_COLOR_LIGHT',
                'QR_CODE_CORRECTION_LEVEL',
                
                // Validation
                'ENABLE_EMAIL_VALIDATION', 'ENABLE_NAME_VALIDATION',
                'MIN_NAME_LENGTH', 'MAX_NAME_LENGTH',
                
                // Logging
                'ENABLE_CONSOLE_LOGGING', 'ENABLE_ERROR_LOGGING', 'LOG_LEVEL',
                
                // Google Sheets (public configuration only)
                'GOOGLE_SHEET_NAME', 'GOOGLE_REQUEST_TIMEOUT', 'GOOGLE_MAX_RETRIES'
            ]);
            
            // Only include allowed keys
            Object.keys(config).forEach(key => {
                if (allowedKeys.has(key)) {
                    sanitized[key] = this.sanitizeValue(config[key], key);
                }
            });
            
            // Merge with safe defaults
            return { ...this.getSafeDefaults(), ...sanitized };
        }
        
        /**
         * Sanitize individual values
         */
        sanitizeValue(value, key) {
            // Boolean conversion
            if (typeof value === 'string') {
                if (value.toLowerCase() === 'true') return true;
                if (value.toLowerCase() === 'false') return false;
            }
            
            // Number conversion for specific keys
            const numericKeys = ['QR_CODE_SIZE', 'MIN_NAME_LENGTH', 'MAX_NAME_LENGTH', 
                               'GOOGLE_REQUEST_TIMEOUT', 'GOOGLE_MAX_RETRIES'];
            if (numericKeys.includes(key) && typeof value === 'string') {
                const num = parseInt(value, 10);
                return isNaN(num) ? 0 : num;
            }
            
            // Color validation
            if (key.includes('COLOR') && typeof value === 'string') {
                return value.match(/^#[0-9A-Fa-f]{6}$/) ? value : '#000000';
            }
            
            return value;
        }
        
        /**
         * Set global configuration
         */
        setGlobalConfig() {
            // Set on window object for global access
            window.ENV_CONFIG = this.loadedConfig;
            
            // Set individual values for backward compatibility
            Object.keys(this.loadedConfig).forEach(key => {
                window[key] = this.loadedConfig[key];
            });
            
            // Dispatch configuration loaded event
            window.dispatchEvent(new CustomEvent('env-config-loaded', {
                detail: this.loadedConfig
            }));
        }
        
        /**
         * Get configuration value
         */
        get(key, defaultValue = null) {
            if (!this.loadedConfig) {
                console.warn('Environment not loaded yet');
                return defaultValue;
            }
            
            return this.loadedConfig[key] !== undefined ? this.loadedConfig[key] : defaultValue;
        }
        
        /**
         * Check if feature is enabled
         */
        isFeatureEnabled(feature) {
            return this.get(`FEATURE_${feature.toUpperCase()}`, false);
        }
    }
    
    // Create global instance
    window.EnvLoader = new EnvLoader();
    
    // Auto-load on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.EnvLoader.loadEnvironment();
        });
    } else {
        window.EnvLoader.loadEnvironment();
    }
    
})();
