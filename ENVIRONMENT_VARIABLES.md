# Environment Variables Documentation

## Overview

The MTC Event Check-In QR Tool uses a comprehensive environment variable system to manage configuration across different deployment environments (development, staging, production). This approach provides security, flexibility, and maintainability.

## 🔧 Environment System Architecture

### Configuration Layers

1. **Environment Files** (`.env`, `.env.development`, `.env.staging`, `.env.production`)
2. **Secure Configuration** (`secure-config.js`) - Handles sensitive data
3. **Public Configuration** (`config.json`) - Client-safe settings
4. **Meta Tags** (HTML) - Server-rendered configuration
5. **Runtime Configuration** - Dynamic loading and validation

### Security Model

- **Sensitive Data**: Stored securely, never exposed to client
- **Public Data**: Safe for client-side access
- **Environment Separation**: Different configs for dev/staging/prod
- **Validation**: Comprehensive validation and fallbacks

## 📋 Environment Variables Reference

### Application Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_ENV` | string | `development` | Environment mode (development/staging/production) |
| `APP_NAME` | string | `MTC Event Check-In QR Tool` | Application display name |
| `APP_VERSION` | string | `2.0.0` | Application version |
| `DEFAULT_EVENT_NAME` | string | `MTC Event` | Default event name for check-ins |
| `ENABLE_ATTENDANCE_TRACKING` | boolean | `true` | Enable/disable attendance tracking |
| `ENABLE_QR_GENERATION` | boolean | `true` | Enable/disable QR code generation |

### Google Sheets Integration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `GOOGLE_APPS_SCRIPT_URL` | string | *(required)* | **SENSITIVE** - Google Apps Script web app URL |
| `GOOGLE_SHEET_ID` | string | *(required)* | **SENSITIVE** - Google Sheet ID |
| `GOOGLE_SHEET_NAME` | string | `Attendance` | Sheet tab name |
| `GOOGLE_REQUEST_TIMEOUT` | number | `10000` | Request timeout in milliseconds |
| `GOOGLE_MAX_RETRIES` | number | `3` | Maximum retry attempts |

### UI/UX Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `SHOW_ATTENDANCE_MESSAGES` | boolean | `true` | Show attendance status messages |
| `SHOW_ATTENDANCE_COUNTER` | boolean | `false` | Show attendance counter |
| `SHOW_DEBUG_INFO` | boolean | `false` | Show debug information |
| `AUTO_CLEAR_FORM` | boolean | `false` | Clear form after submission |
| `ENABLE_KEYBOARD_SHORTCUTS` | boolean | `true` | Enable keyboard shortcuts |

### Theme Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PRIMARY_COLOR` | string | `#0078D4` | Primary brand color (Microsoft Blue) |
| `SECONDARY_COLOR` | string | `#106ebe` | Secondary brand color |
| `BACKGROUND_COLOR` | string | `#f0f2f5` | Page background color |
| `CONTAINER_BACKGROUND` | string | `#ffffff` | Container background color |
| `TEXT_COLOR` | string | `#333333` | Primary text color |

### Security Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ALLOWED_ORIGINS` | string | `*` | Comma-separated allowed origins |
| `ENABLE_CORS_VALIDATION` | boolean | `false` | Enable CORS validation |
| `ENABLE_RATE_LIMITING` | boolean | `false` | Enable rate limiting |
| `MAX_REQUESTS_PER_MINUTE` | number | `60` | Maximum requests per minute |
| `ENABLE_EMAIL_VALIDATION` | boolean | `true` | Enable email format validation |
| `ENABLE_NAME_VALIDATION` | boolean | `true` | Enable name validation |
| `MIN_NAME_LENGTH` | number | `2` | Minimum name length |
| `MAX_NAME_LENGTH` | number | `100` | Maximum name length |
| `MAX_EMAIL_LENGTH` | number | `254` | Maximum email length |

### Logging Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ENABLE_CONSOLE_LOGGING` | boolean | `false` | Enable console logging |
| `ENABLE_ERROR_LOGGING` | boolean | `true` | Enable error logging |
| `ENABLE_ATTENDANCE_LOGGING` | boolean | `false` | Enable attendance logging |
| `ENABLE_QR_LOGGING` | boolean | `false` | Enable QR code logging |
| `LOG_LEVEL` | string | `info` | Logging level (debug/info/warn/error) |
| `ENABLE_DEBUG_MODE` | boolean | `false` | Enable debug mode |
| `ENABLE_PERFORMANCE_MONITORING` | boolean | `false` | Enable performance monitoring |
| `ENABLE_ANALYTICS` | boolean | `false` | Enable analytics |

### QR Code Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `QR_CODE_SIZE` | number | `256` | QR code size in pixels |
| `QR_CODE_COLOR_DARK` | string | `#000000` | QR code dark color |
| `QR_CODE_COLOR_LIGHT` | string | `#ffffff` | QR code light color |
| `QR_CODE_CORRECTION_LEVEL` | string | `M` | Error correction level (L/M/Q/H) |
| `QR_CODE_MARGIN` | number | `4` | QR code margin |
| `QR_DATA_INCLUDE_TIMESTAMP` | boolean | `false` | Include timestamp in QR data |
| `QR_DATA_INCLUDE_EVENT_NAME` | boolean | `true` | Include event name in QR data |
| `QR_DATA_CUSTOM_FORMAT` | string | `Name: {name}\nEmail: {email}` | Custom QR data format |

