import React, { useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import CreateAssetModal from "./CreateAssetModal";
import ViewAssetModal from "./ViewAssetModal";
// import { toast } from "sonner"; I will user this for delete action later.
interface Asset {
    id: number;
    name: string;
    specification_details: string;
    location: {
        id: number;
        name: string;
    }
    status: string;
    date_acquired: string;
    last_maintained_at: string;
    maintenance_histories: {
        id: number;
        downtime_reason: string;
        status: string;
        failed_at: string;
        maintained_at: string;
    };
}

const AssetManagement: React.FC = () => {

    const { props } = usePage();
    const assets = props.assets as Asset[]; // Assuming assets are passed as props
    console.log(assets);
    const [selectedAssets, setSelectedAssets] = useState<number[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [viewingAsset, setViewingAsset] = useState<(typeof assets)[0] | null>(
        null
    );

    const handleCheckboxChange = (assetId: number) => {
        setSelectedAssets((prev) =>
            prev.includes(assetId)
                ? prev.filter((id) => id !== assetId)
                : [...prev, assetId]
        );
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedAssets(assets.map((asset) => asset.id));
        } else {
            setSelectedAssets([]);
        }
    };

    return (
        <Authenticated>
            <Head title="Asset Management" />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <header className="mb-6">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-start gap-4 text-black">
                            <h1 className="text-2xl font-semibold text-center sm:text-left">
                                Asset Management
                            </h1>
                            <div className="w-full sm:w-auto flex sm:ml-4 justify-center sm:justify-start">
                                <PrimaryButton
                                    onClick={() => setIsCreating(true)}
                                    className="bg-secondary text-white hover:bg-primary transition-all duration-300 text-sm sm:text-base px-5 py-2 rounded-md"
                                >
                                    Add an Asset
                                </PrimaryButton>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <thead className="bg-secondary text-white">
                            <tr className="border border-white">
                                <th className="p-3 text-center border border-white">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={
                                            selectedAssets.length ===
                                            assets.length
                                        }
                                        className="accent-primary"
                                    />
                                </th>
                                <th className="p-3 text-sm font-semibold border border-white">
                                    ID
                                </th>
                                <th className="p-3 text-sm font-semibold border border-white">
                                    Asset Name
                                </th>
                                <th className="p-3 text-sm font-semibold border border-white">
                                    Specification
                                </th>
                                <th className="p-3 text-sm font-semibold border border-white">
                                    Location
                                </th>
                                <th className="p-3 text-sm font-semibold border border-white">
                                    Condition
                                </th>
                                <th className="p-3 text-sm font-semibold border border-white">
                                    Date Acquired
                                </th>
                                <th className="p-3 text-sm font-semibold border border-white">
                                    Last Maintenance
                                </th>
                                <th className="p-3 text-sm font-semibold border border-white">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset: Asset) => (
                                <tr
                                    key={asset.id}
                                    className="border-b hover:bg-gray-50 transition-colors"
                                >
                                    <td className="p-3 text-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedAssets.includes(
                                                asset.id
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(asset.id)
                                            }
                                            className="accent-primary"
                                        />
                                    </td>
                                    <td className="p-3 text-center">
                                        {asset.id}
                                    </td>
                                    <td className="p-3">
                                        {asset.name}
                                    </td>
                                    <td className="p-3 text-center">
                                        {asset.specification_details}
                                    </td>
                                    <td className="p-3 text-center">
                                        {asset.location.name}
                                    </td>

                                    <td className="p-3 text-center">
                                        {asset.status}
                                    </td>
                                    <td className="p-3 text-center">
                                        {asset.date_acquired}
                                    </td>
                                    <td className="p-3 text-center">
                                        {asset.last_maintained_at}
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                onClick={() =>
                                                    setViewingAsset(asset)
                                                }
                                                className="bg-secondary text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700 transition"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const confirmed =
                                                        window.confirm(
                                                            "Are you sure you want to delete this asset? This action is irreversible and cannot be undone."
                                                        );
                                                    if (confirmed) {
                                                        // Call your delete function here
                                                    }
                                                }}
                                                className="bg-destructive text-white px-3 py-1.5 text-sm rounded-md hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="sm:hidden flex flex-col gap-4 mt-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="bg-white border border-gray-200 rounded-2xl p-4 shadow-md relative"
                        >
                            <div className="absolute top-3 right-3">
                                <input
                                    type="checkbox"
                                    checked={selectedAssets.includes(asset.id)}
                                    onChange={() =>
                                        handleCheckboxChange(asset.id)
                                    }
                                    className="accent-primary"
                                />
                            </div>
                            <div className="space-y-1 pr-8 text-sm text-gray-800">
                                <p>
                                    <span className="font-medium">ID:</span>{" "}
                                    {asset.id}
                                </p>
                                <p>
                                    <span className="font-medium">Name:</span>{" "}
                                    {asset.name}
                                </p>
                                <p>
                                    <span className="font-medium">Spec:</span>{" "}
                                    {asset.specification_details}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Location:
                                    </span>{" "}
                                    {asset.location.name}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Condition:
                                    </span>{" "}
                                    {asset.status}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Acquired:
                                    </span>{" "}
                                    {asset.date_acquired}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Last Maintenance:
                                    </span>{" "}
                                    {asset.last_maintained_at}
                                </p>
                            </div>
                            <div className="mt-4 flex justify-between gap-2">
                                <button
                                    onClick={() => setViewingAsset(asset)}
                                    className="flex-1 bg-secondary text-white px-3 py-2 text-sm rounded-md hover:bg-blue-700 transition"
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => {
                                        const confirmed = window.confirm(
                                            "Are you sure you want to delete this asset? This action is irreversible and cannot be undone."
                                        );
                                        if (confirmed) {
                                            // Call your delete function here
                                        }
                                    }}
                                    className="flex-1 bg-destructive text-white px-3 py-2 text-sm rounded-md hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isCreating && (
                <CreateAssetModal
                    isOpen={isCreating}
                    onClose={() => setIsCreating(false)}
                    onSave={() => setIsCreating(false)}
                />
            )}

            {viewingAsset && (
                <ViewAssetModal
                    data={viewingAsset}
                    onClose={() => setViewingAsset(null)}
                />
            )}
        </Authenticated>
    );
};

export default AssetManagement;
