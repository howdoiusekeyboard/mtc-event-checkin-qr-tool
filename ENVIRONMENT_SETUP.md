# Environment Variables Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Choose Your Environment

```bash
# For local development
cp .env.example .env.development

# For staging/testing
cp .env.example .env.staging

# For production
cp .env.example .env.production
```

### Step 2: Configure Google Sheets Integration

1. **Set up Google Apps Script** (see [GOOGLE_SHEETS_SETUP.md](GOOGLE_SHEETS_SETUP.md))
2. **Update your environment file**:
   ```bash
   # Edit .env.development (or your chosen environment)
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   GOOGLE_SHEET_ID=your_actual_google_sheet_id
   ```

### Step 3: Deploy Configuration

```bash
# Deploy to development
node deploy.js development

# Or deploy to production
node deploy.js production
```

### Step 4: Test Your Setup

Open your application and check:
- ✅ QR codes generate successfully
- ✅ Attendance tracking works (if enabled)
- ✅ No console errors
- ✅ Configuration loads properly

## 📋 Detailed Setup Instructions

### Environment File Configuration

#### 1. Application Settings
```bash
# Basic application configuration
APP_NAME=MTC Event Check-In QR Tool
APP_VERSION=2.0.0
DEFAULT_EVENT_NAME=Your Event Name Here
```

#### 2. Google Sheets Integration
```bash
# Required for attendance tracking
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
GOOGLE_SHEET_ID=your_google_sheet_id_here
GOOGLE_SHEET_NAME=Attendance
```

#### 3. Feature Configuration
```bash
# Enable/disable features
ENABLE_ATTENDANCE_TRACKING=true
FEATURE_GOOGLE_SHEETS=true
FEATURE_EVENT_NAME_FIELD=true
SHOW_ATTENDANCE_MESSAGES=true
```

#### 4. Security Settings
```bash
# Validation and security
ENABLE_EMAIL_VALIDATION=true
ENABLE_NAME_VALIDATION=true
MIN_NAME_LENGTH=2
MAX_NAME_LENGTH=100
```

#### 5. UI/UX Settings
```bash
# User interface configuration
PRIMARY_COLOR=#0078D4
BACKGROUND_COLOR=#f0f2f5
SHOW_DEBUG_INFO=false
ENABLE_KEYBOARD_SHORTCUTS=true
```

### Environment-Specific Configurations

#### Development Environment
```bash
# .env.development
NODE_ENV=development
SHOW_DEBUG_INFO=true
ENABLE_CONSOLE_LOGGING=true
LOG_LEVEL=debug
EXPERIMENTAL_FEATURES=true
```

#### Staging Environment
```bash
# .env.staging
NODE_ENV=staging
SHOW_DEBUG_INFO=true
ENABLE_CONSOLE_LOGGING=true
LOG_LEVEL=info
ENABLE_PERFORMANCE_MONITORING=true
```

#### Production Environment
```bash
# .env.production
NODE_ENV=production
SHOW_DEBUG_INFO=false
ENABLE_CONSOLE_LOGGING=false
LOG_LEVEL=error
ENABLE_ANALYTICS=true
```

## 🔧 Advanced Configuration

### Custom Theme Configuration

```bash
# Microsoft Fluent Design colors
PRIMARY_COLOR=#0078D4
SECONDARY_COLOR=#106ebe
BACKGROUND_COLOR=#f0f2f5
CONTAINER_BACKGROUND=#ffffff
TEXT_COLOR=#333333

# Custom brand colors
PRIMARY_COLOR=#your-brand-color
SECONDARY_COLOR=#your-secondary-color
```

### QR Code Customization

```bash
# QR code appearance
QR_CODE_SIZE=256
QR_CODE_COLOR_DARK=#000000
QR_CODE_COLOR_LIGHT=#ffffff
QR_CODE_CORRECTION_LEVEL=M

# QR code data format
QR_DATA_CUSTOM_FORMAT=Name: {name}\nEmail: {email}\nEvent: {event}
QR_DATA_INCLUDE_TIMESTAMP=false
QR_DATA_INCLUDE_EVENT_NAME=true
```

### Performance Optimization

