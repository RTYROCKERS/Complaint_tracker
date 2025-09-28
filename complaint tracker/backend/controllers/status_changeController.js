import pool from "../db.js";


export const changePostStatus = async(req,res)=>{
    const {group_id,post_id,user_id,old_status,new_status}=req.body;
    try{
        const result = await pool.query("SELECT * FROM moderators WHERE user_id = $1", [user_id]);
        if (result.rows.length === 0) return res.status(400).json({ error: "User not found/or is not a moderator" });
        const mod=result.rows[0];
        const validStatuses = ['PENDING','APPROVED','OPEN','IN_PROGRESS','RESOLVED','CANCELLED'];
        if (!validStatuses.includes(old_status) || !validStatuses.includes(new_status)) {
            return res.status(400).json({
                error: "The status values are not in the valid range ('PENDING','APPROVED','OPEN','IN_PROGRESS','RESOLVED','CANCELLED')"
            });
        }
        await pool.query("UPDATE post_replies SET status = $2 WHERE post_id = $1",[post_id,new_status]);
        res.json({ message: "Status successfully updated", new_status:new_status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Status updation failed" });
  }
    
};