import nodemailer from 'nodemailer'; 
import mailgunTransport from 'nodemailer-mailgun-transport'; 

const sendEmail = async ({ toEmail, subject, body }) => {
  try {
    const transporter = nodemailer.createTransport(mailgunTransport({ // Use mailgunTransport
      auth: {
        api_key: process.env.MAILGUN_API_KEY, // Use Mailgun API Key from environment variable
        domain: process.env.MAILGUN_DOMAIN,    // Use Mailgun Domain from environment variable
      },
    }));

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'no-reply@comicomi.zeaky.dev', // Use EMAIL_FROM env var if set, otherwise default
      to: toEmail,
      subject: subject,
      html: body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully (Mailgun - ESM):', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('Error sending email (Mailgun - ESM):', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export { sendEmail };