import { sendEmail } from "../services/emailService.js";
export async function sendEmailHandler(req, res) {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await sendEmail(to, subject, text);
    res.status(200).json({ message: `Email sent to ${to}` });
  } catch (error) {
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
}