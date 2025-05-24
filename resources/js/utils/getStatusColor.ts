export const getStatusColor = (status: string) => {
        switch (status) {
            case "Pending":
                return "bg-gray-100 text-gray-800 border-gray-300";
            case "Assigned":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "Scheduled":
                return "bg-orange-100 text-orange-800 border-gray-300";
            case "Ongoing":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "Overdue":
                return "bg-red-100 text-red-800 border-red-300";
            case "Completed":
                return "bg-green-100 text-green-800 border-green-300";
            case "For Budget Request":
                return "bg-orange-200 text-orange-800 border-gray-300";
            case "Cancelled":
                return "bg-gray-200 text-gray-600 border-gray-400";
            case "Declined":
                return "bg-pink-100 text-pink-800 border-pink-300";
            case "Deleted":
                return "bg-black text-white border-black";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };