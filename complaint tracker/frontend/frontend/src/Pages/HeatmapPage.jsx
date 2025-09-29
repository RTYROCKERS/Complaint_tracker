import React, { useEffect, useState } from "react";
import HeatMap from "../Components/Heatmap.jsx";
import { getHeatmapPosts } from "../api/heatmap.js"; // correct frontend import

export default function HeatmapPage() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getHeatmapPosts();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Complaints Heatmap</h1>
      <HeatMap posts={posts} />
    </div>
  );
}
