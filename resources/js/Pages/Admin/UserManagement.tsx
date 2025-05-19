import { useState, useEffect } from "react";
import { router, Head } from "@inertiajs/react";
import { UserRoleProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import UserManagementLayout from "./UserManagementLayout";

export default function UserManagement({ users, roles, auth }: UserRoleProps) {
    const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>(
        {}
    );
    const [showScrollTop, setShowScrollTop] = useState(false);

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

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 100);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <AuthenticatedLayout>
            <Head title="User Management" />

              <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold">User Management</h1>
                </div>
            </header>

            <UserManagementLayout
                users={users}
                roles={roles}
                auth={auth}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                handleChangeRole={handleChangeRole}
                handleRemoveRole={handleRemoveRole}
            />

            <ScrollToTopButton
                showScrollUpButton={showScrollTop}
                scrollToTop={scrollToTop}
            />
        </AuthenticatedLayout>
    );
}
