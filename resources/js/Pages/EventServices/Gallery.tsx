import React from "react";

type GalleryItem = {
    id: number;
    title: string;
    subtitle: string;
};

const galleryItems: GalleryItem[] = [
    { id: 1, title: "Auditorium", subtitle: "Capacities: 300" },
    { id: 2, title: "Auditorium Lobby", subtitle: "Capacities: 500" },
    { id: 3, title: "College Library", subtitle: "Capacities: " },
    { id: 4, title: "Meeting Room", subtitle: "Capacities: " },
    { id: 5, title: "Training Room A", subtitle: "Capacities: " },
    { id: 6, title: "Computer Laboratory A", subtitle: "Capacities: " },
    { id: 7, title: "Computer Laboratory B", subtitle: "Capacities: " },
    { id: 8, title: "EFS Classroom(s) Room #:", subtitle: "Capacities: " },
    { id: 9, title: "LVCC Grounds", subtitle: "Capacities: 700 " },
    { id: 10, title: "LVCC  Main Lobby", subtitle: "Capacities: " },
    {
        id: 11,
        title: "Elementary & High School Library",
        subtitle: "Capacities: ",
    },
    { id: 12, title: "Basketball Court", subtitle: "Capacities: " },
];

interface GalleryProps {
    selectedId: number[] | null;
    onSelect: (id: number[] | null) => void;
}

const Gallery: React.FC<GalleryProps> = ({ selectedId, onSelect }) => {
    const isSelected = (id: number) => selectedId?.includes(id);

    const handleSelect = (id: number) => {
        if (!selectedId) {
            onSelect([id]);
        } else if (selectedId.includes(id)) {
            const updated = selectedId.filter((i) => i !== id);
            onSelect(updated.length > 0 ? updated : null);
        } else {
            onSelect([...selectedId, id]);
        }
    };

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
                                isSelected(item.id)
                                    ? "ring-4 ring-secondary scale-105"
                                    : "hover:ring-2 hover:ring-secondary"
                            }`}
                            onClick={() => handleSelect(item.id)}
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
                {selectedId && selectedId.length > 0 && (
                    <p className="mt-6 text-center text-secondary font-medium">
                        Selected Venue{selectedId.length > 1 ? "s" : ""}:{" "}
                        {galleryItems
                            .filter((item) => selectedId.includes(item.id))
                            .map((item) => `"${item.title}"`)
                            .join(", ")}
                    </p>
                )}
            </div>
        </section>
    );
};

export type { GalleryItem };
export { galleryItems };
export default Gallery;
