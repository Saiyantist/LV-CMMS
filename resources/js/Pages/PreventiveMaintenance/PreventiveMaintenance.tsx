import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

const PreventiveMaintenance: React.FC = () => {
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
        setSelectedAssets((prevSelected) =>
            prevSelected.includes(assetId)
                ? prevSelected.filter((id) => id !== assetId)
                : [...prevSelected, assetId]
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
            <Head title="Preventive Maintenance" />

            <header className="mx-auto max-w-7xl sm:px-6 lg:px-8 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold">
                        Preventive Maintenance
                    </h1>
                </div>
            </header>

            <div className="p-4">
                {/* Desktop Table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200">
                        <thead className="bg-secondary dark:bg-gray-800">
                            <tr>
                                <th className="p-2 text-center">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={
                                            selectedAssets.length ===
                                            assets.length
                                        }
                                    />
                                </th>
                                <th className="text-auto bg-secondary text-white border p-3 text-sm font-semibold">
                                    ID
                                </th>
                                <th className="text-auto bg-secondary text-white border p-3 text-sm font-semibold">
                                    Date Submitted
                                </th>
                                <th className="text-auto bg-secondary text-white border p-3 text-sm font-semibold">
                                    Asset Name
                                </th>
                                <th className="text-auto bg-secondary text-white border p-3 text-sm font-semibold">
                                    Description
                                </th>
                                <th className="text-auto bg-secondary text-white border p-3 text-sm font-semibold">
                                    Assign To
                                </th>
                                <th className="text-auto bg-secondary text-white border p-3 text-sm font-semibold">
                                    Status
                                </th>
                                <th className="text-auto bg-secondary text-white border p-3 text-sm font-semibold">
                                    Next Schedule
                                </th>
                                <th className="text-auto bg-secondary text-white border p-3 text-sm font-semibold">
                                    Last Maintenance
                                </th>
                                <th className="text-auto bg-secondary text-white border p-3 text-sm font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr
                                    key={asset.id}
                                    className="border-b text-center"
                                >
                                    <td className="p-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedAssets.includes(
                                                asset.id
                                            )}
                                            onChange={() =>
                                                handleCheckboxChange(asset.id)
                                            }
                                        />
                                    </td>
                                    <td className="p-2">{asset.id}</td>
                                    <td className="p-2">
                                        {asset.dateAcquired}
                                    </td>
                                    <td className="p-2">{asset.name}</td>
                                    <td className="p-2">
                                        {asset.specification}
                                    </td>
                                    <td className="p-2">{asset.location}</td>
                                    <td className="p-2">{asset.condition}</td>
                                    <td className="p-2">TBD</td>
                                    <td className="p-2">
                                        {asset.lastMaintenance}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center items-center gap-2">
                                            <button className="bg-secondary text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                                                Edit
                                            </button>
                                            <button className="bg-destructive text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="sm:hidden flex flex-col gap-4 mt-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="border rounded-2xl p-4 shadow-md bg-white relative"
                        >
                            {/* Checkbox in top-right */}
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

                            {/* Details */}
                            <div className="text-sm text-gray-800 space-y-1 pr-8">
                                <p>
                                    <strong>ID:</strong> {asset.id}
                                </p>
                                <p>
                                    <strong>Date Submitted:</strong>{" "}
                                    {asset.dateAcquired}
                                </p>
                                <p>
                                    <strong>Name:</strong> {asset.name}
                                </p>
                                <p>
                                    <strong>Description:</strong>{" "}
                                    {asset.specification}
                                </p>
                                <p>
                                    <strong>Assign To:</strong> {asset.location}
                                </p>
                                <p>
                                    <strong>Status:</strong> {asset.condition}
                                </p>
                                <p>
                                    <strong>Next Schedule:</strong> TBD
                                </p>
                                <p>
                                    <strong>Last Maintenance:</strong>{" "}
                                    {asset.lastMaintenance}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-4 flex justify-between gap-2">
                                <button className="flex-1 bg-secondary text-white px-3 py-2 text-sm rounded-md hover:opacity-90 transition">
                                    Edit
                                </button>
                                <button className="flex-1 bg-destructive text-white px-3 py-2 text-sm rounded-md hover:opacity-90 transition">
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

export default PreventiveMaintenance;
