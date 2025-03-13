import TextInput from "@/Components/TextInput";
import { FaBeer } from "react-icons/fa";
import Login from "./Auth/Login";
// import Layout from "@/Layouts/Layout";
import Navbar from "@/Components/Navbar";

function Home({ name }) {
    return (
        <div>
        <h1 className="title"> Hello {name} </h1>
         <FaBeer className="icon" />
        </div>
    );
}

Home.layout = page => <Navbar children={page} />;

export default Home;