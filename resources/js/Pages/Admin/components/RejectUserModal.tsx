import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/Components/shadcnui/dialog";
import { Button } from "@/Components/shadcnui/button";
import { router } from "@inertiajs/react";
import { X } from "lucide-react";

interface RejectUserModalProps {
    user: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
        contact_number: string;
        created_at: string;
        status: string;
    };
    onClose: () => void;
}

export default function RejectUserModal({ user, onClose }: RejectUserModalProps) {
    const handleReject = () => {
        router.patch(
            `/admin/manage-roles/${user.id}/reject`,
            {},
            {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
                onError: (error) => alert(error.message || "Error rejecting user"),
            }
        );
    };

    return (
        <Dialog open onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] p-0 overflow-visible">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="text-md sm:text-lg font-semibold text-primary">
                        <div className="flex flex-row gap-4">
                            <span>Reject User</span>
                            <span className="text-muted-foreground">|</span>
                            <span className="text-muted-foreground">ID: {user.id}</span>
                        </div>
                    </DialogTitle>
                    <Button variant="ghost" size="icon" className="absolute right-4 top-3 border rounded-full h-6 w-6" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </DialogHeader>

                <div className="px-6 py-4 space-y-4">
                    {/* Information Section */}
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium text-gray-500">Name:</div>
                            <div>{user.first_name} {user.last_name}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium text-gray-500">Contact:</div>
                            <div>+63 {user.contact_number}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium text-gray-500">Email:</div>
                            <div>{user.email}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium text-gray-500">Date Registered:</div>
                            <div>{new Date(user.created_at).toLocaleDateString()}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="font-medium text-gray-500">Status:</div>
                            <div className={`px-2 py-1 rounded border ${
                                user.status?.toLowerCase() === 'approved' 
                                    ? 'bg-green-100 text-green-800 border-green-300'
                                    : user.status?.toLowerCase() === 'rejected'
                                    ? 'bg-red-50 text-pink-800 border-pink-300'
                                    : 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}>
                                {user.status || "Pending"}
                            </div>
                        </div>
                    </div>

                </div>
                {/* Action Buttons */}
                <DialogFooter className="px-6 py-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleReject}
                        className="w-full sm:w-auto bg-destructive text-white hover:bg-destructive/80"
                    >
                        Reject
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
} 