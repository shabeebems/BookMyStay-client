import React, { useEffect, useState } from 'react';
import { protectedGetRequest, protectedPutRequest } from '../../../hooks/api';
import Swal from "sweetalert2"

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

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await protectedGetRequest(`/admin/users/${role}`);
      setUsers(response.data.data);
    };
    fetchUsers();
  }, []);

  const toggleBlock = async (userId: number) => {
    try {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          const blocking = async() => {

            const response = await protectedPutRequest(`/admin/user`, { userId });
            if (response.data.success) {
              setUsers(prevUsers =>
                prevUsers.map(user =>
                  user._id === userId ? { ...user, isBlock: !user.isBlock } : user
                )
              );
            }        
      }
      blocking()
    } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
      
    } catch (error) {
      console.error('Failed to toggle block status:', error);
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
          {users.map(user => (
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
                  onClick={() => toggleBlock(user._id)}
                  className={`px-3 py-1 rounded-full text-white text-xs font-semibold
                    ${user.isBlock ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                  `}
                >
                  {user.isBlock ? 'Unblock' : 'Block'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
