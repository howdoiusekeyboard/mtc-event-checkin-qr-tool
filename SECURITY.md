# Security Policy

## 🔒 Security Overview

The MTC Event Check-In QR Tool takes security seriously. This document outlines our security practices and how to report security vulnerabilities.

## 🛡️ Security Features

### Environment Variable Security
- **Sensitive Data Protection**: API keys and URLs are handled securely
- **Environment Separation**: Different credentials for dev/staging/production
- **Client-Safe Configuration**: Only non-sensitive data exposed to browser
- **Git Protection**: Comprehensive .gitignore prevents data exposure

### Application Security
- **Input Validation**: All user inputs are validated and sanitized
- **XSS Prevention**: Proper data handling prevents cross-site scripting
- **CORS Configuration**: Configurable CORS settings for production
- **Rate Limiting**: Optional rate limiting for production environments

### Data Security
- **No Persistent Storage**: No sensitive data stored in browser
- **Secure Transmission**: HTTPS recommended for production
- **Google Sheets Integration**: Uses official Google APIs securely
- **Session-Based Storage**: Sensitive config stored in sessionStorage only
