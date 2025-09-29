import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getGroupPosts } from "../api/groups.js";

export default function GroupPage() {
  const location = useLocation();
  const { group_id } = location.state || {}; // passed from navigate
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!group_id) return;
    const fetchPosts = async () => {
      const data = await getGroupPosts(group_id);
      setPosts(data);
    };
    fetchPosts();
  }, [group_id]);

  if (!group_id) {
    return <p className="text-red-500">No group selected.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Posts in Group #{group_id}</h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts available for this group.</p>
      ) : (
        posts.map((p) => (
          <div key={p.post_id} className="border rounded-lg p-4 mb-3 bg-white shadow">
            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="text-gray-700">{p.description}</p>
            <div className="text-sm text-gray-500 mt-2">
              Status: <span className="font-medium">{p.status}</span> • 
              Type: {p.type} • Severity: {p.severity} • 
              {new Date(p.created_at).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
