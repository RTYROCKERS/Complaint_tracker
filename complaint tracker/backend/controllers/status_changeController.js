import pool from "../db.js";
import { sendEmail } from "../services/emailService.js";

export const changePostStatus = async(req,res)=>{
    const {post_id,status}=req.body;
    try{
        await pool.query("UPDATE posts SET status = $2 WHERE post_id = $1",[post_id,status]);
        // 2️⃣ Fetch user email
        const { rows } = await pool.query(
        `SELECT u.email 
        FROM posts p 
        JOIN users u ON u.u_id = p.user_id 
        WHERE p.post_id = $1`,
        [post_id]
        );

        const user_email = rows[0]?.email;
        // 3️⃣ Send email directly
        if (user_email) {
        const subject = `📌 Your post status has changed`;
        const text = `Hello,

        The status of your post (ID: ${post_id}) has been updated to "${status}".

        Please check the portal for details.

        Regards,
        Complaint Tracker Team`;

        await sendEmail(user_email, subject, text);
        console.log(`✅ Email sent to ${user_email} for post ID ${post_id}`);
        }

        res.json({ message: "Status successfully updated", status:status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Status updation failed" });
  }
    
};