/**
 * Configuration file for MTC Event Check-In QR Tool
 * Update these settings according to your setup
 */

// Google Apps Script Web App URL
// Replace this with your actual Google Apps Script web app URL after deployment
const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

// Event Configuration
const EVENT_CONFIG = {
    // Default event name (can be overridden)
    defaultEventName: 'MTC Event',
    
    // Enable/disable attendance tracking
    enableAttendanceTracking: true,
    
    // Timeout for Google Sheets requests (milliseconds)
    requestTimeout: 10000,
    
    // Retry attempts for failed requests
    maxRetries: 3
};

// UI Configuration
const UI_CONFIG = {
    // Show attendance status messages
    showAttendanceMessages: true,
    
    // Show attendance counter
    showAttendanceCounter: false,
    
    // Auto-clear form after successful submission
    autoClearForm: false
};

// Debug Configuration
const DEBUG_CONFIG = {
    // Enable console logging
    enableLogging: true,
    
    // Log attendance requests
    logAttendanceRequests: true
};

// Export configuration (for use in other files)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GOOGLE_APPS_SCRIPT_URL,
        EVENT_CONFIG,
        UI_CONFIG,
        DEBUG_CONFIG
    };
}
