import React, { useState } from "react";

// Static feature data
const features = [
    {
        name: "Work Order",
        image: "/images/workorder.png",
        description:
            "Efficiently manage work orders from creation to completion. Assign tasks to specific personnel, track progress in real-time, and ensure timely resolution of maintenance requests.",
    },
    {
        name: "Asset Management",
        image: "/images/workorder.png",
        description:
            "Maintain complete control over all assets by keeping detailed records, tracking lifecycle performance, and scheduling regular inspections.",
    },
    {
        name: "Preventive Maintenance",
        image: "/images/workorder.png",
        description:
            "Reduce equipment failures and costly downtime with a structured preventive maintenance program. Schedule routine inspections and automate service reminders.",
    },
    {
        name: "Reports & Dashboard",
        image: "/images/workorder.png",
        description:
            "Gain valuable insights into operational performance with real-time reports and interactive dashboards. Track key metrics for better decision-making.",
    },
    {
        name: "Facility Scheduling",
        image: "/images/workorder.png",
        description:
            "Optimize the use of facilities by managing reservations, avoiding conflicts, and ensuring smooth operations with real-time updates.",
    },
];

const Features: React.FC = () => {
    // State to track selected feature
    const [selectedFeature, setSelectedFeature] = useState(features[0]);

    return (
        <section className="w-full text-gray-600 body-font" id="features">
            <div className="w-full mx-auto p-5 max-w-7xl">
                {/* Feature Title */}
                <h1 className="text-4xl font-bold text-center text-bluetitle mb-8">
                    Features
                </h1>

                {/* Feature Navigation Buttons */}
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

                {/* Feature Content Section */}
                <div className="flex flex-col lg:flex-row items-center mt-12 w-full px-4">
                    <FeatureLayout feature={selectedFeature} />
                </div>
            </div>
        </section>
    );
};

// Feature Layout with Conditional Rendering
const FeatureLayout: React.FC<{ feature: any }> = ({ feature }) => {
    const isEven =
        features.findIndex((f) => f.name === feature.name) % 2 === 0;

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

// Reusable Feature Content component
const FeatureContent: React.FC<{ name: string; description: string }> = ({
    name,
    description,
}) => (
    <div className="w-full lg:w-1/2 lg:pl-10 mt-6 lg:mt-0">
        <h2 className="text-3xl font-bold text-bluetitle mb-4">{name}</h2>
        <p className="text-lg text-bluetext leading-relaxed">{description}</p>
    </div>
);

// Reusable Feature Image component
const FeatureImage: React.FC<{ image: string; name: string }> = ({
    image,
    name,
}) => (
    <div className="w-full lg:w-1/2 flex justify-center">
        <img
            src={image}
            alt={`${name} illustration`}
            className="w-[90%] max-w-[500px] h-auto max-h-[500px] object-cover"
        />
    </div>
);

export default Features;
