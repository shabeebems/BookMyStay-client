import React, { useEffect, useState } from 'react';
import { protectedGetRequest, protectedPutRequest } from '../../../hooks/api';
import ConfirmDialog from '../../../components/ConfirmDialog';
import ToastMessage from '../../../components/ToastMessage'; // <-- Import Toast Component

type User = {
  _id: number;
  name: string;
  email: string;
  mobile?: string;
  address?: {
    city?: string;
    state?: string;
  };
  isBlock: boolean;
};

type TableProps = {
  role: string;
};

const Table: React.FC<TableProps> = ({ role }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Toast States
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await protectedGetRequest(`/admin/users/${role}`);
      setUsers(response.data.data);
    };
    fetchUsers();
  }, [role]);

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const toggleBlock = async (userId: number) => {
    try {
      const response = await protectedPutRequest(`/admin/user`, { userId });
      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isBlock: !user.isBlock } : user
          )
        );
        showToast('User status updated successfully', 'success');
      } else {
        showToast('Failed to update user status', 'error');
      }
    } catch (error) {
      console.error('Failed to toggle block status:', error);
      showToast('An error occurred', 'error');
    }
  };

  const handleConfirm = () => {
    if (selectedUser) {
      toggleBlock(selectedUser._id);
      setOpen(false);
    }
  };

  return (
    <div className="p-6 m-4 bg-white shadow-md rounded-xl overflow-x-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        {role.charAt(0).toUpperCase() + role.slice(1)}s List
      </h2>
      <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
        <thead>
          <tr className="bg-gray-100 text-xs uppercase text-gray-500">
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Mobile</th>
            <th className="px-4 py-3">Address</th>
            <th className="px-4 py-3">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{user.name}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.mobile || 'N/A'}</td>
              <td className="px-4 py-3">
                {user.address?.city && user.address?.state
                  ? `${user.address.city}, ${user.address.state}`
                  : 'N/A'}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setOpen(true);
                  }}
                  className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${
                    user.isBlock
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {user.isBlock ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={open}
        title="Are you sure?"
        message={
          selectedUser?.isBlock
            ? 'Do you want to unblock this user?'
            : 'Do you want to block this user?'
        }
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />

      {/* Toast Message */}
      <ToastMessage
        open={toastOpen}
        message={toastMessage}
        severity={toastSeverity}
        onClose={() => setToastOpen(false)}
      />
    </div>
  );
};

export default Table;
