const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ senderEmail, receiverEmail, subject, htmlContent }) => {
  try {
    const response = await resend.emails.send({
      from: senderEmail,
      to: receiverEmail,
      subject,
      html: htmlContent,
    });

    console.log(`Email sent successfully to ${receiverEmail}:`, response);
    return response;
  } catch (err) {
    console.error(`Error sending email to ${receiverEmail}:`, err?.message || err);
    throw new Error(`Failed to send email: ${err.message}`);
  }
};

module.exports = { sendEmail };
