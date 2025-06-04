export const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "Low":
                return "!bg-green-200 text-green-700";
            case "Medium":
                return "!bg-yellow-100 text-yellow-700";
            case "High":
                return "!bg-rose-100 text-rose-700";
            case "Critical":
                return "!bg-red-400 text-red-50";
            default:
                return "text-gray-400";
        }
    };