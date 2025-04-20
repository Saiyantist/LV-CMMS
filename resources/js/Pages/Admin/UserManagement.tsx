import { useState, useEffect } from 'react';
import { router, Head } from '@inertiajs/react';
import { UserRoleProps } from '@/types';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { ChevronUp } from 'lucide-react';

export default function ManageRoles({ users, roles, auth }: UserRoleProps) {
  const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>({});
  const [showScrollTop, setShowScrollTop] = useState(false);

  const handleChangeRole = (userId: number) => {
    if (!selectedRole[userId]) return;

    router.patch(`/admin/manage-roles/${userId}/role`, {
      role: selectedRole[userId]
    }, {
      preserveScroll: true,
      onSuccess: () => router.visit('/admin/manage-roles', {
        replace: false,
        preserveState: false,
        preserveScroll: true,
      }),
      onError: (error) => alert(error.message || 'Error updating role'),
    });
  };

  const handleRemoveRole = (userId: number) => {
    if (!confirm("Are you sure you want to remove this role?")) return;

    router.delete(`/admin/manage-roles/${userId}/role`, {
      preserveScroll: true,
      onSuccess: () => router.visit('/admin/manage-roles', {
        replace: false,
        preserveState: false,
        preserveScroll: true,
      }),
      onError: (error) => alert(error.message || 'Error deleting role'),
    });
  };

  // Handle scroll-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 100);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl leading-tight text-gray-800 dark:text-gray-200">
          User Management
        </h2>
      }
    >
      <Head title="User Management" />

      <div className="p-4 space-y-4">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800">
                <th className="border p-2">Id</th>
                <th className="border p-2">Name</th>
                <th className="border p-2">Birthday</th>
                <th className="border p-2">Contact</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Current Role</th>
                <th className="border p-2">Assign New Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody className="text-black dark:text-gray-300">
              {users.map((user) => (
                <tr key={user.id} className="border text-center dark:border-gray-700">
                  <td className="p-2">{user.id}</td>
                  <td className="p-2">{user.first_name} {user.last_name}</td>
                  <td className="p-2">{user.birth_date}</td>
                  <td className="p-2">+63 {user.contact_number}</td>
                  <td className="p-2">{user.email}</td>
                  <td className="p-2">{user.roles.map(r => r.name).join(', ')}</td>
                  <td className="p-2">
                    <select
                      value={selectedRole[user.id] || ''}
                      onChange={(e) => setSelectedRole({ ...selectedRole, [user.id]: e.target.value })}
                      className="border p-1 rounded text-xs text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
                      disabled={auth.user.id === user.id && user.roles.some(r => r.name === 'super_admin')}
                    >
                      <option value="" disabled>Select role</option>
                      {roles.map(role => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    {auth.user.id !== user.id && (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleChangeRole(user.id)}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleRemoveRole(user.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-xs dark:bg-red-600 dark:hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-4">
          {users.map(user => (
            <div key={user.id} className="border rounded-lg p-4 bg-white shadow dark:bg-gray-800 dark:border-gray-700">
              <div className="text-sm space-y-1">
                <div><strong>ID:</strong> {user.id}</div>
                <div><strong>Name:</strong> {user.first_name} {user.last_name}</div>
                <div><strong>Birthday:</strong> {user.birth_date}</div>
                <div><strong>Contact:</strong> +63 {user.contact_number}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Current Role:</strong> {user.roles.map(r => r.name).join(', ')}</div>

                <div className="mt-2">
                  <select
                    value={selectedRole[user.id] || ''}
                    onChange={(e) => setSelectedRole({ ...selectedRole, [user.id]: e.target.value })}
                    className="w-full mt-1 p-2 border text-xs rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    disabled={auth.user.id === user.id && user.roles.some(r => r.name === 'super_admin')}
                  >
                    <option value="" disabled>Select role</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                  </select>
                </div>

                {auth.user.id !== user.id && (
                  <div className="flex justify-between mt-3">
                    <button
                      onClick={() => handleChangeRole(user.id)}
                      className="w-[48%] px-2 py-1 text-xs bg-blue-500 text-white rounded dark:bg-blue-600 dark:hover:bg-blue-500"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleRemoveRole(user.id)}
                      className="w-[48%] px-2 py-1 text-xs bg-red-500 text-white rounded dark:bg-red-600 dark:hover:bg-red-500"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg dark:bg-blue-600 dark:hover:bg-blue-500"
        >
          <ChevronUp size={20} />
        </button>
      )}
    </AuthenticatedLayout>
  );
}
