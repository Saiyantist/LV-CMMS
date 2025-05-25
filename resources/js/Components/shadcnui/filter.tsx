import { Filter } from "lucide-react";
import { Button } from "@/Components/shadcnui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/shadcnui/select";

interface FilterBoxProps {
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
    filterVenue: string;
    setFilterVenue: (venue: string) => void;
    filterStatus: string;
    setFilterStatus: (status: string) => void;
    uniqueVenues: string[];
    uniqueStatuses: string[];
    onClear: () => void;
}

const FilterBox: React.FC<FilterBoxProps> = ({
    isOpen,
    setIsOpen,
    filterVenue,
    setFilterVenue,
    filterStatus,
    setFilterStatus,
    uniqueVenues,
    uniqueStatuses,
    onClear,
}) => (
    <>
        <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setIsOpen(!isOpen)}
        >
            <Filter size={18} />
            Filter
        </Button>
        {isOpen && (
            <div className="border rounded-md p-4 mb-6 shadow-md w-full max-w-md ml-auto absolute right-0 bg-white z-10">
                <h3 className="font-semibold text-lg mb-4">Filter</h3>
                <div className="mb-4">
                    <p className="mb-2">Requested Venue</p>
                    <Select value={filterVenue} onValueChange={setFilterVenue}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select venue" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Venues</SelectItem>
                            {uniqueVenues.map((venue) => (
                                <SelectItem key={venue} value={venue}>
                                    {venue}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="mb-4">
                    <p className="mb-2">Status</p>
                    <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            {uniqueStatuses.map((status) => (
                                <SelectItem key={status} value={status}>
                                    {status}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex gap-2 mt-6">
                    <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        Apply
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={onClear}
                    >
                        Clear
                    </Button>
                </div>
            </div>
        )}
    </>
);

export default FilterBox;
