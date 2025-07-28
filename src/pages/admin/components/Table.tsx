import React, { useEffect, useState } from 'react';
import { getRequest } from '../../../hooks/api';

type User = {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  address?: {
    city?: string;
    state?: string;
  };
  isBlocked: boolean;
};

type TableProps = {
  role: string;
};

const Table: React.FC<TableProps> = ({ role }) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getRequest(`/admin/users/${role}`);
      setUsers(response.data.data);
    };
    fetchUsers();
  }, []);

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
            <tr key={user.id} className="border-b hover:bg-gray-50">
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
                  // onClick={() => toggleBlock(user.id)}
                  className={`px-3 py-1 rounded-full text-white text-xs font-semibold
                    ${user.isBlocked ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}
                  `}
                >
                  {user.isBlocked ? 'Unblock' : 'Block'}
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
