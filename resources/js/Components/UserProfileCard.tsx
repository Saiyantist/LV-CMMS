import { Link } from "@inertiajs/react";

export default function UserProfileCard({
    user,
    isEditing,
    setIsEditing, // <-- Add prop to handle click
    className = "",
}: {
    user: {
        name: string;
        role: string;
        profile_photo_url: string;
    };
    isEditing: boolean; // <-- New prop to track edit state
    setIsEditing: (editing: boolean) => void; // <-- Toggle function
    className?: string;
}) {
    return (
        <div
            className={`bg-white p-6 rounded-lg shadow flex items-center justify-between w-full ${className}`}
        >
            {/* Profile Section */}
            <div className="flex items-center gap-4">
                {/* Profile Photo */}
                <img
                    src={user.profile_photo_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-blue-400"
                />

                {/* User Info */}
                <div>
                    <h3 className="text-lg font-medium text-black">
                        {user.name}
                    </h3>
                    <p className="text-sm text-gray-700">{user.role}</p>
                </div>
            </div>

            {/* Edit/Back Button */}
            <button
                onClick={() => setIsEditing(!isEditing)}
                className={`bg-white text-black border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded-lg text-sm transition`}
            >
                {isEditing ? "Back" : "Edit"}
            </button>
        </div>
    );
}
