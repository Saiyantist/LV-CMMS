import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import UserProfileCard from "@/Components/UserProfileCard";
import UserDetailsCard from "@/Components/UsersDetailsCard";
import { useState } from "react";

export default function Edit({ mustVerifyEmail, status, departments

}: PageProps<{ mustVerifyEmail: boolean; status?: string; departments?: { id: number; name: string }[]}>) {
    // ✅ Get the user from usePage()
    const user = usePage<PageProps>().props.auth.user;

    // ✅ State to toggle between view and edit modes
    const [isEditing, setIsEditing] = useState(false);
    
    return (
        <AuthenticatedLayout>
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    {/* User Profile Card (Always Visible) */}
                    <UserProfileCard
                        user={{
                            name: `${user.first_name} ${user.last_name}`,
                            role: user.role ?? "User",
                            profile_photo_url: "/images/M.A.jpg",
                        }}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                    />

                    {/* Content Changes Based on Edit Mode */}
                    {!isEditing ? (
                        // Show User Details when not editing
                        <div>
                            <UserDetailsCard
                                user={{
                                    name: `${user.first_name} ${user.last_name}`,
                                    email: user.email,
                                    contact_number: user.contact_number,
                                    birth_date: user.birth_date,
                                    gender: user.gender,
                                    staff_type: user.staff_type,
                                }}
                                className="mx-auto"
                            />
                        </div>
                    ) : (
                        // Show Edit Forms when editing
                        <>
                            {/* Update Profile Info */}
                            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-white">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-auto"
                                />
                            </div>

                            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                                <UpdateProfileInformationForm
                                    mustVerifyEmail={mustVerifyEmail}
                                    status={status}
                                    className="max-w-xl"
                                    departments={departments}
                                />
                            </div>
                        
                            {/* Update Password */}
                            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                                <UpdatePasswordForm className="max-auto" />
                            </div>

                            {/* Delete User */}
                            <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                                <DeleteUserForm className="max-auto" />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
