import React from "react";

export default function TicketList({ tickets, loading, error }) {
  if (loading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!tickets.length) return <p>No tickets raised yet.</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Your Tickets</h2>
      <ul className="space-y-4">
        {tickets.map((t) => (
          <li key={t._id} className="flex justify-between items-center">
            <div>
              <p>
                <strong>Query:</strong> {t.query}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>At:</strong> {new Date(t.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-600 text-sm">
                <strong>Status:</strong> {t.status}
              </p>
            </div>
            {t.attachmentUrl && (
              <a
                href={`${import.meta.env.VITE_CS_SERVER_BASE_URL}${
                  t.attachmentUrl
                }`}
                download
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Download
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
