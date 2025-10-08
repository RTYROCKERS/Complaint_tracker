import pool from "../db.js";


export const changePostStatus = async(req,res)=>{
    const {post_id,status}=req.body;
    try{
        await pool.query("UPDATE posts SET status = $2 WHERE post_id = $1",[post_id,status]);
        res.json({ message: "Status successfully updated", status:status });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Status updation failed" });
  }
    
};