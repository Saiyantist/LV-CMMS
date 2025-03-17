import { useState } from "react";

const Features = () => {
    const features = [
        {
            name: "Work Order",
            image: "/images/lvbuilding.jpg",
            description:
                "Efficiently manage work orders from creation to completion. Assign tasks to specific personnel, track progress in real-time, and ensure timely resolution of maintenance requests. Our system helps reduce downtime, improve workflow, and keep your operations running smoothly by providing detailed tracking and notifications for every work order. Additionally, work order history allows for better decision-making and resource allocation.",
        },
        {
            name: "Asset Management",
            image: "/images/lvbuilding.jpg",
            description:
                "Maintain complete control over all assets by keeping detailed records, tracking lifecycle performance, and scheduling regular inspections. Asset management ensures that equipment, machinery, and resources are always accounted for, minimizing unexpected breakdowns and maximizing efficiency. With automated alerts and comprehensive reporting, you can proactively manage assets to extend their lifespan and reduce operational costs.",
        },
        {
            name: "Preventive Maintenance",
            image: "/images/lvbuilding.jpg",
            description:
                "Reduce equipment failures and costly downtime with a structured preventive maintenance program. Our system enables businesses to schedule routine inspections, automate service reminders, and analyze maintenance trends to predict potential issues before they occur. By staying ahead of equipment failures, organizations can improve operational efficiency, enhance workplace safety, and significantly lower repair expenses over time.",
        },
        {
            name: "Reports & Dashboard",
            image: "/images/lvbuilding.jpg",
            description:
                "Gain valuable insights into operational performance with real-time reports and interactive dashboards. Track key metrics such as maintenance costs, asset performance, and work order completion rates. Customizable reports provide in-depth analysis, helping managers make data-driven decisions to improve productivity, allocate resources efficiently, and identify areas for improvement. The intuitive dashboard offers a visual representation of critical data at a glance.",
        },
        {
            name: "Facility Scheduling",
            image: "/images/lvbuilding.jpg",
            description:
                "Optimize the use of facilities by managing reservations, avoiding conflicts, and ensuring smooth operations. Whether scheduling conference rooms, classrooms, event spaces, or equipment usage, our scheduling system streamlines the process with automated booking, availability tracking, and real-time updates. This prevents double-booking, enhances operational planning, and maximizes the utility of available spaces.",
        },
    ];

    const [selectedFeature, setSelectedFeature] = useState(features[0]);

    const selectedIndex = features.findIndex(
        (feature) => feature.name === selectedFeature.name
    );

    const isEven = selectedIndex % 2 === 0;

    return (
        <section className="text-gray-600 body-font w-full">
            <div className="w-full mx-auto p-5">
                <nav className="flex justify-between items-center w-full px-4">
                    {features.map((feature) => (
                        <button
                            key={feature.name}
                            onClick={() => setSelectedFeature(feature)}
                            className={`flex-1 text-center py-2 text-lg font-semibold transition ${
                                selectedFeature.name === feature.name
                                    ? "underline text-gray-900"
                                    : "hover:underline hover:text-gray-900"
                            }`}
                        >
                            {feature.name}
                        </button>
                    ))}
                </nav>

                <div className="flex flex-col lg:flex-row items-center mt-12 w-full px-4">
                    {isEven ? (
                        <>
                            <div className="w-full lg:w-1/2 flex justify-center">
                                <img
                                    src={selectedFeature.image}
                                    alt={selectedFeature.name}
                                    className="w-[90%] max-w-[500px] h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                                />
                            </div>
                            <div className="w-full lg:w-1/2 lg:pl-10 mt-6 lg:mt-0">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    {selectedFeature.name}
                                </h2>
                                <p className="text-lg text-gray-700">
                                    {selectedFeature.description}
                                </p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-full lg:w-1/2 lg:pr-10 mt-6 lg:mt-0">
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    {selectedFeature.name}
                                </h2>
                                <p className="text-lg text-gray-700">
                                    {selectedFeature.description}
                                </p>
                            </div>
                            <div className="w-full lg:w-1/2 flex justify-center">
                                <img
                                    src={selectedFeature.image}
                                    alt={selectedFeature.name}
                                    className="w-[90%] max-w-[500px] h-auto max-h-[500px] object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Features;
