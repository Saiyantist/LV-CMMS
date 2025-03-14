import HomeLayout from "@/Layouts/HomeLayouts";
function Home() {
    return (
        <div>
            <h1 className="title"> Hello </h1>
        </div>
    );
}

// Apply the layout
Home.layout = page => <HomeLayout>{page}</HomeLayout>;

export default Home;
