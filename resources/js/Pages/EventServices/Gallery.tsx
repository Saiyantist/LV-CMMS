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
        title: "Auddy Lobby",
        subtitle: "Capacities: 300",
        description:
            "Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.",
    },
    {
        id: 3,
        title: "Auddy Lobby",
        subtitle: "Capacities: 300",
        description:
            "Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.",
    },
    {
        id: 4,
        title: "Auddy Lobby",
        subtitle: "Capacities: 300",
        description:
            "Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.",
    },
    {
        id: 5,
        title: "Auddy Lobby",
        subtitle: "Capacities: 300",
        description:
            "Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.",
    },
    {
        id: 6,
        title: "Auddy Lobby",
        subtitle: "Capacities: 300",
        description:
            "Photo booth fam kinfolk cold-pressed sriracha leggings jianbing microdosing tousled waistcoat.",
    },
];

interface GalleryProps {
    selectedId?: number | null;
    onSelect?: (id: number) => void;
}

const Gallery: React.FC<GalleryProps> = ({ selectedId, onSelect }) => {
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
                                    : "hover:ring-2 hover:ring-blue-300"
                            }`}
                            onClick={() => onSelect && onSelect(item.id)}
                        >
                            <div className="flex relative rounded-lg overflow-hidden">
                                <img
                                    src="/images/lvbuilding.jpg"
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                                <div className="px-8 py-10 relative z-10 w-full border-4 border-gray-200 bg-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <h2 className="tracking-widest text-sm title-font font-medium text-indigo-500 mb-1">
                                        {item.subtitle}
                                    </h2>
                                    <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                        {item.title}
                                    </h1>
                                    <p className="leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Gallery;
