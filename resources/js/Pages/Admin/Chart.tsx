import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";
import axios from "axios";

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
    Pending: "#1C64F2",
    Assigned: "#22C55E",
    Ongoing: "#FDBA8C",
    Overdue: "#FF0000",
    Completed: "#16A34A",
    "For Budget Request": "#FACC15",
    Declined: "#F87171",
    Cancelled: "#64748B",
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
                            const sum = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
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

const Chart: React.FC = () => {
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
                chartInstance.current.updateOptions(getChartOptions(allStatuses, data), true, true);
                chartInstance.current.updateSeries(data);
            } else {
                chartInstance.current = new ApexCharts(chartRef.current, getChartOptions(allStatuses, data));
                chartInstance.current.render();
            }
        }

        return () => {
            chartInstance.current?.destroy();
            chartInstance.current = null;
        };
    }, [workOrders]);

    const statusTotals = getStatusCounts(workOrders);

    return (
        <div className="w-full flex flex-col md:flex-row gap-6 md:gap-8 bg-white rounded-2xl dark:bg-gray-800 p-4 md:p-8 items-stretch justify-between transition-all duration-300">
            {/* Status Totals */}
            <div className="flex flex-col items-center flex-1">
                <h6 className="font-semibold text-sm mb-4 text-gray-700 dark:text-gray-200 tracking-wide">
                    Status Totals
                </h6>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                    {allStatuses.map((status) => (
                        <div key={status} className="flex flex-col items-center">
                            <div
                                className="w-24 h-14 sm:w-28 sm:h-16 flex items-center justify-center rounded-lg font-bold text-base shadow"
                                style={{
                                    background: statusColors[status],
                                    color: "#fff",
                                }}
                                title={status}
                            >
                                <span>{statusTotals[status]}</span>
                            </div>
                            <span className="text-xs text-gray-700 dark:text-gray-300 mt-1 text-center w-24 break-words font-medium">
                                {status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Donut Chart with Custom Legend */}
            <div className="flex flex-col md:flex-row items-center justify-center flex-1 mt-8 md:mt-0 gap-6">
                {/* Donut Chart */}
                <div
                    ref={chartRef}
                    className="w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[300px] md:h-[300px] transition-all duration-300"
                />

                {/* Custom Legend */}
                <div className="flex flex-col gap-2">
                    {allStatuses.map((status) => (
                        <div key={status} className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: statusColors[status] }}
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">{status}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Chart;
