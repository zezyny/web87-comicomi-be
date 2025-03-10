import 'dotenv/config'; 
import  {sendEmail}  from './utils/email.utils.js'; 

async function main() {
  try {
    const recipientEmail = 'tlamngu@outlook.com'; // Replace with your test email address!

    if (recipientEmail === 'recipient@example.com') {
      console.warn("Warning: You are using the placeholder email 'recipient@example.com'. Please replace it with your actual test recipient email address in testmail.js.");
    }

    const emailResult = await sendEmail({ // Call sendEmail directly (no emailUtils object anymore)
      toEmail: recipientEmail,
      subject: 'Test Email from NodeJS (API Key/Token Auth) - ESM',
      body: `
        <h1>This is a Test Email!</h1>
        <p>Congratulations, you've successfully sent a test email from your NodeJS server using token-based authentication (or API key) via email.utils.js (ESM version).</p>
        <p>If you are seeing this, it means your email sending configuration is likely working correctly.</p>
        <hr>
        <p>This email was sent using NodeJS and Nodemailer with ${process.env.SENDGRID_API_KEY ? 'SendGrid' : (process.env.MAILGUN_API_KEY ? 'Mailgun' : 'your configured email provider')} (if you are using API keys as configured in email.utils.js).</p>
      `,
    });

    if (emailResult.success) {
      console.log('Test email sent successfully! (ESM)');
      console.log('Message ID:', emailResult.messageId);
    } else {
      console.error('Test email sending failed. (ESM)');
      // emailResult might contain more details about the error if you enhanced email.utils.js to return error information
    }

  } catch (error) {
    console.error('Error occurred while trying to send test email (ESM):', error);
  }
}

main();
