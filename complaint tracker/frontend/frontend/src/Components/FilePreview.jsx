import React from "react";

export default function FilePreview({ fileUrl }) {
  if (!fileUrl) return null;

  const ext = fileUrl.split(".").pop().toLowerCase();

  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) {
    return (
      <img
        src={fileUrl}
        alt="Uploaded file"
        className="rounded-md border mt-2 w-full h-48 object-cover"
      />
    );
  }

  if (["mp4", "mov", "webm"].includes(ext)) {
    return (
      <video
        controls
        className="rounded-md border mt-2 w-full h-48 object-cover"
      >
        <source src={fileUrl} type={`video/${ext}`} />
        Your browser does not support video playback.
      </video>
    );
  }

  if (["pdf"].includes(ext)) {
    return (
      <iframe
        src={fileUrl}
        title="PDF Preview"
        className="w-full h-64 border rounded-md mt-2"
      />
    );
  }

  // Fallback for unknown file types
  return (
    <a
      href={fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline mt-2 block"
    >
      📄 View / Download File
    </a>
  );
}
