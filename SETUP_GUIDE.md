# MTC Event Check-In QR Tool with Google Sheets Integration

## 🎯 Complete Setup Guide

This guide will help you set up the MTC Event Check-In QR Tool with automatic attendance tracking to Google Sheets.

## 📋 Prerequisites

- Google account
- Web browser
- Basic understanding of copy/paste operations

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create" → "Blank spreadsheet"
3. Name it "MTC Event Attendance"
4. Copy the Sheet ID from the URL:
   ```
   https://docs.google.com/spreadsheets/d/1ABC123xyz456.../edit
   Sheet ID: 1ABC123xyz456...
   ```

### Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy the entire contents of `google-apps-script.js`
5. Paste it into the script editor
6. **IMPORTANT**: Update line 12 with your Sheet ID:
   ```javascript
   const SHEET_ID = 'your-actual-sheet-id-here';
   ```

### Step 3: Deploy the Web App

1. Click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Set configuration:
   - **Description**: "MTC Attendance Tracker"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. **Copy the Web App URL** (you'll need this!)
6. Click "Authorize access" and grant permissions

### Step 4: Configure the Frontend

1. Open `config.js` in your project
2. Replace the placeholder URL with your actual Web App URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec';
   ```

## ✅ You're Done!

The tool is now ready with Google Sheets integration!

## 🎮 How to Use

1. **Open the application** in your web browser
2. **Enter student information**:
   - Student Name (required)
   - Email Address (required)
   - Event Name (optional - defaults to "MTC Event")
3. **Click "Generate Check-In QR"**
4. **QR code appears** with the student's information
5. **Attendance is automatically recorded** in your Google Sheet

## 📊 Google Sheets Data Structure

Your sheet will automatically be populated with:

| Column | Data | Example |
|--------|------|---------|
| A | Timestamp | 2024-06-22 14:30:15 |
| B | Student Name | John Smith |
| C | Email Address | john@example.com |
| D | Event Name | MTC Workshop - React |
| E | Status | Present |
| F | QR Generated | Yes |
| G | User Agent | Browser info |
| H | IP Address | (if available) |

## 🔧 Configuration Options

Edit `config.js` to customize:

```javascript
// Event settings
const EVENT_CONFIG = {
    defaultEventName: 'MTC Event',           // Default event name
    enableAttendanceTracking: true,          // Enable/disable tracking
    requestTimeout: 10000,                   // Request timeout (ms)
    maxRetries: 3                           // Retry attempts
};

// UI settings
const UI_CONFIG = {
    showAttendanceMessages: true,            // Show status messages
    showAttendanceCounter: false,            // Show attendance counter
    autoClearForm: false                     // Clear form after submission
};
```

## 🎯 Features

### ✅ What's New:
- **Automatic attendance tracking** to Google Sheets
- **Real-time status messages** ("Recording attendance...", "Success!")
- **Optional event name field** for different events
- **Error handling** with user-friendly messages
- **Duplicate prevention** to avoid multiple submissions
- **Professional Microsoft design** maintained

### ✅ Original Features:
- QR code generation with student info
- Input validation
- Responsive design
- Microsoft Fluent Design styling
- Keyboard shortcuts (Enter key)

## 🧪 Testing

### Test the Google Apps Script:
1. In Google Apps Script, run the `testAttendanceRecording()` function
2. Check your Google Sheet for a test entry

### Test the Frontend:
1. Enter test data in the form
2. Generate a QR code
3. Look for status messages
4. Check your Google Sheet for the new entry

## 🔍 Troubleshooting

### Common Issues:

**"Google Sheets integration not configured"**
- Update `config.js` with your actual Google Apps Script URL

**No data appearing in Google Sheets**
- Verify the Sheet ID in your Google Apps Script
- Check that the web app is deployed with "Anyone" access
- Look at Google Apps Script execution logs

**Permission errors**
- Re-authorize the Google Apps Script
- Ensure the web app has proper permissions

**CORS errors in browser console**
- This is normal due to Google Apps Script's security
- Data should still be recorded successfully

### Debug Mode:
Enable detailed logging in `config.js`:
```javascript
const DEBUG_CONFIG = {
    enableLogging: true,
    logAttendanceRequests: true
};
```

## 📈 Advanced Usage

### Multiple Events:
Use the Event Name field to track different events:
- "MTC Workshop - React Basics"
- "MTC Networking Event"
- "MTC Guest Speaker Series"

### Data Analysis:
Export your Google Sheet data to:
- Create attendance reports
- Analyze event popularity
- Track student engagement

### Integration:
The Google Apps Script can be extended to:
- Send email confirmations
- Integrate with other systems
- Generate automatic reports

## 🔒 Security Notes

- Keep your Google Apps Script URL secure
- Monitor your Google Sheet for unusual activity
- Consider adding additional validation if needed
- The tool uses HTTPS for all communications

---

**🎉 Congratulations!** You now have a professional event check-in system with automatic attendance tracking!
