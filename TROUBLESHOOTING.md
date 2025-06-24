# Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Google Apps Script Error: "Cannot read properties of undefined (reading 'postData')"

**Error Message:**
```
Error in doPost: [TypeError: Cannot read properties of undefined (reading 'postData')]
```

**Cause:** This error occurs when the Google Apps Script receives a request but the event object (`e`) is undefined or doesn't contain the expected `postData` property.

#### **Solution Steps:**

### Step 1: Update Google Apps Script Code

Replace your Google Apps Script code with the updated version from `google-apps-script.js`. The new version includes:

- Better error handling for undefined objects
- Detailed logging for debugging
- Request validation
- Comprehensive error responses

### Step 2: Test the Google Apps Script

1. **Open Google Apps Script Editor**
2. **Run the system test function:**
   ```javascript
   // In the Apps Script editor, run this function
   runSystemTest()
   ```
3. **Check the execution log** for detailed results

### Step 3: Verify Configuration

#### **Check Sheet ID:**
```javascript
// In Apps Script, verify your SHEET_ID
console.log('Sheet ID:', SHEET_ID);
console.log('Is configured:', SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID_HERE');
```

#### **Test Sheet Access:**
```javascript
// Test if you can access the sheet
try {
  const sheet = SpreadsheetApp.openById(SHEET_ID);
  console.log('Sheet access successful:', sheet.getName());
} catch (error) {
  console.error('Sheet access failed:', error.message);
}
```

### Step 4: Test POST Request Handling

Run the debug function in Google Apps Script:
```javascript
// Test POST request handling
testPostRequest()
```

### Step 5: Check Deployment Settings

1. **Go to Deploy → Manage deployments**
2. **Verify settings:**
   - **Type**: Web app
   - **Execute as**: Me
   - **Who has access**: Anyone
3. **If settings are wrong, create a new deployment**

### Step 6: Frontend Configuration

#### **Verify Environment Variables:**
```javascript
// Check if Google Apps Script URL is configured
console.log('Google Apps Script URL:', window.SecureConfig.get('GOOGLE_APPS_SCRIPT_URL'));
console.log('Attendance tracking enabled:', window.SecureConfig.get('ENABLE_ATTENDANCE_TRACKING'));
```

#### **Test Frontend Request:**
```javascript
// Test the request from browser console
const testData = {
  name: 'Test User',
  email: 'test@example.com',
  event: 'Test Event',
  qrGenerated: true,
  timestamp: new Date().toISOString(),
  userAgent: navigator.userAgent
};

fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
  method: 'POST',
  mode: 'no-cors',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(testData)
}).then(() => {
  console.log('Request sent successfully');
}).catch(error => {
  console.error('Request failed:', error);
});
```

## 🔧 Debugging Steps

### 1. Enable Debug Mode

In your environment configuration:
```bash
ENABLE_DEBUG_MODE=true
ENABLE_CONSOLE_LOGGING=true
ENABLE_ATTENDANCE_LOGGING=true
LOG_LEVEL=debug
```

### 2. Check Browser Console

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Look for error messages**
4. **Check network requests** in Network tab

### 3. Check Google Apps Script Logs

1. **Open Google Apps Script Editor**
2. **Go to Executions** (left sidebar)
3. **Check recent executions** for errors
4. **Click on failed executions** to see details

### 4. Test Each Component

#### **Test QR Code Generation Only:**
```javascript
// Disable attendance tracking temporarily
window.SecureConfig.config.ENABLE_ATTENDANCE_TRACKING = false;
// Try generating QR code
```

#### **Test Google Sheets Access:**
```javascript
// In Google Apps Script, run:
testAttendanceRecording()
```

## 🔍 Common Error Patterns

### Error: "Script function not found"
**Solution:** Redeploy the Google Apps Script as a new version

### Error: "Permission denied"
**Solution:** 
1. Check deployment permissions
2. Re-authorize the script
3. Ensure "Anyone" has access

### Error: "Invalid JSON"
**Solution:** Check the data being sent from frontend

### Error: "Sheet not found"
**Solution:** 
1. Verify SHEET_ID is correct
2. Check sheet permissions
3. Ensure sheet exists

## 📋 Verification Checklist

### Google Apps Script Setup:
- [ ] SHEET_ID is configured (not placeholder)
- [ ] Sheet exists and is accessible
- [ ] Script is deployed as web app
- [ ] Deployment has "Anyone" access
- [ ] Latest code version is deployed

### Frontend Configuration:
- [ ] GOOGLE_APPS_SCRIPT_URL is configured
- [ ] ENABLE_ATTENDANCE_TRACKING is true
- [ ] FEATURE_GOOGLE_SHEETS is true
- [ ] No console errors on page load

### Network and Permissions:
- [ ] No CORS errors in browser
- [ ] Google Apps Script executions show in logs
- [ ] Sheet permissions allow script access

## 🛠️ Advanced Debugging

### Enable Detailed Logging

Add this to your Google Apps Script:
```javascript
function debugRequest(e) {
  console.log('=== DEBUG REQUEST ===');
  console.log('Event object:', e);
  console.log('Has postData:', !!(e && e.postData));
  console.log('PostData type:', e && e.postData ? e.postData.type : 'N/A');
  console.log('PostData contents:', e && e.postData ? e.postData.contents : 'N/A');
  console.log('=== END DEBUG ===');
}
```

### Test with curl

Test your Google Apps Script directly:
```bash
curl -X POST "YOUR_GOOGLE_APPS_SCRIPT_URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","event":"Test Event"}'
```

### Monitor Real-time

1. **Keep Google Apps Script logs open**
2. **Keep browser console open**
3. **Try generating QR code**
4. **Watch for errors in both places**

## 📞 Getting Help

If you're still experiencing issues:

1. **Check the execution logs** in Google Apps Script
2. **Copy the exact error message**
3. **Note the timestamp** of the error
4. **Include your configuration** (without sensitive data)
5. **Create an issue** with all the above information

## 🎯 Quick Fixes

### Most Common Solutions:

1. **Redeploy Google Apps Script** with new version
2. **Update SHEET_ID** in the script
3. **Check sheet permissions**
4. **Verify deployment settings**
5. **Clear browser cache** and try again

### Emergency Workaround:

If Google Sheets integration is causing issues, you can temporarily disable it:

```javascript
// In browser console:
window.SecureConfig.config.ENABLE_ATTENDANCE_TRACKING = false;
window.SecureConfig.config.FEATURE_GOOGLE_SHEETS = false;
```

This will allow QR code generation to work while you fix the Google Sheets integration.

---

**Remember:** Most Google Apps Script issues are related to configuration, permissions, or deployment settings. Double-check these first before diving into code debugging.
