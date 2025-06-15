// WorkOrders.tsx
import { useState, useEffect } from "react";
import { PageProps } from "@/types";
// import { usePage , router } from "@inertiajs/react";
import IndexLayout from "./IndexLayout";

export default function WorkOrders({
    workOrders,
    locations,
    assets,
    maintenancePersonnel,
    user,
}: PageProps<{
    workOrders: {
        id: number;
        report_description: string;
        status: string;
        label: string;
        priority: string;
        remarks: string;
        requested_by: { id: number; first_name: string; last_name: string};
        requested_at: string;
        location: {
            id: number;
            name: string;
        };
        attachments: string[];
        asset: {
            id: number;
            name: string;
            specification_details: string;
            status: string;
            location_id: number;
        }[];
    }[];
    locations: { id: number; name: string }[];
    assets: { 
        id: number;
        name: string;
        location: { id: number; name: string};
    }[];
    maintenancePersonnel: { id: number; first_name: string; last_name: string; roles: {id: number; name: string;}}[];
    user: { id: number; name: string; roles: {name: string;}[]; permissions: string[] };
}>) {

    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState("Pending");
    const [editingWorkOrder, setEditingWorkOrder] = useState(null);
    const [showScrollUpButton, setShowScrollUpButton] = useState(false)

    const isWorkOrderManager = user.permissions.includes("manage work orders");
    const isRequester = user.permissions.includes("request work orders");

    const tabs =
        isWorkOrderManager ? ["Pending", "Accepted", "Ongoing", "Completed", "Overdue", "Cancelled", "Declined"]
        : isRequester ? ["Pending", "Assigned", "Ongoing", "Completed", "Overdue", "Cancelled", "Declined"]
        : [];

    /**
     * Filter work orders based on status
     * For Work Order Manager and Super Admin, show all work orders in respective tabs according to status
     */
    const filteredWorkOrders = workOrders.filter((wo) => {
        if (activeTab === "Pending") return wo.status === "Pending";
        if (activeTab === "Accepted") return ["Assigned", 'For Budget Request'].includes(wo.status);
        if (activeTab === "Ongoing") return ["Ongoing", "Scheduled"].includes(wo.status);
        if (activeTab === "Completed") return wo.status === "Completed";
        if (activeTab === "Overdue") return wo.status === "Overdue";
        if (activeTab === "Cancelled") return wo.status === "Cancelled";
        if (activeTab === "Declined") return wo.status === "Declined";
        return wo;
    });

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
            assets={assets}
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
        />
    );
}
