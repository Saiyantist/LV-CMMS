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

            <div className="p-4 overflow-x-auto">
                <h1 className="text-2xl font-semibold mb-4">Preventive Maintenance</h1>

                <table className="min-w-full table-auto border border-gray-200">
                    <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                            <th className="p-2 text-center">
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedAssets.length === assets.length}
                                />
                            </th>
                            <th className="text-left p-2 text-sm font-semibold">ID</th>
                            <th className="text-left p-2 text-sm font-semibold">Date Submitted</th>
                            <th className="text-left p-2 text-sm font-semibold">Asset Name</th>
                            <th className="text-left p-2 text-sm font-semibold">Description</th>
                            <th className="text-left p-2 text-sm font-semibold">Assign To</th>
                            <th className="text-right p-2 text-sm font-semibold">Status</th>
                            <th className="text-right p-2 text-sm font-semibold">Next Schedule</th>
                            <th className="text-center p-2 text-sm font-semibold">Last Maintenance</th>
                            <th className="text-center p-2 text-sm font-semibold">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assets.map((asset) => (
                            <tr key={asset.id} className="border-b">
                                <td className="p-2 text-center">
                                    <input
                                        type="checkbox"
                                        checked={selectedAssets.includes(asset.id)}
                                        onChange={() => handleCheckboxChange(asset.id)}
                                    />
                                </td>
                                <td className="p-2">{asset.id}</td>
                                <td className="p-2">{asset.dateAcquired}</td>
                                <td className="p-2">{asset.name}</td>
                                <td className="p-2">{asset.specification}</td>
                                <td className="p-2">{asset.location}</td>
                                <td className="p-2 text-right">{asset.condition}</td>
                                <td className="p-2 text-right">TBD</td>
                                <td className="p-2 text-center">{asset.lastMaintenance}</td>
                                <td className="p-4 text-center">
                                    <button className="bg-secondary text-white px-3 py-1.5 rounded-md mr-2 hover:opacity-90">
                                        Edit
                                    </button>
                                    <button className="bg-destructive text-white px-3 py-1.5 rounded-md hover:opacity-90">
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

export default PreventiveMaintenance;
