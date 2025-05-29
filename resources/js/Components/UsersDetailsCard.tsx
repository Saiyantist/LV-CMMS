export default function UserDetailsCard({
    user,
    className = "",
}: {
    user: {
        name: string;
        email: string; // ✅ Added email here
        contact_number?: string;
        // birth_date?: string;
        gender?: string;
        staff_type?: string;
        roles?: string;
    };
    className?: string;
}) {
    return (
        <div className={`bg-white p-8 rounded-lg shadow w-full ${className}`}>
            <h2 className="text-md sm:text-lg font-bold text-primary dark:text-primary/30">
                Personal Information
            </h2>

            {/* User Info */}
            <div className="mt-6 space-y-4">
                <div className="flex justify-between">
                    <p className="text-xs sm:text-sm text-primary dark:text-gray-300">
                        Name:
                    </p>
                    <p className="text-black text-xs sm:text-sm">{user.name}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-xs sm:text-sm text-primary dark:text-gray-300">
                        Contact Number:
                    </p>
                    <p className="text-black text-xs sm:text-sm">0{user.contact_number}</p>
                </div>
                {/* <div className="flex justify-between">
                    <p className="text-xs sm:text-sm text-primary dark:text-gray-300">
                        Birthday:
                    </p>
                    <p className="text-black text-xs sm:text-sm">{user.birth_date}</p>
                </div> */}
                <div className="flex justify-between">
                    <p className="text-xs sm:text-sm text-primary dark:text-gray-300">
                        Gender:
                    </p>
                    <p className="text-black text-xs sm:text-sm">{user.gender}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-xs sm:text-sm text-primary dark:text-gray-300">
                        Type of Staff:
                    </p>
                    <p className="text-black text-xs sm:text-sm">{user.staff_type}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-xs sm:text-sm text-primary dark:text-gray-300">
                        Email:
                    </p>
                    <p className="text-black text-xs sm:text-sm">{user.email}</p>{" "}
                    {/* ✅ Updated to show email */}
                </div>
            </div>
        </div>
    );
}
