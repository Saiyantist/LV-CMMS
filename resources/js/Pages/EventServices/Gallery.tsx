import React from "react";

type GalleryItem = {
    id: number;
    title: string;
    subtitle: string;
    description: string;
};

const galleryItems: GalleryItem[] = [
    {
        id: 1,
        title: "Auddy Lobby",
        subtitle: "Capacities: 300",
        description:
            "Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.",
    },
    {
        id: 2,
        title: "Main Conference Hall",
        subtitle: "Capacities: 500",
        description:
            "Spacious area suitable for large-scale meetings and events with advanced AV setup.",
    },
    {
        id: 3,
        title: "Outdoor Garden",
        subtitle: "Capacities: 200",
        description:
            "Perfect for casual gatherings, small ceremonies, and open-air functions.",
    },
    {
        id: 4,
        title: "Executive Lounge",
        subtitle: "Capacities: 50",
        description:
            "Premium lounge area designed for high-level discussions in a quiet atmosphere.",
    },
    {
        id: 5,
        title: "Training Room A",
        subtitle: "Capacities: 100",
        description:
            "Equipped with projectors and whiteboards, ideal for workshops and training sessions.",
    },
    {
        id: 6,
        title: "Studio Room",
        subtitle: "Capacities: 80",
        description:
            "Soundproofed studio suitable for recording, podcasts, and digital production events.",
    },
];

interface GalleryProps {
    selectedId: number | null;
    onSelect: (id: number | null) => void;
}

const Gallery: React.FC<GalleryProps> = ({ selectedId, onSelect }) => {
    const selectedItem = galleryItems.find((item) => item.id === selectedId);

    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-12 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className={`lg:w-1/3 sm:w-1/2 p-4 cursor-pointer transition-transform ${
                                selectedId === item.id
                                    ? "ring-4 ring-blue-500 scale-105"
                                    : "hover:ring-2 hover:ring-gray-300"
                            }`}
                            onClick={() =>
                                onSelect(selectedId === item.id ? null : item.id)
                            }
                        >
                            <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
                                <img
                                    src="/images/lvbuilding.jpg"
                                    alt={item.title}
                                    className="w-full h-48 object-cover object-center"
                                />
                                <div className="p-6">
                                    <h2 className="text-sm text-indigo-500 font-semibold mb-1 uppercase tracking-wide">
                                        {item.subtitle}
                                    </h2>
                                    <h1 className="text-lg font-bold text-gray-900 mb-2">
                                        {item.title}
                                    </h1>
                                    <p className="text-sm text-gray-700">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {selectedItem && (
                    <p className="mt-6 text-center text-blue-600 font-medium">
                        Selected Venue: "{selectedItem.title}"
                    </p>
                )}
            </div>
        </section>
    );
};

export default Gallery;
