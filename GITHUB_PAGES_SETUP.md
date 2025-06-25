# GitHub Pages Deployment Guide

This guide will help you deploy the MTC Event Check-In QR Tool to GitHub Pages with full Google Sheets integration.

## Quick Setup (5 minutes)

### Step 1: Prepare for Deployment

Run the GitHub Pages deployment script:

```bash
node deploy-github-pages.js
```

This will:
- Configure the application for production
- Update configuration files
- Prepare HTML for GitHub Pages

### Step 2: Deploy to GitHub Pages

1. **Commit and push your changes:**
   ```bash
   git add .
   git commit -m "Prepare for GitHub Pages deployment"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. **Wait for deployment:**
   - GitHub will build and deploy your site
   - You'll get a URL like: `https://[username].github.io/[repository-name]`

### Step 3: Configure Google Sheets Integration

When you first visit your GitHub Pages site:

1. **You'll see a prompt asking for your Google Apps Script URL**
2. **Enter your Google Apps Script URL** (see setup below if you don't have one)
3. **The attendance tracking will be enabled automatically**

## Google Apps Script Setup

If you haven't set up Google Apps Script yet:

### 1. Create Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"
3. Replace the default code with the contents of `google-apps-script.js` from this repository
4. Update the `SHEET_ID` constant with your Google Sheet ID

### 2. Create Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new sheet
3. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)
4. Update the `SHEET_ID` in your Apps Script

### 3. Deploy Apps Script

1. In Google Apps Script, click "Deploy" → "New deployment"
2. Choose type: "Web app"
3. Set configuration:
   - **Description**: "MTC Attendance Tracker API"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
4. Click "Deploy"
5. **Copy the Web App URL** - you'll need this for your website

### 4. Test the Integration

1. Visit your GitHub Pages site
2. Enter the Google Apps Script URL when prompted
3. Fill out the form and generate a QR code
4. Check your Google Sheet - you should see the attendance record

## Troubleshooting

### Common Issues

**1. "Google Sheets not configured" message**
- Make sure you entered the correct Google Apps Script URL
- The URL should start with `https://script.google.com/macros/s/`

**2. Attendance not being recorded**
- Check that your Google Apps Script is deployed with "Anyone" access
- Verify the SHEET_ID in your Apps Script matches your Google Sheet
- Check the browser console for error messages

**3. CORS errors**
- This is normal for Google Apps Script - the app uses `no-cors` mode
- Attendance should still be recorded even if you see CORS errors in console

### Re-configuring Google Apps Script URL

If you need to change your Google Apps Script URL:

1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Clear sessionStorage
4. Refresh the page
5. You'll be prompted for the URL again

## Security Notes

- Your Google Apps Script URL is stored securely in browser session storage
- The URL is not visible in the repository or source code
- Each user needs to enter their own Google Apps Script URL
- The URL is cleared when the browser tab is closed

## Features Available on GitHub Pages

✅ **Available:**
- QR Code generation
- Google Sheets attendance tracking
- Event name customization
- Responsive design
- All core functionality

❌ **Not Available:**
- Server-side configuration
- Advanced logging
- Real-time statistics
- Bulk operations

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify your Google Apps Script setup
3. Test your Google Apps Script URL directly
4. Refer to `GOOGLE_SHEETS_SETUP.md` for detailed Google Sheets configuration

## Advanced Configuration

For advanced users who want to customize the deployment:

1. Edit `config.production.json` before running the deployment script
2. Modify the GitHub Pages configuration in `deploy-github-pages.js`
3. Update environment variables in the HTML meta tags

Your GitHub Pages site will automatically use the production configuration and prompt for the Google Apps Script URL as needed.
