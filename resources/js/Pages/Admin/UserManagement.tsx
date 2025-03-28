import { useState } from "react";
import { router, Head } from "@inertiajs/react";
import { UserRoleProps } from "@/types"; // Define TypeScript interfaces for User and Role
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ManageRoles({ users, roles, auth }: UserRoleProps) {
    const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>(
        {}
    );

    const handleChangeRole = (userId: number) => {
        if (!selectedRole[userId]) return;

        router.patch(
            `/admin/manage-roles/${userId}/role`,
            {
                role: selectedRole[userId],
            },
            {
                preserveScroll: true,
                onSuccess: () =>
                    router.visit("/admin/manage-roles", {
                        replace: false,
                        preserveState: false,
                        preserveScroll: true,
                    }),
                onError: (error) =>
                    alert(error.message || "Error updating role"),
            }
        );
    };

    const handleRemoveRole = (userId: number) => {
        if (!confirm("Are you sure you want to remove this role?")) return;

        router.delete(`/admin/manage-roles/${userId}/role`, {
            preserveScroll: true,
            onSuccess: () =>
                router.visit("/admin/manage-roles", {
                    replace: false,
                    preserveState: false,
                    preserveScroll: true,
                }),
            onError: (error) => alert(error.message || "Error deleting role"),
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-bluetitle">
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            {/* Static Tab Section */}
            <div className="flex space-x-4 border-b border-gray-200 mb-4">
                <button className="py-2 px-4 text-blue-600 border-b-2 border-blue-600 bg-white">
                    Incoming
                </button>
                <button className="py-2 px-4 text-gray-500 hover:text-blue-600 bg-white">
                    Accepted
                </button>
                <button className="py-2 px-4 text-gray-500 hover:text-blue-600 bg-white">
                    Declined
                </button>
            </div>

            <div className="p-6 bg-white">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-white">
                            <th className="border p-2 text-gray-700 bg-white">
                                Id
                            </th>
                            <th className="border p-2 text-gray-700 bg-white">
                                Name
                            </th>
                            <th className="border p-2 text-gray-700 bg-white">
                                Birthday
                            </th>
                            <th className="border p-2 text-gray-700 bg-white">
                                Contact Number
                            </th>
                            <th className="border p-2 text-gray-700 bg-white">
                                Email
                            </th>
                            <th className="border p-2 text-gray-700 bg-white">
                                Current Role
                            </th>
                            <th className="border p-2 text-gray-700 bg-white">
                                Assign New Role
                            </th>
                            <th className="border p-2 text-gray-700 bg-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-black">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border text-center bg-white"
                            >
                                <td className="p-2">{user.id}</td>
                                <td className="p-2">
                                    {user.first_name} {user.last_name}
                                </td>
                                <td className="p-2">{user.birth_date}</td>
                                <td className="p-2">
                                    +63 {user.contact_number}
                                </td>
                                <td className="p-2">{user.email}</td>
                                <td className="p-2">
                                    {user.roles.map((r) => r.name).join(", ")}
                                </td>
                                <td className="p-2">
                                    <select
                                        value={selectedRole[user.id] || ""}
                                        onChange={(e) =>
                                            setSelectedRole({
                                                ...selectedRole,
                                                [user.id]: e.target.value,
                                            })
                                        }
                                        className="border p-1 rounded text-black bg-white border-gray-300"
                                        disabled={
                                            auth.user.id === user.id &&
                                            user.roles.some(
                                                (r) => r.name === "super_admin"
                                            )
                                        }
                                    >
                                        <option value="" disabled>
                                            Select role
                                        </option>
                                        {roles.map((role) => (
                                            <option
                                                key={role.id}
                                                value={role.name}
                                            >
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-2 flex justify-around bg-white">
                                    {auth.user.id !== user.id && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleChangeRole(user.id)
                                                }
                                                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                            >
                                                Update Role
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleRemoveRole(user.id)
                                                }
                                                className="ml-2 px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Remove Role
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
