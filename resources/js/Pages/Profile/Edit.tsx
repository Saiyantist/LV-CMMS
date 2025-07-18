import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import UserProfileCard from "@/Components/UserProfileCard";
import UserDetailsCard from "@/Components/UsersDetailsCard";
import { useState } from "react";
import { toTitleCase } from "@/utils/stringHelpers";

export default function Edit({
    mustVerifyEmail,
    status,
    departments,
    work_groups,
}: PageProps<{
    mustVerifyEmail: boolean;
    status?: string;
    departments?: { id: number; name: string; type: string;}[];
    work_groups?: { id: number; name: string;}[];
}>) {
    // ✅ Get the user from usePage()
    const user = usePage().props.auth.user;

    // ✅ State to toggle between view and edit modes
    const [isEditing, setIsEditing] = useState(false);

    return (
        <AuthenticatedLayout>
            <Head title="Profile" />
            <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                {/* User Profile Card (Always Visible) */}
                <UserProfileCard
                    user={{
                        name: `${user.first_name} ${user.last_name}`,
                        roles: [{ name: user.role ?? "User" }],
                        profile_photo_url:
                            user.gender === "male"
                                ? "/images/m.png"
                                : "/images/f.png",
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
                                // birth_date: user.birth_date,
                                gender: toTitleCase(user.gender),
                                staff_type: toTitleCase(user.staff_type || ''),
                            }}
                            className="mx-auto"
                        />
                    </div>
                ) : (
                    // Show Edit Forms when editing
                    <>
                        {/* Update Profile Info */}
                        <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 dark:bg-gray-800">
                            <UpdateProfileInformationForm
                                mustVerifyEmail={mustVerifyEmail}
                                status={status}
                                className="max-w-xl"
                                departments={departments}
                                work_groups={work_groups}
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
        </AuthenticatedLayout>
    );
}
