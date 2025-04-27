import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

const AssetManagement: React.FC = () => {
    const assets = [
        {
            id: 1,
            name: "Asset 1",
            specification: "Spec 1",
            location: "Location 1",
            condition: "Good",
            dateAcquired: "2023-01-01",
            lastMaintenance: "2023-04-10",
        },
        {
            id: 2,
            name: "Asset 2",
            specification: "Spec 2",
            location: "Location 2",
            condition: "Fair",
            dateAcquired: "2022-06-15",
            lastMaintenance: "2023-02-20",
        },
    ];

    const [selectedAssets, setSelectedAssets] = useState<number[]>([]);

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

            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-4">
                    Asset Management
                </h1>

                {/* Desktop Table View */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                        <thead className="bg-secondary dark:bg-gray-800 text-white dark:text-white">
                            <tr>
                                <th className="p-3 text-center">
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
                                <th className="text-auto border p-3 text-sm font-semibold">
                                    ID
                                </th>
                                <th className="text-auto border p-3 text-sm font-semibold">
                                    Asset Name
                                </th>
                                <th className="text-auto border p-3 text-sm font-semibold">
                                    Specification
                                </th>
                                <th className="text-auto border p-3 text-sm font-semibold">
                                    Location
                                </th>
                                <th className="text-auto border p-3 text-sm font-semibold">
                                    Condition
                                </th>
                                <th className="text-auto border p-3 text-sm font-semibold">
                                    Date Acquired
                                </th>
                                <th className="text-auto border border p-3 text-sm font-semibold">
                                    Last Maintenance
                                </th>
                                <th className="text-auto border p-3 text-sm font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
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
                                    <td className="p-3">{asset.id}</td>
                                    <td className="p-3">{asset.name}</td>
                                    <td className="p-3">
                                        {asset.specification}
                                    </td>
                                    <td className="p-3">{asset.location}</td>
                                    <td className="p-3">{asset.condition}</td>
                                    <td className="p-3 text-right">
                                        {asset.dateAcquired}
                                    </td>
                                    <td className="p-3 text-right">
                                        {asset.lastMaintenance}
                                    </td>
                                    <td className="p-3 text-center">
                                        <div className="flex justify-center gap-2">
                                            <button className="bg-secondary text-white px-3 py-1.5 text-sm rounded-md hover:bg-blue-700 transition">
                                                View
                                            </button>
                                            <button className="bg-destructive text-white px-3 py-1.5 text-sm rounded-md hover:bg-red-700 transition">
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
                            {/* Top-right Checkbox */}
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

                            {/* Info Section */}
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
                                    {asset.specification}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Location:
                                    </span>{" "}
                                    {asset.location}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Condition:
                                    </span>{" "}
                                    {asset.condition}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Acquired:
                                    </span>{" "}
                                    {asset.dateAcquired}
                                </p>
                                <p>
                                    <span className="font-medium">
                                        Last Maintenance:
                                    </span>{" "}
                                    {asset.lastMaintenance}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="flex-1 bg-secondary text-white px-3 py-2 text-sm rounded-md hover:bg-blue-700 transition">
                                    View
                                </button>
                                <button className="flex-1 bg-destructive text-white px-3 py-2 text-sm rounded-md hover:bg-red-700 transition">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Authenticated>
    );
};

export default AssetManagement;
