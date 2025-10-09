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
import "../css/Group.css";
const API = process.env.REACT_APP_BACKEND;
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
      <div className="post-card relative">
        <div className={`status-ribbon ${post.status.toLowerCase()}`}>
          {post.status.replace("_", " ")}
        </div>

        {/* Post Details */}
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="mb-3">{post.description}</p>
        {post.photourl && (
          <div className="mb-4 max-h-96 rounded overflow-hidden">
            <FilePreview fileUrl={`${post.photourl}`} />
          </div>
        )}

        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button onClick={() => setActiveTab("addReply")} className="btn-add-post">
            Add Reply
          </button>
          <button onClick={() => setActiveTab("replies")} className="btn-add-post">
            Show Replies
          </button>
          <button onClick={() => setActiveTab("updates")} className="btn-add-post">
            Show Updates
          </button>

          {isOfficialView && (
            <button onClick={() => setActiveTab("addUpdate")} className="btn-add-post">
              Add Update
            </button>
          )}

          {isModeratorView && (
            <>
              <button onClick={() => setShowAssign(!showAssign)} className="btn-add-post">
                {showAssign ? "Close Assign Menu" : "Assign Official"}
              </button>
              <button onClick={handleRemoveOfficial} className="btn-add-post">
                Remove Official
              </button>
              <button onClick={() => setShowStatusChange(!showStatusChange)} className="btn-add-post">
                {showStatusChange ? "Close Status Menu" : "Show / Change Status"}
              </button>
              <button onClick={handleRemovePost} className="btn-add-post">
                Delete Post
              </button>
            </>
          )}
        </div>

        {/* Conditional Rendered Content */}
        <div className="content-wrapper">
          {/* Main Tab Content */}
          {activeTab === "addReply" && <AddReply post={post} />}
          {activeTab === "addUpdate" && <AddUpdate post_id={post_id} />}
          {activeTab === "replies" && <Replies post_id={post_id} />}
          {activeTab === "updates" && <Updates post_id={post_id} />}

          {/* Overlay Modals */}
          {showAssign && isModeratorView && (
            <div className="create-group-modal-overlay">
              <div className="create-group-modal text-black">
                <h2>Assign Official</h2>
                <AssignOfficial
                  post_id={post_id}
                  onClose={() => setShowAssign(false)}
                />
                <div className="modal-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowAssign(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {showStatusChange && isModeratorView && (
            <div className="create-group-modal-overlay">
              <div className="create-group-modal text-black">
                <h2>Show / Change Status</h2>
                <StatusChange
                  status={post.status}
                  post_id={post_id}
                  onStatusUpdate={(newStatus) => {
                    handleStatusUpdate(newStatus);
                    setShowStatusChange(false);
                  }}
                />
                <div className="modal-buttons">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowStatusChange(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
