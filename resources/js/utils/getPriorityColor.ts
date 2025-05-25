export const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Low":
                return "bg-green-100 text-green-700";
            case "Medium":
                return "bg-yellow-100 text-yellow-700";
            case "High":
                return "bg-orange-200 text-red-700";
            case "Critical":
                return "bg-red-400 text-red-50";
            default:
                return "text-gray-400";
        }
    };