# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for automatic attendance tracking with the MTC Event Check-In QR Tool.

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create" to make a new spreadsheet
3. Name it "MTC Event Attendance" or similar
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/1ABC123xyz.../edit`
   - Sheet ID: `1ABC123xyz...`

## Step 2: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click "New Project"
3. Delete the default code
4. Copy and paste the code from `google-apps-script.js`
5. Update the `SHEET_ID` constant with your actual Sheet ID:
   ```javascript
   const SHEET_ID = 'your-actual-sheet-id-here';
   ```

## Step 3: Deploy the Web App

1. In Google Apps Script, click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Set the following:
   - **Description**: "MTC Attendance Tracker API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. Copy the Web App URL (you'll need this for the frontend)
6. Click "Authorize access" and grant permissions

## Step 4: Update Frontend Configuration

1. Open `config.js` (will be created in next step)
2. Add your Web App URL:
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'your-web-app-url-here';
   ```

## Expected Google Sheets Structure

The script will automatically create a sheet with these columns:

| Column | Header | Description |
|--------|--------|-------------|
| A | Timestamp | When the check-in occurred |
| B | Student Name | Name entered in the form |
| C | Email Address | Email entered in the form |
| D | Event Name | Event identifier (default: "MTC Event") |
| E | Status | Attendance status (default: "Present") |
| F | QR Generated | Whether QR code was successfully created |
| G | User Agent | Browser/device information |
| H | IP Address | User's IP address (if available) |

## Sample Data

After setup, your sheet will look like this:

```
Timestamp           | Student Name | Email Address      | Event Name | Status  | QR Generated
2024-06-22 14:30:15 | John Smith   | john@example.com   | MTC Event  | Present | Yes
2024-06-22 14:31:22 | Jane Doe     | jane@example.com   | MTC Event  | Present | Yes
```

## Testing the Integration

1. Use the test function in Google Apps Script:
   ```javascript
   testAttendanceRecording()
   ```
2. Check your Google Sheet for the test entry
3. Test from the frontend by generating a QR code

## Troubleshooting

### Common Issues:

1. **"Permission denied" error**
   - Make sure the web app is deployed with "Anyone" access
   - Re-authorize the script permissions

2. **"Sheet not found" error**
   - Verify the SHEET_ID is correct
   - Make sure the Google Sheet exists and is accessible

3. **CORS errors**
   - This is normal for cross-origin requests
   - The data should still be recorded in the sheet

### Checking Logs:

1. In Google Apps Script, go to "Executions" to see logs
2. Look for any error messages or successful executions

## Security Considerations

- The web app URL should be kept secure
- Consider adding additional validation in the Apps Script
- Monitor the sheet for any unusual activity
- You can restrict access by changing deployment settings

## Advanced Features

### Adding Event Names:
Modify the frontend to include an event name field, or set it programmatically:

```javascript
const attendanceData = {
    name: studentName,
    email: studentEmail,
    event: 'MTC Workshop - React Basics', // Custom event name
    qrGenerated: true
};
```

### Duplicate Prevention:
The current setup allows multiple check-ins. To prevent duplicates, you can modify the Apps Script to check for existing entries.

### Data Export:
Google Sheets allows easy export to CSV, Excel, or PDF for reporting purposes.

---

**Next Steps**: After completing this setup, proceed to update the frontend JavaScript to send data to your Google Apps Script web app.
