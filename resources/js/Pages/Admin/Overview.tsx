import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";
import { Link } from "@inertiajs/react";

interface WorkOrder {
    status: string;
}

const allStatuses = [
    "Pending",
    "Assigned",
    "Ongoing",
    "Overdue",
    "Completed",
    "For Budget Request",
    "Declined",
    "Cancelled",
];

const statusColors: Record<string, string> = {
    Pending: "#cbd5e1", // bg-slate-300
    Assigned: "#60A5FA", // bg-blue-400
    Ongoing: "#fde68a", // bg-amber-200
    Overdue: "#F87171", // bg-red-400
    Completed: "#4ADE80", // bg-green-400
    "For Budget Request": "#fdba74", // bg-orange-300
    Declined: "#fb7185", // bg-rose-400
    Cancelled: "#fecdd3", // bg-rose-200
};

const getStatusCounts = (workOrders: WorkOrder[] = []) => {
    const counts: Record<string, number> = {};
    allStatuses.forEach((status) => (counts[status] = 0));
    for (const wo of workOrders) {
        if (counts.hasOwnProperty(wo.status)) {
            counts[wo.status]++;
        }
    }
    return counts;
};

const getChartOptions = (labels: string[], data: number[]) => ({
    series: data,
    colors: labels.map((label) => statusColors[label]),
    chart: {
        height: 320,
        width: "100%",
        type: "donut",
    },
    stroke: {
        colors: ["transparent"],
    },
    plotOptions: {
        pie: {
            donut: {
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontFamily: "Inter, sans-serif",
                        offsetY: 20,
                    },
                    total: {
                        showAlways: true,
                        show: true,
                        label: "Total Work Orders",
                        fontFamily: "Inter, sans-serif",
                        formatter: function (w: any) {
                            const sum = w.globals.seriesTotals.reduce(
                                (a: number, b: number) => a + b,
                                0
                            );
                            return `${sum}`;
                        },
                    },
                    value: {
                        show: true,
                        fontFamily: "Inter, sans-serif",
                        offsetY: -20,
                        formatter: function (value: number) {
                            return `${value}`;
                        },
                    },
                },
                size: "80%",
            },
        },
    },
    labels,
    dataLabels: {
        enabled: false,
    },
    legend: {
        show: false,
    },
});

const Overview: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<ApexCharts | null>(null);
    const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

    useEffect(() => {
        axios
            .get("/api/work-orders/statuses")
            .then((res) => setWorkOrders(res.data))
            .catch(() => setWorkOrders([]));
    }, []);

    useEffect(() => {
        if (workOrders.length === 0) return;

        const counts = getStatusCounts(workOrders);
        const data = allStatuses.map((status) => counts[status]);

        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.updateOptions(
                    getChartOptions(allStatuses, data),
                    true,
                    true
                );
                chartInstance.current.updateSeries(data);
            } else {
                chartInstance.current = new ApexCharts(
                    chartRef.current,
                    getChartOptions(allStatuses, data)
                );
                chartInstance.current.render();
            }
        }

        return () => {
            chartInstance.current?.destroy();
            chartInstance.current = null;
        };
    }, [workOrders]);

    const statusTotals = getStatusCounts(workOrders);
    const totalWorkOrders = Object.values(statusTotals).reduce((sum, count) => sum + count, 0)
    const pendingRequests = statusTotals["Pending"] || 0
  

    // Main status cards to display
    const mainStatusCards = [
        { label: "Assigned", value: statusTotals["Assigned"], color: statusColors["Assigned"] },
        { label: "On Going", value: statusTotals["Ongoing"], color: statusColors["Ongoing"] },
        { label: "Completed", value: statusTotals["Completed"], color: statusColors["Completed"] },
        { label: "Overdue", value: statusTotals["Overdue"], color: statusColors["Overdue"] },
    ]

    return (
        <div className="w-full flex flex-col xl:flex-row gap-6 rounded-2xl dark:bg-gray-800 items-center transition-all duration-300">
            
            
            {/* Left Section - Status Cards */}
            <div className="flex-[3] w-full space-y-4">
                    <h1 className="text-2xl font-bold text-white dark:text-gray-900">Dashboard: <span className="font-light">Overview of Work Orders</span></h1>
                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Total Work Orders Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="text-sm font-medium text-secondary dark:text-gray-400 mb-1">Total Work Orders</div>
                        <div className="text-3xl md:text-4xl font-bold text-primary dark:text-white">{totalWorkOrders}</div>
                    </div>

                    {/* Pending Requests Card */}
                    <Link href={route("work-orders.index")} className="hover:scale-105 transition-all duration-300">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                            <div className="text-sm font-medium text-secondary dark:text-gray-400 mb-1">Pending Requests</div>
                            <div className="text-3xl md:text-4xl font-bold text-primary dark:text-white">{pendingRequests}</div>
                        </div>
                    </Link>
                </div>

                {/* Status Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
                    {mainStatusCards.map((card) => (
                    <div
                        key={card.label}
                        className="bg-white dark:bg-gray-800 rounded-lg p-3 md:p-4 shadow-sm border border-gray-200 dark:border-gray-700 text-center"
                    >
                        <div className="text-xs md:text-sm font-medium text-secondary dark:text-gray-400 mb-2">{card.label}</div>
                        <div className="text-xl md:text-2xl font-bold text-primary dark:text-white">{card.value}</div>
                    </div>
                    ))}
                </div>
            </div>

            {/* Donut Chart with Custom Legend */}
            <div className="flex flex-[2] w-full flex-col xs:flex-row self-end justify-around gap-2 bg-white border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-2">
                {/* Donut Chart */}
                <div
                    ref={chartRef}
                    className="w-[12rem] h-[12rem] sm:w-[15rem] sm:h-[15rem] transition-all duration-300 self-center"
                />

                {/* Custom Legend */}
                <div className="grid grid-cols-2 sm:flex sm:flex-col gap-2 justify-center">
                    {allStatuses.map((status) => (
                        <div key={status} className="flex items-center ml-4 gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: statusColors[status],
                                }}
                            />
                            <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300">
                                {status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Overview;
