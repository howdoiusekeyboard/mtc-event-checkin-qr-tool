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
 * Main entry point - handles both GET and POST requests
 */
function doPost(e) {
  return handleRequest(e, 'POST');
}

function doGet(e) {
  return handleRequest(e, 'GET');
}

/**
 * Unified request handler
 */
function handleRequest(e, method) {
  try {
    // Set CORS headers for all responses
    const response = method === 'GET' ? handleGetRequest(e) : handlePostRequest(e);

    // Add CORS headers
    return response;

  } catch (error) {
    console.error(`Error in ${method} request:`, error);
    return createErrorResponse(error, method);
  }
}

/**
 * Handle POST requests from the frontend
 */
function handlePostRequest(e) {
  try {
    // Log the incoming request for debugging
    console.log('doPost called with:', e);

    // Check if e and e.postData exist
    if (!e) {
      throw new Error('No event object received');
    }

    if (!e.postData) {
      throw new Error('No postData in request');
    }

    if (!e.postData.contents) {
      throw new Error('No contents in postData');
    }

    // Parse the incoming JSON data
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      throw new Error('Invalid JSON in request: ' + parseError.message);
    }

    // Log parsed data
    console.log('Parsed data:', data);

    // Validate required fields
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format');
    }

    if (!data.name || !data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({
          success: false,
          error: 'Missing required fields: name and email',
          received: data
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

    // Return detailed error information for debugging
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: 'Server error: ' + error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        requestInfo: {
          hasEvent: !!e,
          hasPostData: !!(e && e.postData),
          hasContents: !!(e && e.postData && e.postData.contents),
          contentType: e && e.postData ? e.postData.type : 'unknown'
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing and status)
 */
function handleGetRequest(e) {
  console.log('GET request received:', e);

  // Test the sheet connection
  let sheetStatus = 'unknown';
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    sheetStatus = sheet ? 'connected' : 'not found';
  } catch (sheetError) {
    sheetStatus = 'error: ' + sheetError.message;
  }

  return ContentService
    .createTextOutput(JSON.stringify({
      message: 'MTC Attendance Tracker API is running',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      sheetId: SHEET_ID ? 'configured' : 'not configured',
      sheetStatus: sheetStatus,
      endpoints: {
        POST: 'Send attendance data',
        GET: 'API status (this endpoint)'
      }
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Create error response
 */
function createErrorResponse(error, method) {
  return ContentService
    .createTextOutput(JSON.stringify({
      success: false,
      error: error.message,
      method: method,
      timestamp: new Date().toISOString(),
      stack: error.stack
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
 * Debug function to test POST request handling
 */
function testPostRequest() {
  // Simulate a POST request
  const mockEvent = {
    postData: {
      contents: JSON.stringify({
        name: 'Debug Test Student',
        email: 'debug@test.com',
        event: 'Debug Test Event',
        qrGenerated: true,
        timestamp: new Date().toISOString(),
        userAgent: 'Debug Test Browser'
      }),
      type: 'application/json'
    }
  };

  console.log('Testing POST request with mock data:', mockEvent);
  const result = handlePostRequest(mockEvent);
  console.log('POST test result:', result);
  return result;
}

/**
 * Comprehensive system test
 */
function runSystemTest() {
  console.log('=== MTC Attendance Tracker System Test ===');

  const results = {
    timestamp: new Date().toISOString(),
    tests: {}
  };

  // Test 1: Sheet ID configuration
  try {
    results.tests.sheetIdConfig = {
      configured: SHEET_ID !== 'YOUR_GOOGLE_SHEET_ID_HERE',
      value: SHEET_ID
    };
  } catch (error) {
    results.tests.sheetIdConfig = { error: error.message };
  }

  // Test 2: Sheet access
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID);
    results.tests.sheetAccess = {
      success: true,
      sheetName: sheet.getName()
    };
  } catch (error) {
    results.tests.sheetAccess = {
      success: false,
      error: error.message
    };
  }

  // Test 3: Record attendance
  try {
    const testResult = testAttendanceRecording();
    results.tests.recordAttendance = {
      success: testResult.success,
      result: testResult
    };
  } catch (error) {
    results.tests.recordAttendance = {
      success: false,
      error: error.message
    };
  }

  // Test 4: POST request handling
  try {
    const postResult = testPostRequest();
    results.tests.postRequest = {
      success: true,
      result: postResult
    };
  } catch (error) {
    results.tests.postRequest = {
      success: false,
      error: error.message
    };
  }

  console.log('System test results:', results);
  return results;
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
