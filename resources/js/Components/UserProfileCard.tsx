import { Pencil, ArrowLeft } from "lucide-react"; // Optional icons

export default function UserProfileCard({
    user,
    isEditing,
    setIsEditing,
    className = "",
}: {
    user: {
        name: string;
        roles: { name: string }[];
        profile_photo_url: string;
    };
    isEditing: boolean;
    setIsEditing: (editing: boolean) => void;
    className?: string;
}) {
    return (
        <div
            className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 w-full ${className}`}
        >
            {/* Profile Info */}
            <div className="flex items-center gap-5">
                <img
                    src={user.profile_photo_url}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-2 border-black object-cover"
                />

                <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {user.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {user.roles && user.roles.length > 0
                            ? user.roles.map((r) => r.name).join(", ")
                            : "User"}
                    </p>
                </div>
            </div>

            {/* Toggle Edit Button */}
            <button
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition
                    ${
                        isEditing
                            ? "bg-gray-100 text-gray-800 hover:bg-gray-200"
                            : "bg-secondary text-white hover:bg-primary"
                    }`}
            >
                {isEditing ? <ArrowLeft size={16} /> : <Pencil size={16} />}
                {isEditing ? "Back" : "Edit"}
            </button>
        </div>
    );
}
