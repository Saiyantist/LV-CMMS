import { UserRoleProps } from "@/types";
// import Pagination from "@/Components/Pagination";

interface Props extends UserRoleProps {
    selectedRole: { [key: number]: string };
    setSelectedRole: React.Dispatch<
        React.SetStateAction<{ [key: number]: string }>
    >;
    handleChangeRole: (userId: number) => void;
    handleRemoveRole: (userId: number) => void;
}

export default function UserManagementLayout({
    users,
    roles,
    auth,
    selectedRole,
    setSelectedRole,
    handleChangeRole,
    handleRemoveRole,
}: Props) {
    return (
        <div className="p-4 space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 dark:border-gray-700 text-sm text-white md:text-sm">
                    <thead>
                        <tr className="bg-secondary dark:bg-gray-800">
                            <th className="border p-3">Id</th>
                            <th className="border p-3">Name</th>
                            {/* <th className="border p-3">Birthday</th> */}
                            <th className="border p-3">Contact</th>
                            <th className="border p-3">Email</th>
                            <th className="border p-3">Current Role</th>
                            <th className="border p-3">Assign New Role</th>
                            <th className="border p-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-black dark:text-gray-300">
                        {users.map((user) => (
                            <tr
                                key={user.id}
                                className="border text-center dark:border-gray-700"
                            >
                                <td className="p-3">{user.id}</td>
                                <td className="p-3">
                                    {user.first_name} {user.last_name}
                                </td>
                                {/* <td className="p-3">{user.birth_date}</td> */}
                                <td className="p-3">
                                    +63 {user.contact_number}
                                </td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">
                                    {user.roles
                                        .map((r) =>
                                            r.name
                                                .replace(/_/g, " ")
                                                .replace(/\b\w/g, (c) =>
                                                    c.toUpperCase()
                                                )
                                        )
                                        .join(", ")}
                                </td>
                                <td className="p-3">
                                    <select
                                        value={selectedRole[user.id] || ""}
                                        onChange={(e) =>
                                            setSelectedRole({
                                                ...selectedRole,
                                                [user.id]: e.target.value,
                                            })
                                        }
                                        className="px-3 py-2 text-sm md:text-base border rounded text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
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
                                                {role.name
                                                    .replace(/_/g, " ") // Replace underscores with spaces
                                                    .split(" ") // Split into words
                                                    .map(
                                                        (word) =>
                                                            word
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                            word
                                                                .slice(1)
                                                                .toLowerCase()
                                                    ) // Capitalize each word
                                                    .join(" ")}{" "}
                                                {/* Join them back */}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="p-3">
                                    {auth.user.id !== user.id && (
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleChangeRole(user.id)
                                                }
                                                className="px-4 py-2 text-sm md:text-base bg-secondary text-white rounded dark:bg-blue-600 dark:hover:bg-blue-500"
                                            >
                                                Update
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleRemoveRole(user.id)
                                                }
                                                className="px-4 py-2 text-sm md:text-base bg-destructive text-white rounded dark:bg-red-600 dark:hover:bg-red-500"
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
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="border rounded-lg p-4 bg-white shadow dark:bg-gray-800 dark:border-gray-700"
                    >
                        <div className="text-sm md:text-base space-y-2">
                            <div>
                                <strong>ID:</strong> {user.id}
                            </div>
                            <div>
                                <strong>Name:</strong> {user.first_name}{" "}
                                {user.last_name}
                            </div>
                            {/* <div>
                                <strong>Birthday:</strong> {user.birth_date}
                            </div> */}
                            <div>
                                <strong>Contact:</strong> +63{" "}
                                {user.contact_number}
                            </div>
                            <div>
                                <strong>Email:</strong> {user.email}
                            </div>
                            <div>
                                <strong>Current Role:</strong>{" "}
                                {user.roles
                                    .map((r) =>
                                        r.name
                                            .replace(/_/g, " ")
                                            .replace(/\b\w/g, (c) =>
                                                c.toUpperCase()
                                            )
                                    )
                                    .join(", ")}
                            </div>

                            <div className="mt-2">
                                <select
                                    value={selectedRole[user.id] || ""}
                                    onChange={(e) =>
                                        setSelectedRole({
                                            ...selectedRole,
                                            [user.id]: e.target.value,
                                        })
                                    }
                                    className="w-full mt-1 px-3 py-2 text-sm md:text-base border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                                        <option key={role.id} value={role.name}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {auth.user.id !== user.id && (
                                <div className="flex justify-between mt-3 gap-2">
                                    <button
                                        onClick={() =>
                                            handleChangeRole(user.id)
                                        }
                                        className="w-1/2 px-4 py-2 text-sm md:text-base bg-secondary text-white rounded dark:bg-blue-600 dark:hover:bg-blue-500"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleRemoveRole(user.id)
                                        }
                                        className="w-1/2 px-4 py-2 text-sm md:text-base bg-destructive text-white rounded dark:bg-red-600 dark:hover:bg-red-500"
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
    );
}
