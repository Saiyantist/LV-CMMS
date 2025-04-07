import { useState } from "react";
import { router, Head } from "@inertiajs/react";
import ReactPaginate from "react-paginate"; // Import react-paginate
import { UserRoleProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ManageRoles({ users, roles, auth }: UserRoleProps) {
    const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>(
        {}
    );
    const [activeTab, setActiveTab] = useState<string>("Incoming");
    const [currentPage, setCurrentPage] = useState<number>(0); // Updated for react-paginate
    const itemsPerPage = 10;

    const handleChangeRole = (userId: number) => {
        if (!selectedRole[userId]) return;
        router.patch(
            `/admin/manage-roles/${userId}/role`,
            { role: selectedRole[userId] },
            {
                preserveScroll: true,
                onSuccess: () => router.visit("/admin/manage-roles"),
                onError: (error) =>
                    alert(error.message || "Error updating role"),
            }
        );
    };

    const handleRemoveRole = (userId: number) => {
        if (!confirm("Are you sure you want to remove this role?")) return;
        router.delete(`/admin/manage-roles/${userId}/role`, {
            preserveScroll: true,
            onSuccess: () => router.visit("/admin/manage-roles"),
            onError: (error) => alert(error.message || "Error deleting role"),
        });
    };

    const tabs = ["Incoming", "Accepted", "Declined"];
    const offset = currentPage * itemsPerPage;
    const currentUsers = users.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(users.length / itemsPerPage);

    const handlePageClick = ({ selected }: { selected: number }) => {
        setCurrentPage(selected);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2
                    className="text-xl font-semibold leading-tight"
                    style={{ color: "#2A2A2A" }}
                >
                    User Management
                </h2>
            }
        >
            <Head title="User Management" />

            {/* Tab Section */}
            <div className="mb-6">
                <div className="inline-flex border border-gray-300 rounded-t-md overflow-hidden">
                    {tabs.map((tab, index) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 text-sm font-medium transition duration-200
                    ${
                        activeTab === tab
                            ? "bg-[#1F3463] text-white border-[#1F3463]"
                            : "bg-white text-black hover:bg-gray-100"
                    }
                    border-t border-b ${index !== 0 ? "border-l" : ""}
                    border-gray-300 rounded-t-md
                `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* User Management Table */}
            <div className="p-6">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                    <thead>
                        <tr className="bg-white">
                            <th className="border p-2 dark:border-gray-700 dark:text-gray-300">
                                Id
                            </th>
                            <th className="border p-2 dark:border-gray-700 dark:text-gray-300">
                                Name
                            </th>
                            <th className="border p-2 dark:border-gray-700 dark:text-gray-300">
                                Birthday
                            </th>
                            <th className="border p-2 dark:border-gray-700 dark:text-gray-300">
                                Contact Number
                            </th>
                            <th className="border p-2 dark:border-gray-700 dark:text-gray-300">
                                Email
                            </th>
                            <th className="border p-2 dark:border-gray-700 dark:text-gray-300">
                                Current Role
                            </th>
                            <th className="border p-2 dark:border-gray-700 dark:text-gray-300">
                                Assign New Role
                            </th>
                            <th className="border p-2 dark:border-gray-700 dark:text-gray-300">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="text-black dark:text-gray-300 bg-white">
                        {currentUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="border dark:border-gray-700 text-center"
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
                                        className="border p-1 rounded text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
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
                                <td className="p-2 flex justify-around">
                                    {auth.user.id !== user.id && (
                                        <>
                                            <button
                                                onClick={() =>
                                                    handleChangeRole(user.id)
                                                }
                                                className="px-4 py-1 bg-[#05549C] text-white rounded hover:bg-blue-600"
                                            >
                                                Update Role
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRemoveRole(user.id)
                                                }
                                                className="ml-2 px-4 py-1 bg-[#DF0404] text-white rounded hover:bg-red-600"
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

            {/* Pagination */}
            <div className="flex justify-center mt-4">
                <ReactPaginate
                    previousLabel={"← Previous"}
                    nextLabel={"Next →"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"flex space-x-2"}
                    pageClassName={
                        "px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                    }
                    activeClassName={"bg-[#1F3463] text-white"}
                    previousClassName={
                        "px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                    }
                    nextClassName={
                        "px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-100"
                    }
                    disabledClassName={"opacity-50 cursor-not-allowed"}
                />
            </div>
        </AuthenticatedLayout>
    );
}
