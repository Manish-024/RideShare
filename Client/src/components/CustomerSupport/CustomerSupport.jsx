import React, { useState, useEffect } from "react";
import axios from "axios";
import RaiseTicket from "./RaiseTicket";
import TicketList from "./TicketList";

export default function CustomerSupport() {
  const userData = JSON.parse(localStorage.getItem("profile"));
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_CS_SERVER_BASE_URL}/tickets`,
        { params: { userId: userData.userId } }
      );
      setTickets(res.data);
      setError(null);
    } catch {
      setError("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [userData.userId]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Support Center</h1>
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <RaiseTicket onTicketRaised={fetchTickets} />
        <TicketList tickets={tickets} loading={loading} error={error} />
      </div>
    </div>
  );
}
