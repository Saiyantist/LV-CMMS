import React, { useState, useRef } from "react";

const features = [
    {
        name: "Work Order",
        image: "/images/workorder.png",
        description:
            "Efficiently manage work orders from creation to completion. Assign tasks to specific personnel, track progress in real-time, and ensure timely resolution of maintenance requests.",
    },
    {
        name: "Asset Management",
        image: "/images/report.png",
        description:
            "Maintain complete control over all assets by keeping detailed records, tracking lifecycle performance, and scheduling regular inspections.",
    },
    {
        name: "Preventive Maintenance",
        image: "/images/pms.png",
        description:
            "Reduce equipment failures and costly downtime with a structured preventive maintenance program. Schedule routine inspections and automate service reminders.",
    },
    {
        name: "Reports & Dashboard",
        image: "/images/report.png",
        description:
            "Gain valuable insights into operational performance with real-time reports and interactive dashboards. Track key metrics for better decision-making.",
    },
    {
        name: "Event Services",
        image: "/images/calendar.png",
        description:
            "Optimize the use of facilities by managing reservations, avoiding conflicts, and ensuring smooth operations with real-time updates.",
    },
];

const Features: React.FC = () => {
    const [selectedFeature, setSelectedFeature] = useState(features[0]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
    };

    return (
        <section className="w-full text-gray-600 body-font" id="features">
            <div className="w-full mx-auto p-5 max-w-7xl">
                <h1 className="text-4xl font-bold text-center text-bluetitle mb-8">
                    Features
                </h1>

                {/* Tabs + Content: only for large screens */}
                <div className="hidden lg:block">
                    <nav
                        className="flex justify-between items-center w-full px-4 space-x-2 overflow-x-auto"
                        aria-label="Feature Navigation"
                    >
                        {features.map((feature) => (
                            <button
                                key={feature.name}
                                onClick={() => setSelectedFeature(feature)}
                                className={`flex-1 text-center py-2 text-lg font-semibold text-bluetext transition ${
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
                        <FeatureLayout feature={selectedFeature} />
                    </div>
                </div>

                {/* Carousel for mobile only */}
                <div className="lg:hidden relative mt-6">
                    {/* Arrows */}
                    <button
                        onClick={scrollLeft}
                        className="absolute left-2 top-1/3 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full shadow p-2"
                    >
                        ←
                    </button>
                    <button
                        onClick={scrollRight}
                        className="absolute right-2 top-1/3 transform -translate-y-1/2 z-10 bg-white bg-opacity-80 rounded-full shadow p-2"
                    >
                        →
                    </button>

                    {/* Scrollable container */}
                    <div
                        ref={scrollRef}
                        className="flex overflow-x-auto space-x-4 px-2 snap-x snap-mandatory scroll-smooth"
                    >
                        {features.map((feature) => (
                            <div
                                key={feature.name}
                                className="flex-shrink-0 w-80 snap-center bg-white rounded-lg shadow p-4"
                            >
                                <img
                                    src={feature.image}
                                    alt={feature.name}
                                    className="w-full max-h-60 object-contain rounded"
                                />
                                <h2 className="text-xl font-semibold text-bluetitle mt-4 mb-2">
                                    {feature.name}
                                </h2>
                                <p className="text-bluetext text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

const FeatureLayout: React.FC<{ feature: any }> = ({ feature }) => {
    const isEven = features.findIndex((f) => f.name === feature.name) % 2 === 0;

    return (
        <div className="flex flex-col lg:flex-row items-center w-full">
            {isEven ? (
                <>
                    <FeatureImage image={feature.image} name={feature.name} />
                    <FeatureContent
                        name={feature.name}
                        description={feature.description}
                    />
                </>
            ) : (
                <>
                    <FeatureContent
                        name={feature.name}
                        description={feature.description}
                    />
                    <FeatureImage image={feature.image} name={feature.name} />
                </>
            )}
        </div>
    );
};

const FeatureContent: React.FC<{ name: string; description: string }> = ({
    name,
    description,
}) => (
    <div className="w-full lg:w-1/2 lg:pl-10 mt-6 lg:mt-0">
        <h2 className="text-3xl font-bold text-bluetitle mb-4">{name}</h2>
        <p className="text-lg text-bluetext leading-relaxed">{description}</p>
    </div>
);

const FeatureImage: React.FC<{ image: string; name: string }> = ({
    image,
    name,
}) => (
    <div className="w-full lg:w-1/2 flex justify-center">
        <img
            src={image}
            alt={`${name} illustration`}
            className="w-full max-w-[500px] h-auto object-contain rounded"
        />
    </div>
);

export default Features;
