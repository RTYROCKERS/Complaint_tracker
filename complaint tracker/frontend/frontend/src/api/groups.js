import axios from "axios";
const API = "http://localhost:5000"; 

export const getGroups = async (city = "", locality = "") => {
  const res = await axios.get(`${API}/getGroups`, {
    params: { city, locality },
  });
  return res.data;
};
export const getGroupPosts = async (group_id) => {
  try {
    const res = await axios.post("${API}/getPosts", {
      group_id,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching group posts:", err.message);
    return [];
  }
};