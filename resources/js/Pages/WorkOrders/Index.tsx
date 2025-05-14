// WorkOrders.tsx
import { useState, useEffect } from "react";
import { PageProps } from "@/types";
import { usePage , router } from "@inertiajs/react";
import IndexLayout from "./IndexLayout";
import { getPriorityColor } from "@/utils/getPriorityColor";


export default function WorkOrders({
    workOrders,
    locations,
    maintenancePersonnel,
    user,
}: PageProps<{
    workOrders: {
        id: number;
        report_description: string;
        status: string;
        work_order_type: string;
        label: string;
        priority: string;
        remarks: string;
        requested_at: string;
        location: {
            id: number;
            name: string;
        };
        images: string;
        asset: {
            id: number;
            name: string;
            specification_details: string;
            status: string;
            location_id: number;
        }[];
    }[];
    locations: { id: number; name: string }[];
    maintenancePersonnel: { id: number; first_name: string; last_name: string; roles: {id: number; name: string;}}[];
    user: { id: number; name: string; roles: string[]; permissions: string[] };
}>) {

    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState("Pending");
    const [editingWorkOrder, setEditingWorkOrder] = useState(null);
    const [showScrollUpButton, setShowScrollUpButton] = useState(false);

    const pageUser = usePage().props.auth.user;
    const userName = `${pageUser.first_name} ${pageUser.last_name}`;

    const tabs =
        user.permissions.includes("manage work orders")
            ? ["Pending", "Accepted", "For Budget Request", "Declined"]
            : [];

    /**
     * Filter work orders based on status
     * For Work Order Manager and Super Admin, show all work orders in respective tabs according to status
     */
    const filteredWorkOrders = workOrders.filter((wo) => {
        if (
            user.permissions.includes("manage work orders")
        ) {
            if (activeTab === "Pending") return wo.status === "Pending";
            if (activeTab === "Accepted")
                return ["Assigned", "Ongoing", "Overdue", "Completed"].includes(
                    wo.status
                );
            if (activeTab === "For Budget Request")
                return wo.status === "For Budget Request";
            if (activeTab === "Declined") return wo.status === "Cancelled" || wo.status === "Declined";
            return true;
        }
        return wo;
    });

    const handleDelete = (id: number) => {
        const confirmDelete = confirm("Are you sure you want to delete this work order?");
        if (confirmDelete) {
            router.delete(`/work-orders/${id}`, {

                // For testing purposes, replace with actual delete flash messages
                onSuccess: () => {
                    alert("Work order deleted successfully.");
                },
                onError: () => {
                    alert("Failed to delete the work order. Please try again.");
                },
            });
        }
    }
    const handleScroll = () => {
        setShowScrollUpButton(window.scrollY > 300);
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <IndexLayout
            user={user}
            locations={locations}
            maintenancePersonnel={maintenancePersonnel}
            filteredWorkOrders={filteredWorkOrders}
            tabs={tabs}
            activeTab={activeTab}
            isCreating={isCreating}
            editingWorkOrder={editingWorkOrder}
            showScrollUpButton={showScrollUpButton}
            setActiveTab={setActiveTab}
            setIsCreating={setIsCreating}
            setEditingWorkOrder={setEditingWorkOrder}
            scrollToTop={scrollToTop}
            handleDelete={handleDelete}
        />
    );
}
