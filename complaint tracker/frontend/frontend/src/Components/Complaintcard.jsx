export default function PostCard({ post }) {
  // Color mapping for status
  const statusColors = {
    PENDING: "bg-yellow-200 text-yellow-800",
    APPROVED: "bg-green-200 text-green-800",
    OPEN: "bg-blue-200 text-blue-800",
    IN_PROGRESS: "bg-purple-200 text-purple-800",
    RESOLVED: "bg-teal-200 text-teal-800",
    CANCELLED: "bg-red-200 text-red-800",
  };

  // Color mapping for urgency
  const urgencyColors = {
    LOW: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-gradient-to-r from-pink-50 via-purple-50 to-indigo-50 p-5 rounded-xl shadow-lg hover:scale-105 transform transition-all duration-300 mb-6">
      <h3 className="font-extrabold text-xl text-indigo-700 mb-2">{post.title}</h3>
      <p className="text-gray-700 mb-4">{post.description}</p>

      <div className="flex flex-wrap justify-between items-center text-sm mb-3">
        <span className="font-semibold text-gray-600">Group: {post.group_name}</span>
        <span className={`px-3 py-1 rounded-full font-semibold ${statusColors[post.status] || "bg-gray-200 text-gray-700"}`}>
          {post.status}
        </span>
        {post.urgency && (
          <span className={`px-3 py-1 rounded-full font-semibold ${urgencyColors[post.urgency] || "bg-gray-200 text-gray-700"}`}>
            {post.urgency}
          </span>
        )}
      </div>

      <div className="flex justify-between items-center text-gray-500 text-sm">
        <span>Area: {post.area || "Unknown"}</span>
        <span>Date: {new Date(post.created_at).toLocaleDateString()}</span>
      </div>

      {post.photoUrl && (
        <div className="mt-4">
          <img
            src={post.photoUrl}
            alt={post.title}
            className="w-full h-48 object-cover rounded-lg shadow-md"
          />
        </div>
      )}
    </div>
  );
}
