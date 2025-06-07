import React from "react";

type GalleryItem = {
    id: number;
    title: string;
    subtitle: string;
    image: string;
};

const galleryItems: GalleryItem[] = [
    {
        id: 1,
        title: "Auditorium",
        subtitle: "Capacities: 300",
        image: "/images/lvbuilding.jpg",
    },
    {
        id: 2,
        title: "Auditorium Lobby",
        subtitle: "Capacities: 500",
        image: "/images/lv1.jpg",
    },
    {
        id: 3,
        title: "College Library",
        subtitle: "Capacities: ",
        image: "/images/lv2.jpg",
    },
    {
        id: 4,
        title: "Meeting Room",
        subtitle: "Capacities: ",
        image: "/images/lv2.jpg",
    },
    {
        id: 5,
        title: "Computer Laboratory A",
        subtitle: "Capacities: ",
        image: "/images/lvbuilding.jpg",
    },
    {
        id: 6,
        title: "Computer Laboratory B",
        subtitle: "Capacities: ",
        image: "/images/lv1.jpg",
    },
    {
        id: 7,
        title: "EFS Classroom(s) Room #:",
        subtitle: "Capacities: ",
        image: "/images/lv1.jpg",
    },
    {
        id: 8,
        title: "LVCC Grounds",
        subtitle: "Capacities: 700 ",
        image: "/images/lv2.jpg",
    },
    {
        id: 9,
        title: "LVCC Main Lobby",
        subtitle: "Capacities: ",
        image: "/images/lvbuilding.jpg",
    },
    {
        id: 10,
        title: "Elementary & High School Library",
        subtitle: "Capacities: ",
        image: "/images/lv2.jpg",
    },
    {
        id: 11,
        title: "Basketball Court",
        subtitle: "Capacities: ",
        image: "/images/lv1.jpg",
    },
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
        <section className="text-gray-700 body-font via-white to-white min-h-screen">
            <div className="text-center text-blue-600 bg-blue-50 p-4 rounded-md">
                <h1 className="text-lg font-medium text-secondary">
                    Selecting a venue is optional. You may proceed without
                    choosing one.
                </h1>
            </div>
            <div className="container px-2 py-6 mx-auto">
                <div className="flex flex-wrap -m-3">
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className={`w-full sm:w-1/2 lg:w-1/3 p-3 transition-transform duration-200 cursor-pointer`}
                            onClick={() => handleSelect(item.id)}
                        >
                            <div
                                className={`flex flex-col bg-white/80 border border-gray-200 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                                    isSelected(item.id)
                                        ? "ring-4 ring-blue-500 shadow-blue-200 scale-105"
                                        : "hover:ring-2 hover:ring-blue-300"
                                }`}
                                style={{
                                    boxShadow: isSelected(item.id)
                                        ? "0 8px 32px 0 rgba(52, 120, 246, 0.18)"
                                        : "0 4px 16px 0 rgba(0,0,0,0.04)",
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-40 object-cover object-center rounded-t-2xl"
                                    style={{
                                        filter: isSelected(item.id)
                                            ? "brightness(1.08) saturate(1.15)"
                                            : "brightness(0.97)",
                                        transition: "filter 0.2s",
                                    }}
                                />
                                <div
                                    className={`p-5 flex-1 flex flex-col justify-center items-center ${
                                        isSelected(item.id)
                                            ? "bg-blue-50/80"
                                            : ""
                                    }`}
                                >
                                    <h1
                                        className={`text-[1.1rem] font-semibold mb-1 tracking-tight ${
                                            isSelected(item.id)
                                                ? "text-blue-700"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        {item.title}
                                    </h1>
                                    <h2
                                        className={`text-xs font-medium mb-1 uppercase tracking-widest ${
                                            isSelected(item.id)
                                                ? "text-blue-500"
                                                : "text-blue-400"
                                        }`}
                                    >
                                        {item.subtitle}
                                    </h2>
                                    {isSelected(item.id) && (
                                        <span className="mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold shadow border border-blue-200">
                                            Selected
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <br />
                {selectedId && selectedId.length > 0 && (
                    <div className="mt-6 flex flex-col items-center">
                        {/* Show label above container on mobile, hide on sm+ */}
                        <span className="font-bold text-blue-600 whitespace-nowrap text-sm mb-2 block sm:hidden">
                            Selected Venue{selectedId.length > 1 ? "s" : ""}:
                        </span>
                        <div
                            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/70 shadow-lg border border-blue-100 backdrop-blur-md"
                            style={{
                                boxShadow:
                                    "0 4px 24px 0 rgba(52, 120, 246, 0.10)",
                                maxWidth: "100vw",
                                overflowX: "auto",
                                WebkitOverflowScrolling: "touch",
                            }}
                        >
                            {/* Hide label inside container on mobile, show on sm+ */}
                            <span className="font-bold text-blue-600 whitespace-nowrap text-sm sm:text-base hidden sm:block">
                                Selected Venue{selectedId.length > 1 ? "s" : ""}
                                :
                            </span>
                            <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-50">
                                {galleryItems
                                    .filter((item) =>
                                        selectedId.includes(item.id)
                                    )
                                    .map((item) => (
                                        <span
                                            key={item.id}
                                            className="px-3 py-1 rounded-full bg-blue-100/90 text-blue-700 font-medium shadow border border-blue-200 text-xs sm:text-sm"
                                            style={{
                                                backdropFilter: "blur(2px)",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {item.title}
                                        </span>
                                    ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export type { GalleryItem };
export { galleryItems };
export default Gallery;
