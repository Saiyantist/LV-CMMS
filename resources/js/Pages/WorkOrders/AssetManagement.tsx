import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";

const AssetManagement: React.FC = () => {
    // Dummy data for assets (You can replace this with your actual data from props or state)
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
        // Add more assets here...
    ];

    // State to track selected assets
    const [selectedAssets, setSelectedAssets] = useState<number[]>([]);

    // Toggle selection of an asset
    const handleCheckboxChange = (assetId: number) => {
        setSelectedAssets((prevSelected) =>
            prevSelected.includes(assetId)
                ? prevSelected.filter((id) => id !== assetId)
                : [...prevSelected, assetId]
        );
    };

    // Select/Deselect all assets
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

            <div className="p-4 overflow-x-auto">
                <h1 className="text-2xl font-semibold mb-4">Asset Management</h1>

                <table className="min-w-full table-auto border border-gray-200">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            {/* Checkbox to select/deselect all */}
                            <th className="p-2 text-center">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedAssets.length === assets.length}
                                />
                            </th>
                            <th className="text-left p-2 font-semibold text-sm">ID</th>
                            <th className="text-left p-2 font-semibold text-sm">Asset Name</th>
                            <th className="text-left p-2 font-semibold text-sm">Specification</th>
                            <th className="text-left p-2 font-semibold text-sm">Location</th>
                            <th className="text-left p-2 font-semibold text-sm">Condition</th>
                            <th className="text-right p-2 font-semibold text-sm">Date Acquired</th>
                            <th className="text-right p-2 font-semibold text-sm">Last Maintenance</th>
                            <th className="text-center p-2 font-semibold text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Map over assets and display rows */}
                        {assets.map((asset) => (
                            <tr key={asset.id} className="border-b">
                                <td className="p-2 text-center">
                                    {/* Checkbox for each asset */}
                                    <input
                                        type="checkbox"
                                        checked={selectedAssets.includes(asset.id)}
                                        onChange={() => handleCheckboxChange(asset.id)}
                                    />
                                </td>
                                <td className="p-2">{asset.id}</td>
                                <td className="p-2">{asset.name}</td>
                                <td className="p-2">{asset.specification}</td>
                                <td className="p-2">{asset.location}</td>
                                <td className="p-2">{asset.condition}</td>
                                <td className="p-2 text-right">{asset.dateAcquired}</td>
                                <td className="p-2 text-right">{asset.lastMaintenance}</td>
                                <td className="p-4 text-center">
                                    {/* Action buttons (view, delete) */}
                                    <button className="text-white hover:underline mr-2 bg-secondary px-3 py-1.5 rounded-md">
                                        View
                                    </button>
                                    <button className="text-white hover:underline bg-destructive px-3 py-1.5 rounded-md">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Authenticated>
    );
};

export default AssetManagement;
