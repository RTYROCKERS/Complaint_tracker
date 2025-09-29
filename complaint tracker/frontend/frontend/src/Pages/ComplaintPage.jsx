import { useState, useEffect } from "react";
import axios from "axios";
import FilterPanel from "../Components/FilterPanel.jsx";
import PostCard from "../Components/Complaintcard.jsx";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (filters = {}) => {
    setLoading(true);
    const params = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key]) params[key] = filters[key];
    });

    try {
      const { data } = await axios.get("http://localhost:5000/posts", { params });
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(); // initial fetch
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-yellow-50 p-6">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
        Posts Dashboard
      </h1>

      {/* Filter Panel */}
      <div className="mb-6">
        <FilterPanel onFilter={fetchPosts} />
      </div>

      {/* Loading State */}
      {loading && (
        <p className="text-center text-gray-600 text-lg animate-pulse">
          Loading posts...
        </p>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && (
        <p className="text-center text-gray-500 text-lg">
          No posts found. Try adjusting your filters.
        </p>
      )}

      {/* Posts Grid */}
      {!loading && posts.length > 0 && (
        <div className="mt-4 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((p) => (
            <PostCard key={p.post_id} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
