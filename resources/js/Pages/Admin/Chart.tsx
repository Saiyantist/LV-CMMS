import React, { useEffect, useRef, useState } from "react";
import ApexCharts from "apexcharts";

// Chart options with updated labels
const getChartOptions = (data: number[]) => ({
    series: data,
    colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"], // Color mapping
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
                            return `${sum} Work Orders`;
                        },
                    },
                    value: {
                        show: true,
                        fontFamily: "Inter, sans-serif",
                        offsetY: -20,
                        formatter: function (value: number) {
                            return `${value} Work Orders`;
                        },
                    },
                },
                size: "80%",
            },
        },
    },
    grid: {
        padding: {
            top: -2,
        },
    },
    labels: ["Pending", "Accepted", "For Budget Request", "Declined"], // Updated labels
    dataLabels: {
        enabled: false,
    },
    legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
    },
});

const Chart: React.FC = () => {
    const chartRef = useRef<HTMLDivElement>(null);
    const chartInstance = useRef<ApexCharts | null>(null);

    // Example data for the statuses (you can replace this with dynamic data)
    const [chartData, setChartData] = useState([35, 25, 15, 5]); // Pending, Accepted, For Budget Request, Declined

    // Update chart data when the component is mounted or data changes
    useEffect(() => {
        if (chartRef.current) {
            chartInstance.current = new ApexCharts(
                chartRef.current,
                getChartOptions(chartData) // Pass dynamic data
            );
            chartInstance.current.render();
        }

        return () => {
            chartInstance.current?.destroy();
        };
    }, [chartData]); // Re-render when chartData changes

    // Function to simulate fetching or processing data dynamically
    const fetchData = () => {
        // Simulate fetching work order data (replace with actual data)
        const fetchedData = [40, 30, 20, 10]; // Example data (Pending, Accepted, For Budget Request, Declined)
        setChartData(fetchedData); // Update chartData state
    };

    useEffect(() => {
        fetchData(); // Fetch data when the component is mounted
    }, []);

    return (
        <div className="max-w-sm w-full bg-white rounded-lg shadow-sm dark:bg-gray-800 p-4 md:p-6">
            {/* Header */}
            <div className="flex justify-between mb-3">
                <div className="flex justify-center items-center">
                    <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white pe-1">
                        Work Order Statuses
                    </h5>
                </div>
            </div>

            {/* Chart */}
            <div className="py-6">
                <div ref={chartRef} />
            </div>

            {/* Footer */}
            <div className="grid grid-cols-1 items-center border-gray-200 border-t dark:border-gray-700 justify-between">
                <div className="flex justify-between items-center pt-5">
                    <button
                        className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-center inline-flex items-center"
                        type="button"
                    >
                        Last 7 days
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chart;
    