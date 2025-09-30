import React, { useState,useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Replies from "../Components/Replies"; // you’ll build this
import Updates from "../Components/Updates"; // optional
import AddReply from "../Components/AddReply"; 
import AddUpdate from "../Components/AddUpdate";

export default function Post() {
  const { post_id } = useParams();
  const location = useLocation();
  const post = location.state?.post;
  const userId = post.user_id; // make sure you pass user object in Link state
  const [userRole, setUserRole] = useState("");
  const [activeTab, setActiveTab] = useState("replies"); // default
  useEffect(() => {
    if (!userId) return;

    const fetchUserRole = async () => {
      try {
        const res = await axios.post("http://localhost:5000/auth/type", { user_id: userId });
        setUserRole(res.data.data.role); // e.g., 'official' or 'citizen'
      } catch (err) {
        console.error("Error fetching user role:", err);
      }
    };

    fetchUserRole();
  }, [userId]);
  if (!post) return <p>Post not found.</p>;

  return (
    <div className="container mx-auto p-6">
      {/* Post details */}
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="mb-3">{post.description}</p>
      {post.photourl && (
        <img
          src={`http://localhost:5000${post.photourl}`}
          alt="Post"
          className="mb-4 max-h-96 rounded"
        />
      )}

      {/* Buttons */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setActiveTab("addReply")} className="bg-blue-500 text-white px-3 py-2 rounded">
          Add Reply
        </button>
        <button onClick={() => setActiveTab("replies")} className="bg-gray-500 text-white px-3 py-2 rounded">
          Show Replies
        </button>
        <button onClick={() => setActiveTab("updates")} className="bg-purple-500 text-white px-3 py-2 rounded">
          Show Updates
        </button>
        {userRole === "official" && (
          <button onClick={() => setActiveTab("addUpdate")} className="bg-green-600 text-white px-3 py-2 rounded">
            Add Update
          </button>
        )}
      </div>

      {/* Conditional Rendering */}
      <div>
        {activeTab === "replies" && <Replies post_id={post_id}  />}
        {activeTab === "addReply" && <AddReply post={post} />}
        {activeTab === "updates" && <Updates post_id={post_id} />}
        {activeTab === "addUpdate" && <AddUpdate post_id={post_id} />}
      </div>
    </div>
  );
}
