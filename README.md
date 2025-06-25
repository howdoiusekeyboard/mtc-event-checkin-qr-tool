---

# MTC Event Check-In QR Tool with Environment Variables

A professional, enterprise-grade single-page web application for generating QR codes for Microsoft Tech Club (MTC) event check-ins with automatic attendance tracking to Google Sheets. This tool features a comprehensive environment variable system for secure, flexible configuration across development, staging, and production environments.

![MTC Logo Placeholder](https://img.shields.io/badge/Developed%20for-MTC-0078D4?style=for-the-badge&logo=microsoft)
![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

---

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Key Features](#key-features)
- [Configuration](#configuration)
  - [Google Sheets Integration Setup](#google-sheets-integration-setup)
    - [Step 1: Create a Google Sheet](#step-1-create-a-google-sheet)
    - [Step 2: Set Up Google Apps Script](#step-2-set-up-google-apps-script)
    - [Step 3: Deploy the Script as a Web App](#step-3-deploy-the-script-as-a-web-app)
- [Quick Start](#quick-start)
- [Technical Details](#technical-details)
  - [Technical Stack](#technical-stack)
  - [QR Code Data Format](#qr-code-data-format)
  - [Design Specifications](#design-specifications)
  - [Browser Compatibility](#browser-compatibility)
  - [Accessibility](#accessibility)
- [Troubleshooting](#troubleshooting)
    - [Google Sheets \& Apps Script Issues](#google-sheets--apps-script-issues)

## Key Features

- **Microsoft Fluent Design**: Clean, professional interface inspired by Microsoft's design system.
- **Instant QR Generation**: Creates QR codes on-demand for event attendees.
- **Automatic Attendance Tracking**: Records attendance data directly to a configured Google Sheet.
- **Environment Variable System**: Comprehensive configuration management for security and flexibility.
- **Secure Configuration**: Protects sensitive data while exposing a client-safe public configuration.
- **Real-time Status Updates**: Visual feedback for attendance recording status.
- **Input Validation**: Configurable validation rules for name and email fields.
- **Event Management**: Optional event name field for tracking multiple events.
- **Responsive Design**: Works seamlessly on desktops, tablets, and mobile devices.

## Configuration

### Google Sheets Integration Setup

This is a **required step** for automatic attendance tracking.

#### Step 1: Create a Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a new spreadsheet.
2. Name it "MTC Event Attendance".
3. Copy the **Sheet ID** from the URL.
   - Example URL: `https://docs.google.com/spreadsheets/d/1ABCdeFG-H1jklmNopq-rstuvwdXYZ/edit`
   - Your Sheet ID is: `1ABCdeFG-H1jklmNopq-rstuvwdXYZ`

#### Step 2: Set Up Google Apps Script
1. Go to [script.google.com](https://script.google.com) and click **New Project**.
2. Delete the default code in the editor.
3. Copy the entire content of the `google-apps-script.js` file from this repository and paste it into the editor.
4. Find the `SHEET_ID` constant at the top of the script and replace the placeholder with your actual Sheet ID.
   ```javascript
   const SHEET_ID = 'your-actual-sheet-id-here';
   ```

#### Step 3: Deploy the Script as a Web App
1. In the Apps Script editor, click **Deploy > New deployment**.
2. In the "Select type" dialog, click the gear icon and select **Web app**.
3. Configure the deployment:
   - **Description**: `MTC Attendance Tracker API`
   - **Execute as**: `Me` (Your Google Account)
   - **Who has access**: `Anyone`
4. Click **Deploy**.
5. **Authorize access** by following the on-screen prompts and granting the necessary permissions.
6. **Copy the Web app URL**. This is the URL you will use for the `GOOGLE_APPS_SCRIPT_URL` environment variable.

Your Google Sheet is now ready to receive data. The script will automatically create headers on the first run: `Timestamp`, `Student Name`, `Email Address`, `Event Name`, `Status`, `QR Generated`, `User Agent`, `IP Address`. Headers are automatically created whether you're using a new sheet or an existing sheet without proper headers.

## Quick Start

**1. First-Time Setup**
When you visit the deployed site for the first time, you will be prompted to enter your **Google Apps Script URL**. Paste the URL you obtained from the [Google Sheets Integration Setup](#google-sheets-integration-setup) to enable automatic attendance tracking. This URL is stored securely in your browser's session storage and will be remembered for the duration of your session.

## Technical Details
<details>
<summary>Click to expand technical details</summary>

### Technical Stack
- **HTML5**: Semantic structure with environment meta tags.
- **CSS3**: Microsoft Fluent Design system with CSS custom properties for theming.
- **JavaScript (ES6+)**: Modern, modular JavaScript for application logic.
- **Node.js**: Used for the deployment script (`deploy.js`) to manage environments.
- **QRCode.js**: External library for client-side QR code generation (loaded via CDN).

### QR Code Data Format
The generated QR codes contain a simple, human-readable key-value pair format:
```
Name: [Student Name]
Email: [Student Email]
```

### Design Specifications
- **Font**: Segoe UI (Microsoft standard), with fallbacks.
- **Primary Color**: Microsoft Blue (`#0078D4`), configurable via `PRIMARY_COLOR`.
- **Background**: Light gray (`#f0f2f5`).
- **Container**: White with a subtle shadow (`box-shadow`).
- **QR Code Size**: 256x256 pixels.

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Accessibility
- Semantic HTML (`<main>`, `<form>`, `<label>`).
- High-contrast color scheme for readability.
- Full keyboard navigation support, including using the `Enter` key to submit the form.

</details>

## Troubleshooting

#### Google Sheets & Apps Script Issues
- **Attendance Not Being Recorded**:
  1.  Ensure your Apps Script is deployed with access set to **"Anyone"**.
  2.  Double-check that the `SHEET_ID` in your script is correct.
  3.  Verify that the `GOOGLE_APPS_SCRIPT_URL` on the website/web server is the correct **Web app URL**.
  4.  Check the **Executions** log in your Google Apps Script project for any errors.
- **CORS Errors in Browser Console**: This is expected behavior. The script uses `fetch` in `no-cors` mode, which allows the request to be sent but prevents the client from reading the response. The data should still be recorded in your sheet.

---

**Developed for Microsoft Tech Club (MTC)**  
*A professional event check-in solution*