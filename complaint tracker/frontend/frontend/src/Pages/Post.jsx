import React, { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Replies from "../Components/Replies"; // you’ll build this
import Updates from "../Components/Updates"; // optional
import AddReply from "../Components/AddReply"; 
import AddUpdate from "../Components/AddUpdate";
import AssignOfficial from "../Components/AssignOffical"; // new component for assigning
import StatusChange from "../Components/StatusChange"; // new component for changing status
import axios from "axios";
import FilePreview from "../Components/FilePreview";

const API = "http://localhost:5000";
export default function Post() {
  const { post_id } = useParams();
  const location = useLocation();
  const [post, setPost] = useState(location.state?.post || null);
  const creator = location.state?.creator;
  const gname = location.state?.gname;
  const userRole = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");
  const [activeTab, setActiveTab] = useState("replies"); // default
  const [showAssign, setShowAssign] = useState(false);
  const [showStatusChange, setShowStatusChange] = useState(false);
  const navigate = useNavigate();
  if (!post) return <p>Post not found.</p>;
  // const isOfficialAssigned = post.Assigned_Official;
  const isOfficialView = userRole === "official" && String(post.assigned_official) === String(userId);

  const isModeratorView = userRole === "moderator" && String(creator) === String(userId);
  const handleRemovePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post and all its replies/updates?")) return;

    try {
      await axios.post(`${API}/posts/delete`, { post_id });
      alert("Post and all related data deleted successfully!");
      navigate("/group", { state: { group_id: post.group_id, creator: creator,gname: gname } });
    } catch (err) {
      console.error(err);
      alert("Failed to delete post!");
    }
  };
  const handleStatusUpdate = async (newStatus) => {
    try {
      const res = await axios.post(`${API}/posts/status`, {
        post_id,
        status: newStatus,
      });
      setPost({ ...post, status: newStatus }); // update local state
      alert("Status updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Status update failed!");
    }
  };
  const handleRemoveOfficial = async () => {
    try {
      await axios.post(`${API}/posts/removeOfficial`, {
        post_id,
      });
      alert("Official removed successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="container mx-auto p-6">
      {/* Post details */}
      <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
      <p className="mb-3">{post.description}</p>
      {post.photourl && (
        <div className="mb-4 max-h-96 rounded overflow-hidden">
          <FilePreview fileUrl={`${API}${post.photourl}`} />
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setActiveTab("addReply")}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Add Reply
        </button>
        <button
          onClick={() => setActiveTab("replies")}
          className="bg-gray-500 text-white px-3 py-2 rounded"
        >
          Show Replies
        </button>
        <button
          onClick={() => setActiveTab("updates")}
          className="bg-purple-500 text-white px-3 py-2 rounded"
        >
          Show Updates
        </button>

        {isOfficialView && (
          <button
            onClick={() => setActiveTab("addUpdate")}
            className="bg-green-600 text-white px-3 py-2 rounded"
          >
            Add Update
          </button>
        )}

        {isModeratorView && (
          <>
            <button
              onClick={() => setShowAssign(!showAssign)}
              className="bg-yellow-500 text-white px-3 py-2 rounded"
            >
              {showAssign ? "Close Assign Menu" : "Assign Official"}
            </button>
            <button
              onClick={handleRemoveOfficial}
              className="bg-red-600 text-white px-3 py-2 rounded"
            >
              Remove Official
            </button>
            <button
              onClick={() => setShowStatusChange(!showStatusChange)}
              className="bg-indigo-600 text-white px-3 py-2 rounded"
            >
              {showStatusChange ? "Close Status Menu" : "Change Status"}
            </button>
            <button
              onClick={handleRemovePost}
              className="bg-red-800 text-white px-3 py-2 rounded"
            >
              Delete Post
            </button>
          </>
        )}
      </div>

      {/* Conditional Rendering */}
      <div>
        {activeTab === "replies" && <Replies post_id={post_id} />}
        {activeTab === "addReply" && <AddReply post={post} />}
        {activeTab === "updates" && <Updates post_id={post_id} />}
        {activeTab === "addUpdate" && <AddUpdate post_id={post_id} />}
        {showAssign && isModeratorView && <AssignOfficial post_id={post_id} />}
        {showStatusChange && isModeratorView && <StatusChange status={post.status} post_id={post_id} onStatusUpdate={handleStatusUpdate}/>}
      </div>
    </div>
  );
}
