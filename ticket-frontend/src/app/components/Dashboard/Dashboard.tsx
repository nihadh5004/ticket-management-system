import { useEffect, useState } from 'react';
import TicketCrudModal from '../Tickets/TicketCrudModal';
import { getTickets } from '../../services/ticketService';
import { ITicket } from '../../models/ticket-model';
import { Link, useNavigate } from 'react-router-dom';
import { formatLabel } from '../../utils/formatHelper';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [searchAssignedTo, setSearchAssignedTo] = useState('');
  const [searchDescription, setSearchDescription] = useState('');
  const [tickets, setTickets] = useState<ITicket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false); 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const closeModal = (status: boolean) => {
    setIsModalOpen(false);
    if (status) {
      fetchTickets();
    }
  };

  const fetchTickets = async () => {
    setLoading(true); 
    try {
      const params: any = {};

      if (searchTitle) params.title = searchTitle;
      if (filterStatus) params.status = filterStatus;
      if (searchDescription) params.description = searchDescription;
      if (filterPriority) params.priority = filterPriority;
      if (searchAssignedTo) params.assignedTo = searchAssignedTo;

      const response = await getTickets(params);
      setTickets(response.data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    const userType = localStorage.getItem('userType');
    setIsAdmin(userType === 'admin');

    fetchTickets();
  }, [searchTitle, searchDescription, filterStatus, filterPriority, searchAssignedTo]);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition"
            onClick={openModal}
          >
            Add Ticket
          </button>
          {isAdmin && (
            <Link
              to="/users"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded shadow hover:bg-blue-700 transition"
            >
              User List
            </Link>
          )}
          <button
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded shadow hover:bg-red-700 transition"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white rounded shadow overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
          </div>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">#</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Title</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Description</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Status</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Priority</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Assignee</th>
                <th className="px-4 py-2 text-left text-gray-600 font-semibold">Actions</th>
              </tr>
              <tr>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search title..."
                    className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                  />
                </td>
                <td className="px-4 py-2">
                  <input
                    type="text"
                    placeholder="Search description..."
                    className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchDescription}
                    onChange={(e) => setSearchDescription(e.target.value)}
                  />
                </td>
                <td className="px-4 py-2">
                  <select
                    className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <select
                    className="w-full px-3 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2"></td>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 ? (
                tickets.map((ticket, index) => (
                  <tr key={ticket.id} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                    <td className="px-4 py-2 text-gray-700">{index + 1}</td>
                    <td className="px-4 py-2 text-gray-700">{ticket.title}</td>
                    <td className="px-4 py-2 text-gray-700">{ticket.description || 'No Description'}</td>
                    <td className="px-4 py-2 text-gray-700">
                      <div
                        className={`w-20 py-1 rounded text-xs font-bold text-center ${
                          ticket.status === 'resolved'
                            ? 'bg-green-100 text-green-700'
                            : ticket.status === 'in_progress'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <span>{formatLabel(ticket.status)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-700">
                      <div
                        className={`w-20 py-1 rounded text-xs text-center font-bold ${
                          ticket.priority === 'low'
                            ? 'bg-green-100 text-green-700'
                            : ticket.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        <span>{formatLabel(ticket.priority)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 text-gray-700">{ticket.user.username}</td>
                    <td className="px-4 py-2 text-gray-700 flex items-center justify-center">
                      <Link
                        to={`/ticket-detail/${ticket.id}`}
                        className="text-blue-600 hover:bg-blue-500 rounded-full hover:text-white transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L11.586 10 7.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-gray-600">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg w-96 p-6">
            <TicketCrudModal onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
