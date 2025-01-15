import  { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteTicket, getTicketById } from '../../services/ticketService'; 
import { ITicket } from '../../models/ticket-model'; 
import TicketCrudModal from './TicketCrudModal';
import toast from 'react-hot-toast';
import { formatLabel } from '../../utils/formatHelper';

const TicketDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const [ticket, setTicket] = useState<ITicket | null>(null); 
  const [modalStatus, setModalStatus] = useState(false); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | undefined>(undefined);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isAdmin, setIsAdmin]=useState(false)
  const openDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
  }; 

  const editModal = () => {
    setSelectedTicketId(id);  
    setIsModalOpen(true);
  };

  const closeModal = (status:boolean) => {
    setIsModalOpen(false);
    setModalStatus(status);
    if(status){
        fetchTicket()
    } 
  };

  const handleDelete = async () => {
    try {
      const response = await deleteTicket(id!); 
      toast.success('Ticket deleted succesfully')
      navigate('/dashboard');
    } catch (error) {
      console.error('Error fetching ticket:', error);
    }
  };



  const fetchTicket = async () => {
    try {
      const response = await getTicketById(id!); 
      setTicket(response.data); 
    } catch (error) {
      console.error('Error fetching ticket:', error);
    }
  };

  useEffect(() => {
    const userType = localStorage.getItem('userType')
    setIsAdmin(userType === 'admin')
    fetchTicket();
  }, [id]); 

  if (!ticket) {
    return (
      <div className="flex justify-center items-center h-screen">
      <div className="loader animate-spin rounded-full h-8 w-8 border-t-4 border-blue-600"></div>
    </div>
    ); 
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="p-6 bg-blue-50 border-b border-gray-200 flex justify-between items-center">
        <h1 className="text-4xl font-semibold text-gray-800 mb-2">Ticket Details</h1>
         {/* Edit and Delete Buttons */}
        <div className="flex justify-start space-x-4">
          {(ticket.user.permissions?.includes('change_ticket') || isAdmin) && <button className="px-4 py-2 bg-green-600 text-white rounded-md flex items-center hover:bg-green-700 transition duration-200" onClick={() => editModal()}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 4h4v4m0 0l-8 8-4-4 8-8M16 4l4 4" />
            </svg>
            Edit
          </button>}
          {(ticket.user.permissions?.includes('delete_ticket') || isAdmin) && <button className="px-4 py-2 bg-red-600 text-white rounded-md flex items-center hover:bg-red-700 transition duration-200" onClick={openDeleteDialog} >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Delete
          </button>}
        </div>
      </div>
  
      <div className="p-6 space-y-8">
        
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Title</h2>
          <p className="text-lg text-gray-800">{ticket.title}</p>
        </div>
  
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Priority</h2>
            <p className="text-lg text-gray-700 capitalize">{ticket.priority}</p>
          </div>
  
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Status</h2>
            <p className={`text-lg font-medium ${ticket.status === "open" ? "text-green-500" : ticket.status === "in_progress" ? "text-yellow-500" : "text-red-500"}`}>
            {formatLabel(ticket.status)} 
            </p>
          </div>
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Created At</h2>
            <p className="text-lg text-gray-600">{new Date(ticket.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">Updated At</h2>
            <p className="text-lg text-gray-600">{new Date(ticket.updated_at).toLocaleDateString()}</p>
          </div>
        </div>
  
        <div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Description</h2>
          <p className="text-gray-600">{ticket.description || "No description available"}</p>
        </div>
  
       
  
      </div>
  
      <div className="p-6 bg-gray-50 border-t border-gray-200 text-center">
        <Link to="/dashboard">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
            Back to Dashboard
          </button>
        </Link>
      </div>
    </div>

    {/* Modal */}
    {isModalOpen && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg w-96 p-6">
        <TicketCrudModal onClose={closeModal}  ticket={ticket}/>
        </div>
    </div>
    )}


    {/* Confirmation Dialog */}
    {isDeleteDialogOpen && (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
          <div className="text-center">
            
            <h3 className="text-2xl font-semibold text-gray-800 mt-4">Delete Confirmation</h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this ticket? 
            </p>
          </div>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              className="px-5 py-2 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition duration-200"
              onClick={closeDeleteDialog}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition duration-200"
              onClick={handleDelete}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )}

  </div>

  );
};

export default TicketDetail;
