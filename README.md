# MTC Event Check-In QR Tool with Environment Variables

A professional, enterprise-grade single-page web application for generating QR codes for Microsoft Tech Club (MTC) event check-ins with automatic attendance tracking to Google Sheets. This tool features a comprehensive environment variable system for secure, flexible configuration across development, staging, and production environments.

## Features

- **Microsoft Fluent Design**: Clean, professional interface inspired by Microsoft's design system
- **Instant QR Generation**: Creates QR codes on-demand for event attendees
- **Automatic Attendance Tracking**: Records attendance data directly to Google Sheets
- **Environment Variable System**: Comprehensive configuration management with security
- **Multi-Environment Support**: Separate configurations for development, staging, and production
- **Secure Configuration**: Sensitive data protection with client-safe public configuration
- **Real-time Status Updates**: Visual feedback for attendance recording
- **Input Validation**: Configurable validation rules via environment variables
- **Event Management**: Optional event name field for tracking multiple events
- **Responsive Design**: Works seamlessly on laptops, tablets, and mobile devices
- **Feature Flags**: Enable/disable features via environment configuration
- **Theme Customization**: Configurable colors and styling via environment variables

## Quick Start

### 1. Environment Setup (2 minutes)
```bash
# Copy environment template
cp .env.example .env.development

# Configure Google Sheets (optional)
# Edit .env.development and add your Google Apps Script URL
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### 2. Deploy Configuration
```bash
# Deploy to development environment
node deploy.js development
```

### 3. Usage
1. Open `index.html` in a web browser
2. Enter the student's name and email address
3. Optionally enter an event name (defaults to configured event name)
4. Click "Generate Check-In QR" button
5. The QR code will appear instantly, containing the attendee's information
6. Attendance is automatically recorded in your connected Google Sheet (if configured)

## QR Code Data Format

The generated QR codes contain the following information:
```
Name: [Student Name]
Email: [Student Email]
```

## Environment Variable System

This application features a comprehensive environment variable system for enterprise-grade configuration management:

### Key Features
- **Multi-Environment Support**: Separate configurations for development, staging, and production
- **Secure Configuration**: Sensitive data protection with client-safe public configuration
- **Feature Flags**: Enable/disable features via environment variables
- **Theme Customization**: Configure colors and styling via environment variables
- **Validation and Fallbacks**: Comprehensive validation with safe defaults
- **Auto-Deployment**: Automated deployment script for different environments

### Environment Files
- `.env.development` - Local development with debug features
- `.env.staging` - Pre-production testing environment
- `.env.production` - Optimized production configuration
- `.env.example` - Template with all available variables

### Key Environment Variables
```bash
# Application Configuration
NODE_ENV=development
APP_NAME=MTC Event Check-In QR Tool
DEFAULT_EVENT_NAME=MTC Event

# Google Sheets Integration
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
ENABLE_ATTENDANCE_TRACKING=true

# Feature Flags
FEATURE_GOOGLE_SHEETS=true
FEATURE_EVENT_NAME_FIELD=true

# UI Configuration
PRIMARY_COLOR=#0078D4
SHOW_DEBUG_INFO=false
ENABLE_CONSOLE_LOGGING=false
```

## Technical Stack

- **HTML5**: Semantic structure with environment meta tags
- **CSS3**: Microsoft Fluent Design system with CSS custom properties
- **JavaScript (ES6+)**: Modern JavaScript with environment variable integration
- **Environment System**: Comprehensive configuration management
- **QRCode.js**: External library for QR code generation (loaded via CDN)

## File Structure

```
├── index.html                  # Main HTML structure with environment meta tags
├── styles.css                  # Microsoft Fluent Design styling with CSS variables
├── script.js                   # JavaScript with environment variable integration
├── env-loader.js              # Environment configuration loader
├── secure-config.js           # Secure configuration handler
├── config.json                # Generated public configuration (auto-generated)
├── deploy.js                  # Environment deployment script
├── google-apps-script.js      # Google Apps Script code for Sheets integration
├── .env.example               # Environment variables template
├── .env.development           # Development environment configuration
├── .env.staging               # Staging environment configuration
├── .env.production            # Production environment configuration
├── .gitignore                 # Git ignore file (protects sensitive data)
├── README.md                  # Main documentation
├── ENVIRONMENT_VARIABLES.md   # Complete environment variables reference
├── ENVIRONMENT_SETUP.md       # Environment setup guide
├── SETUP_GUIDE.md             # Complete setup instructions
└── GOOGLE_SHEETS_SETUP.md     # Detailed Google Sheets configuration guide
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Local Development

To run locally:

1. Start a local web server in the project directory:
   ```bash
   python -m http.server 8000
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:8000
   ```

## Design Specifications

- **Font**: Segoe UI (Microsoft standard)
- **Primary Color**: Microsoft Blue (#0078D4)
- **Background**: Light gray (#f0f2f5)
- **Container**: White with subtle shadow
- **QR Code Size**: 256x256 pixels

## Validation Features

- Required field validation for both name and email
- Email format validation using regex
- User-friendly error messages via alerts
- Visual feedback during QR code generation

## Accessibility

- Semantic HTML structure
- Proper form labels
- Keyboard navigation support (Enter key triggers generation)
- High contrast colors for readability

---

**Developed for Microsoft Tech Club (MTC)**  
*Professional event check-in solution*
