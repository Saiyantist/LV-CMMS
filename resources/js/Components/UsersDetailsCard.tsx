export default function UserDetailsCard({
    user,
    className = "",
}: {
    user: {
        name: string;
        email: string; // ✅ Added email here
        contact_number: string;
        birth_date: string;
        gender: string;
        staff_type: string;
    };
    className?: string;
}) {
    return (
        <div
            className={`bg-white p-6 rounded-lg shadow-lg w-full ${className}`}
        >
            <h3 className="text-xl font-semibold text-black mb-4">
                User Information
            </h3>

            {/* User Info */}
            <div className="space-y-4">
                <div className="flex justify-between">
                    <p className="text-gray-700 font-medium">Name:</p>
                    <p className="text-black">{user.name}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700 font-medium">Email:</p>
                    <p className="text-black">{user.email}</p> {/* ✅ Updated to show email */}
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700 font-medium">Number:</p>
                    <p className="text-black">{user.contact_number}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700 font-medium">Birthday:</p>
                    <p className="text-black">{user.birth_date}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700 font-medium">Gender:</p>
                    <p className="text-black">{user.gender}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-gray-700 font-medium">Type of Staff:</p>
                    <p className="text-black">{user.staff_type}</p>
                </div>
            </div>
        </div>
    );
}