### Performance Configuration

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `ENABLE_BROWSER_CACHING` | boolean | `true` | Enable browser caching |
| `CACHE_DURATION` | number | `3600` | Cache duration in seconds |
| `REQUEST_TIMEOUT` | number | `10000` | Request timeout in milliseconds |
| `RETRY_ATTEMPTS` | number | `3` | Number of retry attempts |
| `RETRY_DELAY` | number | `1000` | Delay between retries in milliseconds |

### Feature Flags

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `FEATURE_GOOGLE_SHEETS` | boolean | `true` | Enable Google Sheets integration |
| `FEATURE_EVENT_NAME_FIELD` | boolean | `true` | Enable event name field |
| `FEATURE_BULK_CHECKIN` | boolean | `false` | Enable bulk check-in feature |
| `FEATURE_EXPORT_DATA` | boolean | `false` | Enable data export feature |
| `FEATURE_REAL_TIME_STATS` | boolean | `false` | Enable real-time statistics |
| `FEATURE_EMAIL_NOTIFICATIONS` | boolean | `false` | Enable email notifications |

### Experimental Features

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `EXPERIMENTAL_OFFLINE_MODE` | boolean | `false` | Enable offline mode |
| `EXPERIMENTAL_PWA_SUPPORT` | boolean | `false` | Enable PWA support |
| `EXPERIMENTAL_DARK_MODE` | boolean | `false` | Enable dark mode |

## 🚀 Environment-Specific Configurations

### Development Environment
- **Purpose**: Local development and testing
- **Features**: All features enabled, verbose logging, relaxed security
- **File**: `.env.development`
- **Characteristics**:
  - Debug mode enabled
  - Console logging enabled
  - Experimental features enabled
  - Relaxed validation rules

### Staging Environment
- **Purpose**: Pre-production testing
- **Features**: Production-like with additional monitoring
- **File**: `.env.staging`
- **Characteristics**:
  - Moderate logging
  - Feature testing enabled
  - Performance monitoring
  - Stricter security than development

### Production Environment
- **Purpose**: Live deployment
- **Features**: Optimized for performance and security
- **File**: `.env.production`
- **Characteristics**:
  - Minimal logging
  - Strict security settings
  - Optimized performance
  - Stable features only

## 📖 Usage Examples

### Setting Up Development Environment

1. **Copy environment template**:
   ```bash
   cp .env.example .env.development
   ```

2. **Update sensitive variables**:
   ```bash
   # Edit .env.development
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
   GOOGLE_SHEET_ID=your_actual_sheet_id
   ```

3. **Deploy to development**:
   ```bash
   node deploy.js development
   ```

### Production Deployment

1. **Configure production environment**:
   ```bash
   # Edit .env.production with production values
   NODE_ENV=production
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/PROD_SCRIPT_ID/exec
   SHOW_DEBUG_INFO=false
   ENABLE_CONSOLE_LOGGING=false
   ```

2. **Deploy to production**:
   ```bash
   node deploy.js production
   ```

### Runtime Configuration Access

```javascript
// Access configuration in JavaScript
const config = window.SecureConfig;

// Check if feature is enabled
if (config.isFeatureEnabled('GOOGLE_SHEETS')) {
    // Google Sheets functionality
}

// Get configuration value
const eventName = config.get('DEFAULT_EVENT_NAME', 'MTC Event');

// Check environment
if (config.get('NODE_ENV') === 'development') {
    console.log('Running in development mode');
}
```

## 🔒 Security Best Practices

### Sensitive Data Handling
- Never commit sensitive values to version control
- Use placeholder values in example files
- Store sensitive data in secure environment variables
- Use different credentials for each environment

### Environment Separation
- Use separate Google Sheets for each environment
- Use different Google Apps Script deployments
- Implement proper access controls
- Monitor configuration changes

### Validation and Fallbacks
- Always provide safe defaults
- Validate configuration on startup
- Implement graceful degradation
- Log configuration issues

## 🛠️ Troubleshooting

### Common Issues

1. **Configuration not loading**:
   - Check file permissions
   - Verify environment file exists
   - Check for syntax errors in environment files

2. **Sensitive data not available**:
   - Verify meta tags in HTML
   - Check secure configuration loading
   - Ensure proper environment deployment

3. **Features not working**:
   - Check feature flags
   - Verify environment-specific settings
   - Review browser console for errors

### Debug Mode

Enable debug mode for detailed logging:
```bash
ENABLE_DEBUG_MODE=true
ENABLE_CONSOLE_LOGGING=true
LOG_LEVEL=debug
```

## 📚 Additional Resources

- [Google Apps Script Setup Guide](GOOGLE_SHEETS_SETUP.md)
- [Deployment Guide](SETUP_GUIDE.md)
- [Security Configuration](SECURITY.md)
- [Feature Flags Documentation](FEATURES.md)
