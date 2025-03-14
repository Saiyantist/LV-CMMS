import Navbar from "@/Components/Navbar";

export default function HomeLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="p-4">{children}</main> {/* Ensure content is wrapped */}
    </div>
  );
}
