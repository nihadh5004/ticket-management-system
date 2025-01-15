import { useEffect, useState } from 'react';
import { getUsersList } from '../../services/ticketService';
import UserCrudModal from './UserCrudModal';
import { IUser } from '../../models/ticket-model';
import { Link } from 'react-router-dom';

const Users = () => {
  const [userList, setUserList] = useState<IUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true); 

  const fetchUserList = async () => {
    setLoading(true); 
    try {
      const response = await getUsersList();
      setUserList(response.data); 
    } catch (error) {
      console.error('Failed to fetch user list:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleEditClick = (user: IUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = (status: boolean) => {
    setIsModalOpen(false);
    setSelectedUser(null);
    if (status) {
      fetchUserList();
    }
  };

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 h-screen rounded-lg">
      <div className='flex gap-3 mb-5'>
        <div className='flex items-center justify-center'>
          <Link to={`/dashboard`} className="border border-gray-400 p-2 rounded-md hover:bg-gray-100 transition">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 ">User List</h2>
      </div>

      {/* Table Loader */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
        </div>
      ): userList.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-gray-700 text-lg">
          No users currently
        </div>
      )  : (
        <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-600">
              <th className="px-6 py-3 border-b text-left font-semibold">Username</th>
              <th className="px-6 py-3 border-b text-left font-semibold">Email</th>
              <th className="px-6 py-3 border-b text-left font-semibold">Status</th>
              <th className="px-6 py-3 border-b text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 border-b text-gray-700">{user.username}</td>
                <td className="px-6 py-4 border-b text-gray-700">{user.email || ''}</td>
                <td className="px-6 py-4 border-b">
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      user.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {user.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 border-b">
                  <button onClick={() => handleEditClick(user)} className="flex items-center text-sm justify-center border-2 rounded-md p-1 text-gray-700 hover:text-blue-700 transition duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 20h9"></path>
                      <path d="M14.7 5.3l4.6 4.6-7.7 7.7h-3.3v-3.3l7.7-7.7z"></path>
                    </svg>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Edit */}
      {isModalOpen && <UserCrudModal onClose={handleCloseModal} userData={selectedUser} />}
    </div>
  );
};

export default Users;
