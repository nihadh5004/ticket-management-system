import { useEffect, useState } from "react";
import { editPermissions } from "../../services/ticketService";
import { IUser } from "../../models/ticket-model";
import toast from "react-hot-toast";

interface UserCrudModalProps {
  onClose: (status: boolean) => void;
  userData?: IUser | null;
}

const UserCrudModal: React.FC<UserCrudModalProps> = ({ onClose, userData }) => {
  const [permissions, setPermissions] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false); 

  useEffect(() => {
    if (userData) {
      setPermissions(userData.permissions || []);
    }
  }, [userData]);

  const handleClose = () => {
    onClose(false);
  };

  const handlePermissionChange = (permission: string) => {
    setPermissions((prevPermissions) =>
      prevPermissions.includes(permission)
        ? prevPermissions.filter((perm) => perm !== permission) 
        : [...prevPermissions, permission] 
    );
  };

  const handleSaveChanges = async () => {
    setLoading(true); 
    try {
      if (userData?.id) {
        const response = await editPermissions(userData.id, permissions);
        toast.success(response.message);
      }
      onClose(true);
    } catch (error) {
      console.error("Error saving permissions:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50 transition-all duration-300 ease-in-out">
      <div className="bg-white rounded-lg w-96 p-8 shadow-lg transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
        <h3 className="text-2xl font-semibold text-gray-800 mb-6">Edit Permissions</h3>
          
            {/* User details (Read-Only) */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-600">Username</p>
              <p className="text-lg font-semibold text-gray-800">{userData?.username}</p>
            </div>
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-800">{userData?.email ?? "No Email"}</p>
            </div>
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-600">Status</p>
              <p
                className={`text-lg font-semibold ${
                  userData?.is_active ? "text-green-600" : "text-red-600"
                }`}
              >
                {userData?.is_active ? "Active" : "Inactive"}
              </p>
            </div>
            {/* Permissions (Editable) */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-600">Permissions</p>
              <div className="space-y-4 mt-2">
                <div className="flex items-center">
                  <input
                    id="edit_permission"
                    type="checkbox"
                    className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-500 transition duration-200"
                    onChange={() => handlePermissionChange("change_ticket")}
                    checked={permissions.includes("change_ticket")}
                  />
                  <label
                    htmlFor="edit_permission"
                    className="ml-3 text-lg text-gray-700 font-semibold"
                  >
                    Can Edit Ticket
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="delete_permission"
                    type="checkbox"
                    className="h-5 w-5 border-gray-300 text-red-600 focus:ring-red-500 transition duration-200"
                    onChange={() => handlePermissionChange("delete_ticket")}
                    checked={permissions.includes("delete_ticket")}
                  />
                  <label
                    htmlFor="delete_permission"
                    className="ml-3 text-lg text-gray-700 font-semibold"
                  >
                    Can Delete Ticket
                  </label>
                </div>
              </div>
            </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleClose}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 px-6 py-3 rounded-md text-lg transition duration-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            className={`${
              loading ? "bg-blue-400" : "bg-blue-600"
            } text-white hover:bg-blue-700 px-6 py-3 rounded-md text-lg transition duration-200 flex items-center`}
            disabled={loading} 
          >
            {loading ? (
              <div className="loader animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
            ) : null}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCrudModal;
