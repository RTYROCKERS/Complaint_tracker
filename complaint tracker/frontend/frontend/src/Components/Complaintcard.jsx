export default function ComplaintCard({ complaint }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition mb-4">
      <h3 className="font-bold text-lg">{complaint.title}</h3>
      <p className="text-gray-600">{complaint.description}</p>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        <span>Type: {complaint.type}</span>
        <span>Area: {complaint.area}</span>
        <span>Urgency: {complaint.urgency}</span>
        <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
