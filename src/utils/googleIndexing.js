const { google } = require('googleapis');

// Pull credentials from the .env file
const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;

// CRITICAL FIX: .env files often mess up the newline characters in private keys.
// This replace() function ensures the \n characters are read correctly by Google.
const privateKey = process.env.GOOGLE_PRIVATE_KEY 
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') 
  : '';

// Initialize the Google Auth Client using the credentials directly
const authClient = new google.auth.GoogleAuth({
  credentials: {
    client_email: clientEmail,
    private_key: privateKey,
  },
  scopes: ['https://www.googleapis.com/auth/indexing'],
});

const notifyGoogle = async (url, action = 'URL_UPDATED') => {
  // Safety check: Don't attempt to ping Google if the .env variables are missing
  if (!clientEmail || !privateKey) {
    console.warn("⚠️ Google Indexing skipped: Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY in .env");
    return false;
  }

  try {
    // 1. Get the authorized client
    const client = await authClient.getClient();
    const indexing = google.indexing({ version: 'v3', auth: client });

    // 2. Send the URL to Google
    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: action, // 'URL_UPDATED' for new/edited, 'URL_DELETED' for removed
      },
    });

    console.log(`✅ Google Indexing API Pinged: ${url}`);
    console.log(`   Status: ${response.data.urlNotificationMetadata?.latestUpdate?.type}`);
    return true;

  } catch (error) {
    console.error(`❌ Google Indexing Failed for ${url}:`, error.message);
    return false;
  }
};

module.exports = { notifyGoogle };