import axios from "axios";

const API =`${process.env.REACT_APP_BACKEND}`;

// role
export const getType = async(userId)=>{
    try {
    const res = await axios.post(`${API}/auth/type`, { user_id: userId });
    return res.data.data.role; // e.g., 'official' or 'citizen'
    } catch (err) {
    console.error("Error fetching user role:", err);
    }
   
}