```bash
# Caching and performance
ENABLE_BROWSER_CACHING=true
CACHE_DURATION=3600
REQUEST_TIMEOUT=10000
RETRY_ATTEMPTS=3
RETRY_DELAY=1000
```

### Security Configuration

```bash
# CORS and security
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
ENABLE_CORS_VALIDATION=true
ENABLE_RATE_LIMITING=true
MAX_REQUESTS_PER_MINUTE=30
```

## 🛠️ Deployment Methods

### Method 1: Automated Deployment Script

```bash
# Deploy to specific environment
node deploy.js development
node deploy.js staging
node deploy.js production

# The script will:
# - Load environment configuration
# - Generate config.json
# - Update HTML meta tags
# - Validate deployment
```

### Method 2: Manual Configuration

1. **Copy environment file**:
   ```bash
   cp .env.development .env
   ```

2. **Update configuration manually**:
   ```bash
   # Edit your environment variables
   nano .env
   ```

3. **Generate configuration files**:
   ```bash
   # Create config.json from environment
   node -e "
   const fs = require('fs');
   const env = require('dotenv').config();
   const config = {};
   Object.keys(env.parsed).forEach(key => {
     if (!key.includes('SECRET') && !key.includes('PRIVATE')) {
       config[key] = env.parsed[key];
     }
   });
   fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
   "
   ```

### Method 3: Server-Side Configuration

For production deployments, configure environment variables on your server:

```bash
# Set environment variables on your server
export GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec"
export NODE_ENV="production"
export ENABLE_ATTENDANCE_TRACKING="true"

# Start your application
npm start
```

## 🔍 Validation and Testing

### Configuration Validation

The system automatically validates your configuration:

```javascript
// Check configuration status
console.log('Environment loaded:', window.SecureConfig.isInitialized);
console.log('Configuration errors:', window.SecureConfig.getErrors());
console.log('Configuration warnings:', window.SecureConfig.getWarnings());
```

### Testing Checklist

- [ ] Environment file exists and is readable
- [ ] Google Apps Script URL is configured (if using attendance tracking)
- [ ] All required fields have values
- [ ] No placeholder values remain (YOUR_SCRIPT_ID, etc.)
- [ ] Feature flags are set correctly
- [ ] Theme colors are valid hex codes
- [ ] Numeric values are within valid ranges

### Debug Mode

Enable debug mode for troubleshooting:

```bash
ENABLE_DEBUG_MODE=true
ENABLE_CONSOLE_LOGGING=true
LOG_LEVEL=debug
SHOW_DEBUG_INFO=true
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Configuration Not Loading
```bash
# Check if environment file exists
ls -la .env*

# Verify file permissions
chmod 644 .env.development

# Check for syntax errors
cat .env.development | grep -E '^[A-Z_]+=.*$'
```

#### 2. Google Sheets Not Working
```bash
# Verify Google Apps Script URL
echo $GOOGLE_APPS_SCRIPT_URL

# Check feature flags
grep -E 'FEATURE_GOOGLE_SHEETS|ENABLE_ATTENDANCE_TRACKING' .env.development
```

#### 3. Theme Not Applied
```bash
# Check color format
grep COLOR .env.development

# Verify colors are valid hex codes
echo "#0078D4" | grep -E '^#[0-9A-Fa-f]{6}$'
```

### Debug Commands

```bash
# View current configuration
node -e "console.log(require('dotenv').config())"

# Validate environment file
node deploy.js development --validate-only

# Check for missing variables
diff .env.example .env.development
```

## 📚 Best Practices

### Security
- Never commit `.env` files to version control
- Use different credentials for each environment
- Regularly rotate sensitive credentials
- Monitor access to configuration files

### Organization
- Use consistent naming conventions
- Group related variables together
- Document custom variables
- Keep environment files synchronized

### Maintenance
- Regularly review and update configurations
- Test configuration changes in staging first
- Keep backups of working configurations
- Document any custom modifications

## 🔗 Related Documentation

- [Environment Variables Reference](ENVIRONMENT_VARIABLES.md)
- [Google Sheets Setup](GOOGLE_SHEETS_SETUP.md)
- [Security Configuration](SECURITY.md)
- [Deployment Guide](SETUP_GUIDE.md)
