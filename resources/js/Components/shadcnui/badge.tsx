import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: "default" | "secondary" | "success" | "warning" | "danger";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className = "", variant = "default", ...props }, ref) => {
        let colorClass = "";
        switch (variant) {
            case "success":
                colorClass = "bg-green-100 text-green-800";
                break;
            case "warning":
                colorClass = "bg-yellow-100 text-yellow-800";
                break;
            case "danger":
                colorClass = "bg-red-500 text-white";
                break;
            case "secondary":
                colorClass = "bg-gray-200 text-gray-800";
                break;
            default:
                colorClass = "bg-blue-100 text-blue-800";
        }
        return (
            <span
                ref={ref}
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${colorClass} ${className}`}
                {...props}
            />
        );
    }
);

Badge.displayName = "Badge";
