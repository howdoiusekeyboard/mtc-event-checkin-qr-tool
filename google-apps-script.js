/**
 * MTC Event Check-In Google Apps Script
 * This script handles attendance tracking by writing data to Google Sheets
 * 
 * Setup Instructions:
 * 1. Go to script.google.com
 * 2. Create a new project
 * 3. Replace the default code with this script
 * 4. Create a Google Sheet and copy its ID
 * 5. Update the SHEET_ID constant below
 * 6. Deploy as a web app with execute permissions for "Anyone"
 * 7. Copy the web app URL and use it in the frontend JavaScript
 */

// Configuration - UPDATE THIS WITH YOUR GOOGLE SHEET ID
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Replace with your actual Sheet ID
const SHEET_NAME = 'Attendance'; // Name of the sheet tab

/**
 * Main function to handle POST requests from the frontend
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.name || !data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields: name and email'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Record attendance
    const result = recordAttendance(data);
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Server error: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'MTC Attendance Tracker API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Record attendance data to Google Sheets
 */
function recordAttendance(data) {
  try {
    // Open the Google Sheet
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it with headers
    if (!sheet) {
      const newSheet = SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);
      setupSheetHeaders(newSheet);
      return recordAttendance(data); // Retry after creating sheet
    }
    
    // Prepare the row data
    const timestamp = new Date();
    const rowData = [
      timestamp, // A: Timestamp
      data.name, // B: Student Name
      data.email, // C: Email Address
      data.event || 'MTC Event', // D: Event Name
      'Present', // E: Status
      data.qrGenerated ? 'Yes' : 'No', // F: QR Generated
      data.userAgent || '', // G: User Agent (for device tracking)
      data.ipAddress || '' // H: IP Address (if available)
    ];
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    // Get the row number that was just added
    const lastRow = sheet.getLastRow();
    
    // Format the timestamp cell
    const timestampRange = sheet.getRange(lastRow, 1);
    timestampRange.setNumberFormat('yyyy-mm-dd hh:mm:ss');
    
    // Auto-resize columns if this is a new sheet
    if (lastRow <= 2) {
      sheet.autoResizeColumns(1, 8);
    }
    
    return {
      success: true,
      message: 'Attendance recorded successfully',
      timestamp: timestamp.toISOString(),
      rowNumber: lastRow,
      data: {
        name: data.name,
        email: data.email,
        event: data.event || 'MTC Event'
      }
    };
    
  } catch (error) {
    console.error('Error recording attendance:', error);
    return {
      success: false,
      error: 'Failed to record attendance: ' + error.message
    };
  }
}

/**
 * Set up the sheet with proper headers
 */
function setupSheetHeaders(sheet) {
  const headers = [
    'Timestamp',
    'Student Name',
    'Email Address',
    'Event Name',
    'Status',
    'QR Generated',
    'User Agent',
    'IP Address'
  ];
  
  // Add headers to the first row
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format the header row
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#0078D4');
  headerRange.setFontColor('#FFFFFF');
  
  // Set column widths
  sheet.setColumnWidth(1, 150); // Timestamp
  sheet.setColumnWidth(2, 200); // Student Name
  sheet.setColumnWidth(3, 250); // Email Address
  sheet.setColumnWidth(4, 150); // Event Name
  sheet.setColumnWidth(5, 100); // Status
  sheet.setColumnWidth(6, 120); // QR Generated
  sheet.setColumnWidth(7, 200); // User Agent
  sheet.setColumnWidth(8, 120); // IP Address
  
  // Freeze the header row
  sheet.setFrozenRows(1);
}

/**
 * Test function to verify the setup
 */
function testAttendanceRecording() {
  const testData = {
    name: 'Test Student',
    email: 'test@example.com',
    event: 'Test Event',
    qrGenerated: true,
    userAgent: 'Test Browser',
    ipAddress: '127.0.0.1'
  };
  
  const result = recordAttendance(testData);
  console.log('Test result:', result);
  return result;
}

/**
 * Get attendance statistics
 */
function getAttendanceStats() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return { error: 'Sheet not found' };
    }
    
    const lastRow = sheet.getLastRow();
    const totalAttendees = lastRow > 1 ? lastRow - 1 : 0; // Subtract header row
    
    return {
      success: true,
      totalAttendees: totalAttendees,
      lastUpdated: new Date().toISOString()
    };
    
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
