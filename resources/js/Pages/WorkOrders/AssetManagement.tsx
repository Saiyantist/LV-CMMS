import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Menu } from "@headlessui/react";

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
                <h1 className="text-2xl font-semibold mb-4">Asset Management</h1>

                {/* Large screen table */}
                <div className="hidden sm:block overflow-x-auto">
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
                                <th className="text-left p-2 text-sm font-semibold">Asset Name</th>
                                <th className="text-left p-2 text-sm font-semibold">Specification</th>
                                <th className="text-left p-2 text-sm font-semibold">Location</th>
                                <th className="text-left p-2 text-sm font-semibold">Condition</th>
                                <th className="text-right p-2 text-sm font-semibold">Date Acquired</th>
                                <th className="text-right p-2 text-sm font-semibold">Last Maintenance</th>
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
                                    <td className="p-2">{asset.name}</td>
                                    <td className="p-2">{asset.specification}</td>
                                    <td className="p-2">{asset.location}</td>
                                    <td className="p-2">{asset.condition}</td>
                                    <td className="p-2 text-right">{asset.dateAcquired}</td>
                                    <td className="p-2 text-right">{asset.lastMaintenance}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <button className="bg-secondary text-white px-4 py-2 text-sm rounded-md hover:opacity-90 transition">
                                                View
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

                {/* Mobile card view */}
                <div className="sm:hidden flex flex-col gap-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="bg-white border rounded-xl p-4 shadow-sm relative"
                        >
                            {/* Checkbox at top-right */}
                            <div className="absolute top-3 right-3">
                                <input
                                    type="checkbox"
                                    checked={selectedAssets.includes(asset.id)}
                                    onChange={() => handleCheckboxChange(asset.id)}
                                />
                            </div>

                            <div className="space-y-1 pr-6">
                                <p><span className="font-semibold">ID:</span> {asset.id}</p>
                                <p><span className="font-semibold">Name:</span> {asset.name}</p>
                                <p><span className="font-semibold">Spec:</span> {asset.specification}</p>
                                <p><span className="font-semibold">Location:</span> {asset.location}</p>
                                <p><span className="font-semibold">Condition:</span> {asset.condition}</p>
                                <p><span className="font-semibold">Acquired:</span> {asset.dateAcquired}</p>
                                <p><span className="font-semibold">Last Maintenance:</span> {asset.lastMaintenance}</p>
                            </div>

                            {/* 3-dots dropdown at bottom */}
                            <div className="mt-4">
                                <Menu as="div" className="relative inline-block text-left w-full">
                                    <div>
                                        <Menu.Button className="w-full justify-center inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 rounded-md">
                                            ⋮
                                        </Menu.Button>
                                    </div>

                                    <Menu.Items className="absolute bottom-full right-0 mb-2 w-36 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => console.log("View")}
                                                        className={`${
                                                            active ? "bg-gray-100" : ""
                                                        } block w-full px-4 py-2 text-sm text-left text-black`}
                                                    >
                                                        View
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => console.log("Delete")}
                                                        className={`${
                                                            active ? "bg-gray-100" : ""
                                                        } block w-full px-4 py-2 text-sm text-left text-red-600`}
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </div>
                                    </Menu.Items>
                                </Menu>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Authenticated>
    );
};

export default AssetManagement;
