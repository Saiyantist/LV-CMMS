// ...shadcnui dialog component for use in MyBookings and other pages...

import * as React from "react";

export interface DialogProps {
    open: boolean;
    onOpenChange?: (open: boolean) => void;
    children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="relative z-50 w-full max-w-2xl mx-auto">
                {children}
            </div>
        </div>
    );
}

export function DialogContent({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`bg-white rounded-lg shadow-lg p-6 relative ${className}`}
        >
            {children}
        </div>
    );
}

export function DialogHeader({ children }: { children: React.ReactNode }) {
    return <div className="mb-4">{children}</div>;
}

export function DialogTitle({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h2 className={`text-xl font-bold mb-2 ${className}`}>{children}</h2>
    );
}
