import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

// Set SendGrid API key from environment variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send an email using SendGrid API
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} text - Email content (plain text)
 */
export async function sendEmail(to, subject, text) {
  try {
    await sgMail.send({
      from: process.env.SENDGRID_SENDER_EMAIL, // verified sender in SendGrid
      to,
      subject,
      text,
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Email failed:", error.message);
    if (error.response) {
      console.error(error.response.body);
    }
  }
}
