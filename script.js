// MTC Event Check-In QR Tool JavaScript with Environment Variables
// Ensures DOM is fully loaded before executing script

document.addEventListener('DOMContentLoaded', async function() {
    // Wait for environment configuration to load
    await waitForEnvironmentConfig();

    // Initialize application with environment configuration
    initializeApplication();
});

/**
 * Wait for environment configuration to be loaded
 */
async function waitForEnvironmentConfig() {
    return new Promise((resolve) => {
        if (window.SecureConfig && window.SecureConfig.isInitialized) {
            resolve();
            return;
        }

        // Wait for secure config initialization
        window.addEventListener('secure-config-initialized', resolve, { once: true });

        // Fallback timeout
        setTimeout(resolve, 5000);
    });
}

/**
 * Get environment configuration safely
 */
function getEnvironmentConfig() {
    if (window.SecureConfig) {
        return {
            // Application settings
            appName: window.SecureConfig.get('APP_NAME', 'MTC Event Check-In QR Tool'),
            defaultEventName: window.SecureConfig.get('DEFAULT_EVENT_NAME', 'MTC Event'),
            enableAttendanceTracking: window.SecureConfig.get('ENABLE_ATTENDANCE_TRACKING', false),
            enableQRGeneration: window.SecureConfig.get('ENABLE_QR_GENERATION', true),

            // UI settings
            showAttendanceMessages: window.SecureConfig.get('SHOW_ATTENDANCE_MESSAGES', true),
            showDebugInfo: window.SecureConfig.get('SHOW_DEBUG_INFO', false),
            enableKeyboardShortcuts: window.SecureConfig.get('ENABLE_KEYBOARD_SHORTCUTS', true),

            // QR Code settings
            qrCodeSize: window.SecureConfig.get('QR_CODE_SIZE', 256),
            qrCodeColorDark: window.SecureConfig.get('QR_CODE_COLOR_DARK', '#000000'),
            qrCodeColorLight: window.SecureConfig.get('QR_CODE_COLOR_LIGHT', '#ffffff'),
            qrCodeCorrectionLevel: window.SecureConfig.get('QR_CODE_CORRECTION_LEVEL', 'M'),

            // Validation settings
            enableEmailValidation: window.SecureConfig.get('ENABLE_EMAIL_VALIDATION', true),
            enableNameValidation: window.SecureConfig.get('ENABLE_NAME_VALIDATION', true),
            minNameLength: window.SecureConfig.get('MIN_NAME_LENGTH', 2),
            maxNameLength: window.SecureConfig.get('MAX_NAME_LENGTH', 100),

            // Google Sheets settings
            googleAppsScriptUrl: window.SecureConfig.get('GOOGLE_APPS_SCRIPT_URL', ''),
            googleRequestTimeout: window.SecureConfig.get('GOOGLE_REQUEST_TIMEOUT', 10000),
            googleMaxRetries: window.SecureConfig.get('GOOGLE_MAX_RETRIES', 3),

            // Feature flags
            featureGoogleSheets: window.SecureConfig.get('FEATURE_GOOGLE_SHEETS', false),
            featureEventNameField: window.SecureConfig.get('FEATURE_EVENT_NAME_FIELD', true),

            // Logging
            enableConsoleLogging: window.SecureConfig.get('ENABLE_CONSOLE_LOGGING', false),
            enableErrorLogging: window.SecureConfig.get('ENABLE_ERROR_LOGGING', true)
        };
    }

    // Fallback configuration if SecureConfig is not available
    return {
        appName: 'MTC Event Check-In QR Tool',
        defaultEventName: 'MTC Event',
        enableAttendanceTracking: false,
        enableQRGeneration: true,
        showAttendanceMessages: true,
        showDebugInfo: false,
        enableKeyboardShortcuts: true,
        qrCodeSize: 256,
        qrCodeColorDark: '#000000',
        qrCodeColorLight: '#ffffff',
        qrCodeCorrectionLevel: 'M',
        enableEmailValidation: true,
        enableNameValidation: true,
        minNameLength: 2,
        maxNameLength: 100,
        googleAppsScriptUrl: '',
        googleRequestTimeout: 10000,
        googleMaxRetries: 3,
        featureGoogleSheets: false,
        featureEventNameField: true,
        enableConsoleLogging: false,
        enableErrorLogging: true
    };
}

/**
 * Initialize main application with configuration
 */
function initializeApplication() {
    // Get environment configuration
    const config = getEnvironmentConfig();

    // Apply theme configuration
    applyThemeConfiguration(config);

    // Initialize main functionality
    initializeMainFunctionality(config);
}

/**
 * Apply theme configuration from environment variables
 */
