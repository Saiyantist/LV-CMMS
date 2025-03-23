import { useState } from 'react';
import { router, Head } from '@inertiajs/react';
import { UserRoleProps } from '@/types'; // Define TypeScript interfaces for User and Role
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ManageRoles({ users, roles, auth }: UserRoleProps) {
  const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>({});

  const handleChangeRole = (userId: number) => {
    if (!selectedRole[userId]) return;

    router.patch(`/admin/manage-roles/${userId}/role`,
      {
      role: selectedRole[userId]
      }, {
        preserveScroll: true,
        // onSuccess: () => alert('Role updated successfully!'),
        onSuccess: () => router.visit('/admin/manage-roles', { replace: false, preserveState: false, preserveScroll: true,}),
        onError: (error) => alert(error.message || 'Error updating role'),
      }
    );
  };

  const handleRemoveRole = (userId: number) => {
    if (!confirm("Are you sure you want to remove this role?")) return;

    router.delete(`/admin/manage-roles/${userId}/role`, {
        preserveScroll: true,
        // onSuccess: () => alert('Role deleted successfully!'),
        onSuccess: () => router.visit('/admin/manage-roles', { replace: false, preserveState: false, preserveScroll: true,}),
        onError: (error) => alert(error.message || 'Error deleting role'),
      }
    );
  }

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            User Management
        </h2>
      }
    >
      <Head title="User Management" />

      <div className="p-6">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-800">
              <th className="border p-2 dark:border-gray-700 dark:text-gray-300">Id</th>
              <th className="border p-2 dark:border-gray-700 dark:text-gray-300">Name</th>
              <th className="border p-2 dark:border-gray-700 dark:text-gray-300">Birthday</th>
              <th className="border p-2 dark:border-gray-700 dark:text-gray-300">Contact Number</th>
              <th className="border p-2 dark:border-gray-700 dark:text-gray-300">Email</th>
              <th className="border p-2 dark:border-gray-700 dark:text-gray-300">Current Role</th>
              <th className="border p-2 dark:border-gray-700 dark:text-gray-300">Assign New Role</th>
              <th className="border p-2 dark:border-gray-700 dark:text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody className="text-black dark:text-gray-300">
            {users.map((user) => (
              <tr key={user.id} className="border dark:border-gray-700 text-center">
                <td className="p-2">{user.id}</td>
                <td className="p-2">{user.first_name} {user.last_name}</td>
                <td className="p-2">{user.birth_date}</td>
                <td className="p-2">+63 {user.contact_number}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.roles.map((r) => r.name).join(', ')}</td>
                <td className="p-2">
                  <select
                    value={selectedRole[user.id] || ''}
                    onChange={(e) => setSelectedRole({ ...selectedRole, [user.id]: e.target.value })}
                    className="border p-1 rounded text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
                    disabled={auth.user.id === user.id && user.roles.some((r) => r.name === 'super_admin')}
                  >
                    <option value="" disabled>Select role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2 flex justify-around">
                  {auth.user.id !== user.id && (
                    <>
                      <button
                        onClick={() => handleChangeRole(user.id)}
                        className="px-4 py-1 bg-blue-500 text-white rounded dark:bg-blue-600 dark:hover:bg-blue-500"
                      >
                        Update Role
                      </button>

                      <button
                        onClick={() => handleRemoveRole(user.id)}
                        className="ml-2 px-4 py-1 bg-red-500 text-white rounded dark:bg-red-600 dark:hover:bg-red-500"
                      >
                        Remove Role
                      </button>
                    </>
                  )}
                  {/* <button
                    onClick={() => handleChangeRole(user.id)}
                    className="px-4 py-1 bg-blue-500 text-white rounded dark:bg-blue-600 dark:hover:bg-blue-500"
                    disabled={auth.user.id === user.id && user.roles.some((r) => r.name === 'super_admin')}
                  >
                    Update Role
                  </button>
                  <button
                    onClick={() => handleRemoveRole(user.id)}
                    className="px-4 py-1 bg-red-500 text-white rounded ml-2 dark:bg-red-600 dark:hover:bg-red-500"
                    disabled={auth.user.id === user.id && user.roles.some((r) => r.name === 'super_admin')}
                  >
                    Remove Role
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AuthenticatedLayout>
  );
};