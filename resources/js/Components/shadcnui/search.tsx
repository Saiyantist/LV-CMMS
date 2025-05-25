import { Search } from "lucide-react";

interface SearchBoxProps {
    value: string;
    onChange: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ value, onChange }) => (
    <div className="relative w-80">
        <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
        />
        <input
            className="pl-10 pr-4 py-2 border rounded-full w-full"
            placeholder="Search Description"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        />
    </div>
);

export default SearchBox;
