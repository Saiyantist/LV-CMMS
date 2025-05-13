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

const Gallery: React.FC = () => {
    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                {/* <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-1 text-gray-900">
                        Facility
                    </h1>
                </div> */}
                <div className="flex flex-wrap -m-4">
                    {galleryItems.map((item) => (
                        <div key={item.id} className="lg:w-1/3 sm:w-1/2 p-4">
                            <div className="flex relative rounded-lg overflow-hidden">
                                {/* Individual image per item */}
                                <img
                                    src="/images/lvbuilding.jpg"
                                    alt={item.title}
                                    className="absolute inset-0 w-full h-full object-cover object-center"
                                />
                                {/* Overlay content */}
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
