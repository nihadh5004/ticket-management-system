import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ITicketPayload, ITicket } from '../../models/ticket-model';
import { createTicket, updateTicket, getUsersList } from '../../services/ticketService';
import toast from 'react-hot-toast';

interface TicketCrudModalProps {
  onClose: (status: boolean) => void;
  ticket?: ITicket; 
}

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().notRequired(),
  priority: yup.string().oneOf(['low', 'medium', 'high'], 'Invalid priority').required('Priority is required'),
}).required();

const TicketCrudModal: React.FC<TicketCrudModalProps> = ({ onClose, ticket }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ITicketPayload>({resolver: yupResolver(schema)});
  const [isEditing, setIsEditing] = useState(false);
  const [userList, setUserList] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [status, setStatus] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>(''); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Get the userType from localStorage and check if the user is an admin
    const userType = localStorage.getItem('userType');
    setIsAdmin(userType === 'admin');

    if (ticket) {
      // If in edit mode, reset the form with the existing ticket data
      const ticketData: ITicketPayload = {
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority,
            user: ticket.user ? ticket.user.id : null,
        };
      setIsEditing(true);
      reset(ticketData); 
      setStatus(ticket.status); 
      setSelectedUser(ticket.user ? ticket.user.id : '');
    } else {
      setIsEditing(false); 
      reset(); 
    }

    if (userType === 'admin') {
      fetchUserList();
    }
  }, [ticket, reset]);

  const fetchUserList = async () => {
    try {
      const response = await getUsersList();
      setUserList(response.data); 
    } catch (error) {
      console.error('Failed to fetch user list:', error);
    }
  };

  const onSubmit = async (data: ITicketPayload) => {
    const payload = {
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: status ? status : 'open',
      user: isAdmin && data.user ? data.user : undefined, 
    };
    // Check if admin assined user else show error
    if(isAdmin && !data.user){
      toast.error('Please assign user')
      return
    }
    setLoading(true);
    try {
      if (isEditing && ticket) {
        // If editing, call the update API
        const response = await updateTicket(ticket.id, payload);
        if (response.status_code === 200) {
          toast.success(response.message);
          onClose(true);
        }
      } else {
        // If creating, call the create API
        const response = await createTicket(payload);
        if (response) {
          toast.success(response.message);
          onClose(true);
          setLoading(false);

        }
      }
      reset(); 
    } catch (error) {
      console.error('An error occurred. Please try again.');
      setLoading(false);

    }
  };

  const handleCancel = () => {
    onClose(false); 
  };

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Ticket' : 'Add Ticket'}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Title Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ticket title"
            {...register('title')}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        {/* Description Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter ticket description"
            {...register('description')}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>

        {/* Priority Field */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Priority</label>
          <select
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register('priority')}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <p className="text-red-500 text-xs mt-1">{errors.priority.message}</p>}
        </div>

        {/* User Dropdown (only for admin) */}
        {isAdmin && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Assigned User</label>
            <select
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              {...register('user')}
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)} 
            >
              <option value="">Select a user</option>
              {userList.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </select>
            {errors.user && <p className="text-red-500 text-xs mt-1">{errors.user.message}</p>}
          </div>
        )}

        {/*  (only for editing mode) */}
        {isEditing && (
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Status</label>
            <select
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end">
          <button
            type="button"
            className="px-4 py-2 bg-gray-400 text-white rounded mr-2 hover:bg-gray-500"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center justify-center"
            disabled={loading} 
          >
            {loading ? (
              <div className="loader animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
            ) : null}
            <span>{isEditing ? 'Update' : 'Add Ticket'}</span>
            
          </button>

        </div>
      </form>
    </div>
  );
};

export default TicketCrudModal;
