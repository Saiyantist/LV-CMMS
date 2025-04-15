import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Menu } from "@headlessui/react";

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

            <div className="p-4">
                <h1 className="text-2xl font-semibold mb-4">
                    Preventive Maintenance
                </h1>

                {/* Large screen table */}
                <div className="hidden sm:block overflow-x-auto">
                    <table className="min-w-full table-auto border border-gray-200">
                        <thead className="bg-gray-100 dark:bg-gray-800">
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
                                <th className="text-left p-2 text-sm font-semibold">
                                    ID
                                </th>
                                <th className="text-left p-2 text-sm font-semibold">
                                    Date Submitted
                                </th>
                                <th className="text-left p-2 text-sm font-semibold">
                                    Asset Name
                                </th>
                                <th className="text-left p-2 text-sm font-semibold">
                                    Description
                                </th>
                                <th className="text-left p-2 text-sm font-semibold">
                                    Assign To
                                </th>
                                <th className="text-right p-2 text-sm font-semibold">
                                    Status
                                </th>
                                <th className="text-right p-2 text-sm font-semibold">
                                    Next Schedule
                                </th>
                                <th className="text-center p-2 text-sm font-semibold">
                                    Last Maintenance
                                </th>
                                <th className="text-center p-2 text-sm font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {assets.map((asset) => (
                                <tr key={asset.id} className="border-b">
                                    <td className="p-2 text-center">
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
                                    <td className="p-2 text-right">
                                        {asset.condition}
                                    </td>
                                    <td className="p-2 text-right">TBD</td>
                                    <td className="p-2 text-center">
                                        {asset.lastMaintenance}
                                    </td>
                                    <td className="p-4 text-center">
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

                {/* Mobile card layout */}
                <div className="sm:hidden flex flex-col gap-4">
                    {assets.map((asset) => (
                        <div
                            key={asset.id}
                            className="border rounded-xl p-4 shadow-md bg-white"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-sm font-semibold">
                                    #{asset.id} - {asset.name}
                                </div>
                                <input
                                    type="checkbox"
                                    checked={selectedAssets.includes(asset.id)}
                                    onChange={() =>
                                        handleCheckboxChange(asset.id)
                                    }
                                />
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                                <strong>Date Submitted:</strong>{" "}
                                {asset.dateAcquired}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                                <strong>Description:</strong>{" "}
                                {asset.specification}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                                <strong>Assign To:</strong> {asset.location}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                                <strong>Status:</strong> {asset.condition}
                            </div>
                            <div className="text-sm text-gray-600 mb-1">
                                <strong>Next Schedule:</strong> TBD
                            </div>
                            <div className="text-sm text-gray-600 mb-3">
                                <strong>Last Maintenance:</strong>{" "}
                                {asset.lastMaintenance}
                            </div>
                            <div className="text-right">
                                <Menu>
                                    <Menu.Button className="inline-flex justify-center w-full rounded-md bg-gray-200 px-3 py-2 text-sm font-medium text-black hover:bg-gray-300 focus:outline-none transition">
                                        ⋮
                                    </Menu.Button>
                                    <Menu.Items className="absolute right-4 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                        <div className="py-1">
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() =>
                                                            console.log("Edit")
                                                        }
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100"
                                                                : ""
                                                        } block w-full px-4 py-2 text-sm text-left text-black`}
                                                    >
                                                        Edit
                                                    </button>
                                                )}
                                            </Menu.Item>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() =>
                                                            console.log(
                                                                "Delete"
                                                            )
                                                        }
                                                        className={`${
                                                            active
                                                                ? "bg-gray-100"
                                                                : ""
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

export default PreventiveMaintenance;
