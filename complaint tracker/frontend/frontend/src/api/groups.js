import axios from "axios";
const API = `${process.env.REACT_APP_BACKEND}`; 

export const getGroups = async (city = "", locality = "") => {
  const res = await axios.get(`${API}/getGroups`, {
    params: { city, locality },
  });
  return res.data;
};
export const getGroupPosts = async (group_id) => {
  try {
    const res = await axios.post(`${API}/getPosts`, {
      group_id,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching group posts:", err.message);
    return [];
  }
};
export const createComplaint = async (formData) => {
  try {
    const res = await axios.post(`${API}/complaints`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating complaint:", err.message);
    throw err;
  }
}
export const addReply = async (formData) => {
  try {
    const res = await axios.post(`${API}/replies`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err) {
    console.error("Error creating complaint:", err.message);
    throw err;
  }
};
export const getPostReplies = async (post_id) => {
  try {
    const res = await axios.post(`${API}/getPostReplies`, {
      post_id,
    });
    return res.data;
  } catch (err) {
    console.error("Error fetching group posts:", err.message);
    return [];
  }
};