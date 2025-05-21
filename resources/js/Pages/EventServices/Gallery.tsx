import React from "react";

type GalleryItem = {
    id: number;
    title: string;
    subtitle: string;
};

const galleryItems: GalleryItem[] = [
    {
        id: 1,
        title: "Auditorium Lobby",
        subtitle: "Capacities: 300",
    },
    {
        id: 2,
        title: "Main Conference Hall",
        subtitle: "Capacities: 500",
    },
    {
        id: 3,
        title: "Outdoor Garden",
        subtitle: "Capacities: 200",
    },
    {
        id: 4,
        title: "Executive Lounge",
        subtitle: "Capacities: 50",
    },
    {
        id: 5,
        title: "Training Room A",
        subtitle: "Capacities: 100",
    },
    {
        id: 6,
        title: "Studio Room",
        subtitle: "Capacities: 80",
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
            <div className="text-center text-blue-600 bg-blue-50 p-4 rounded-md">
                <h1 className="text-secondary font-medium">
                    Selecting a venue is optional. You may proceed without
                    choosing one.
                </h1>
            </div>
            <div className="container px-5 py-12 mx-auto">
                <div className="flex flex-wrap -m-4">
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className={`lg:w-1/3 sm:w-1/2 p-4 cursor-pointer transition-transform ${
                                selectedId === item.id
                                    ? "ring-4 ring-secondary scale-105"
                                    : "hover:ring-2 hover:ring-secondary"
                            }`}
                            onClick={() =>
                                onSelect(
                                    selectedId === item.id ? null : item.id
                                )
                            }
                        >
                            <div className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow duration-300">
                                <img
                                    src="/images/lvbuilding.jpg"
                                    alt={item.title}
                                    className="w-full h-48 object-cover object-center"
                                />
                                <div className="p-6">
                                    <h1 className="text-lg font-bold text-gray-900 mb-2">
                                        {item.title}
                                    </h1>
                                    <h2 className="text-sm text-secondary font-semibold mb-1 uppercase tracking-wide">
                                        {item.subtitle}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <br />
                {selectedItem && (
                    <p className="mt-6 text-center text-secondary font-medium">
                        Selected Venue: "{selectedItem.title}"
                    </p>
                )}
            </div>
        </section>
    );
};

export default Gallery;