function applyThemeConfiguration(config) {
    if (!window.SecureConfig) return;

    const root = document.documentElement;
    const themeVars = {
        '--primary-color': window.SecureConfig.get('PRIMARY_COLOR', '#0078D4'),
        '--secondary-color': window.SecureConfig.get('SECONDARY_COLOR', '#106ebe'),
        '--background-color': window.SecureConfig.get('BACKGROUND_COLOR', '#f0f2f5'),
        '--container-background': window.SecureConfig.get('CONTAINER_BACKGROUND', '#ffffff'),
        '--text-color': window.SecureConfig.get('TEXT_COLOR', '#333333')
    };

    Object.keys(themeVars).forEach(property => {
        root.style.setProperty(property, themeVars[property]);
    });
}

/**
 * Initialize main application functionality
 */
function initializeMainFunctionality(config) {
    // 1. Getting DOM elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const eventInput = document.getElementById('event');
    const generateBtn = document.getElementById('generate-btn');
    const qrContainer = document.getElementById('qr-container');

    // Store reference to current QR code instance for cleanup
    let currentQRCode = null;

    // Attendance tracking variables
    let attendanceCounter = 0;
    let isRecordingAttendance = false;
    
    // 2. Main generate function - handles QR code creation
    function generateQRCode() {
        // 3. Input validation - check if both fields are filled
        const studentName = nameInput.value.trim();
        const studentEmail = emailInput.value.trim();

        // Use environment configuration for validation
        if (config.enableNameValidation && (!studentName || studentName.length < config.minNameLength)) {
            alert(`Please enter a valid name (minimum ${config.minNameLength} characters).`);
            return;
        }

        if (!studentEmail) {
            alert('Please fill in the Email Address field before generating a QR code.');
            return;
        }

        // Additional email format validation using environment config
        if (config.enableEmailValidation) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(studentEmail)) {
                alert('Please enter a valid email address.');
                return;
            }

            if (studentEmail.length > config.maxEmailLength) {
                alert(`Email address is too long (maximum ${config.maxEmailLength} characters).`);
                return;
            }
        }
        
        // 4. Clear old QR code if it exists
        clearQRCode();
        
        // Format data as specified: multi-line string with Name and Email
        const qrData = `Name: ${studentName}\nEmail: ${studentEmail}`;
        
        // 5. Create new QR code instance
        try {
            // Add visual feedback that QR is being generated
            qrContainer.innerHTML = '<div class="generating" style="display: flex; align-items: center; justify-content: center; height: 100%; color: #0078D4; font-weight: 600;">Generating QR Code...</div>';

            // Small delay to show generating message, then clear and create QR
            setTimeout(() => {
                // Clear the generating message completely
                qrContainer.innerHTML = '';

                // Create QR code with environment-configured options
                currentQRCode = new QRCode(qrContainer, {
                    text: qrData,
                    width: config.qrCodeSize,
                    height: config.qrCodeSize,
                    colorDark: config.qrCodeColorDark,
                    colorLight: config.qrCodeColorLight,
                    correctLevel: QRCode.CorrectLevel[config.qrCodeCorrectionLevel] || QRCode.CorrectLevel.M
                });

                // Add styling class to container when QR is present
                qrContainer.classList.add('has-qr');

                // Add success feedback
                console.log('QR Code generated successfully for:', studentName);

                // Record attendance in Google Sheets
                const eventName = eventInput.value.trim() || undefined;
                recordAttendance(studentName, studentEmail, eventName);

            }, 500);
            
        } catch (error) {
            console.error('Error generating QR code:', error);
            alert('An error occurred while generating the QR code. Please try again.');
            showPlaceholder();
        }
    }
    
    // Helper function to clear existing QR code
    function clearQRCode() {
        if (currentQRCode) {
            qrContainer.innerHTML = '';
            qrContainer.classList.remove('has-qr');
            currentQRCode = null;
        }
    }
    
    // Helper function to show placeholder content
    function showPlaceholder() {
        qrContainer.classList.remove('has-qr');
        qrContainer.innerHTML = `
            <div class="qr-placeholder">
                <svg class="qr-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
                    <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
                    <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" stroke-width="2"/>
                    <rect x="5" y="5" width="4" height="4" rx="0.5" fill="currentColor"/>
                    <rect x="15" y="5" width="4" height="4" rx="0.5" fill="currentColor"/>
                    <rect x="5" y="15" width="4" height="4" rx="0.5" fill="currentColor"/>
                    <rect x="13" y="13" width="2" height="2" fill="currentColor"/>
                    <rect x="17" y="13" width="2" height="2" fill="currentColor"/>
                    <rect x="19" y="15" width="2" height="2" fill="currentColor"/>
                    <rect x="13" y="17" width="2" height="2" fill="currentColor"/>
                    <rect x="15" y="19" width="2" height="2" fill="currentColor"/>
                    <rect x="19" y="19" width="2" height="2" fill="currentColor"/>
                </svg>
                <p class="placeholder-text">Your QR code will appear here</p>
            </div>
        `;
    }
    
    // Event listeners
    generateBtn.addEventListener('click', generateQRCode);
    
    // Allow Enter key to trigger QR generation from input fields
    nameInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });
    
    emailInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });

    eventInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            generateQRCode();
        }
    });
    
    // Add visual feedback for button interactions
    generateBtn.addEventListener('mousedown', function() {
        this.style.transform = 'translateY(1px)';
    });
    
    generateBtn.addEventListener('mouseup', function() {
        this.style.transform = 'translateY(-1px)';
    });
    
    generateBtn.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
    
    // Initialize with placeholder
    showPlaceholder();
    
    // Attendance tracking functions

    /**
     * Record attendance in Google Sheets
     */
    async function recordAttendance(name, email, eventName = null) {
        // Check if attendance tracking is enabled via environment config
        if (!config.enableAttendanceTracking || !config.featureGoogleSheets) {
            if (config.enableConsoleLogging) {
                console.log('Attendance tracking is disabled in configuration');
            }
            return;
        }

        // Check if Google Apps Script URL is configured
        if (!config.googleAppsScriptUrl || config.googleAppsScriptUrl.includes('YOUR_SCRIPT_ID')) {
            if (config.showAttendanceMessages) {
                showAttendanceStatus('Google Sheets not configured - attendance tracking disabled', 'warning');
            }
            if (config.enableConsoleLogging) {
                console.warn('Google Sheets integration not configured. Please update your environment variables.');
            }
            return;
        }

        if (isRecordingAttendance) {
            console.log('Already recording attendance, skipping duplicate request');
            return;
        }

        isRecordingAttendance = true;

        try {
            // Show attendance recording status
            showAttendanceStatus('Recording attendance...', 'info');

            // Get IP address (best effort)
            let ipAddress = '';
            try {
                // Try to get IP address from a public service
                const ipResponse = await fetch('https://api.ipify.org?format=json', {
                    method: 'GET',
                    timeout: 3000
                });
                if (ipResponse.ok) {
                    const ipData = await ipResponse.json();
                    ipAddress = ipData.ip || '';
                }
            } catch (ipError) {
                // IP detection failed, continue without it
                if (config.enableConsoleLogging) {
                    console.warn('Could not detect IP address:', ipError);
                }
            }

            // Prepare attendance data using environment configuration
            const attendanceData = {
                name: name,
                email: email,
                event: eventName || config.defaultEventName,
                qrGenerated: true,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                ipAddress: ipAddress
            };

            // Log the request if debugging is enabled
            if (config.enableConsoleLogging) {
                console.log('Recording attendance:', attendanceData);
            }

            // Send data to Google Sheets using environment-configured URL
            const response = await fetch(config.googleAppsScriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Required for Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(attendanceData)
            });

            // Note: Due to no-cors mode, we can't read the response
            // But the request should still be processed by Google Apps Script

            // Update attendance counter
            attendanceCounter++;

            // Show success message
            showAttendanceStatus('Attendance recorded successfully!', 'success');

            // Log success
            if (config.enableConsoleLogging) {
                console.log('Attendance recorded successfully for:', name);
            }

        } catch (error) {
            console.error('Error recording attendance:', error);
            showAttendanceStatus('Failed to record attendance', 'error');
        } finally {
            isRecordingAttendance = false;

            // Clear status message after delay
            setTimeout(() => {
                hideAttendanceStatus();
            }, 3000);
        }
    }

    /**
     * Show attendance status message
     */
    function showAttendanceStatus(message, type = 'info') {
        // Check if status messages are enabled via environment config
        if (!config.showAttendanceMessages) {
            return;
        }

        // Remove existing status message
        const existingStatus = document.querySelector('.attendance-status');
        if (existingStatus) {
            existingStatus.remove();
        }

        // Create status message element
        const statusElement = document.createElement('div');
        statusElement.className = `attendance-status attendance-status--${type}`;
        statusElement.textContent = message;

        // Insert after the QR container
        qrContainer.parentNode.insertBefore(statusElement, qrContainer.nextSibling);

        // Animate in
        setTimeout(() => {
            statusElement.classList.add('attendance-status--visible');
        }, 10);
    }

    /**
     * Hide attendance status message
     */
    function hideAttendanceStatus() {
        const statusElement = document.querySelector('.attendance-status');
        if (statusElement) {
            statusElement.classList.remove('attendance-status--visible');
            setTimeout(() => {
                statusElement.remove();
            }, 300);
        }
    }

    // Log initialization success
    if (config.enableConsoleLogging) {
        console.log('MTC Event Check-In QR Tool with environment variables initialized successfully');
        console.log('Configuration:', config);
    }
}
