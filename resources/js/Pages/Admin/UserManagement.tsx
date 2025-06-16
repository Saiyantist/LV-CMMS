import { useState, useEffect, useMemo, useRef } from "react";
import { router, Head } from "@inertiajs/react";
import { UserRoleProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ScrollToTopButton from "@/Components/ScrollToTopButton";
import { Datatable, type ColumnDef } from "@/Components/Datatable";
import { Tabs, TabsList, TabsTrigger } from "@/Components/shadcnui/tabs";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue, SelectSeparator } from "@/Components/shadcnui/select";
import { Button } from "@/Components/shadcnui/button";
import { Input } from "@/Components/shadcnui/input";
import { Search, SlidersHorizontal, ArrowUpDown, CircleX } from "lucide-react";
import {
    Popover,
    PopoverTrigger,
    PopoverContent
} from "@/Components/shadcnui/popover";
import FilterModal from "@/Components/FilterModal";
import EditUserModal from "./components/EditUserModal";
import ApproveUserModal from "./components/ApproveUserModal";
import RejectUserModal from "./components/RejectUserModal";
import RemoveAccessModal from "./components/RemoveAccessModal";
import FlashToast from "@/Components/FlashToast";

export default function UserManagement({ users, roles, auth }: UserRoleProps) {
    const [selectedRole, setSelectedRole] = useState<{ [key: number]: string }>({});
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [activeTab, setActiveTab] = useState("Internal");
    const [editingUser, setEditingUser] = useState<any>(null);
    const [approvingUser, setApprovingUser] = useState<any>(null);
    const [rejectingUser, setRejectingUser] = useState<any>(null);
    const [removingAccessUser, setRemovingAccessUser] = useState<any>(null);
    const [mobileSearchQuery, setMobileSearchQuery] = useState("");
    const [isMobileFilterModalOpen, setIsMobileFilterModalOpen] = useState(false);
    const [mobileColumnFilters, setMobileColumnFilters] = useState<Record<string, any>>({});
    const mobileFilterButtonRef = useRef<HTMLButtonElement>(null);
    const [mobileSortConfig, setMobileSortConfig] = useState<{key: string; direction: 'asc' | 'desc';}>({key: 'created_at', direction: 'desc'});

    useEffect(() => {
        const onScroll = () => setShowScrollTop(window.scrollY > 100);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Filter users based on active tab
    const filteredUsers = users.filter(user => {
        // const isInternal = user.department_id || user.work_group_id || user.staff_type || user.roles.some((role: any) => role.name !== "external_requester");
        const isInternal = user.department_id || user.work_group_id || user.staff_type;
        return activeTab === "Internal" ? isInternal : !isInternal;
    });

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-gray-100 text-gray-800 border-gray-300';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'rejected':
                return 'bg-red-50 text-pink-800 border-pink-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const columns: ColumnDef<any, unknown>[] = [
        {
            accessorKey: "id",
            header: "ID",
            cell: ({ row }: { row: any }) => <div>{row.getValue("id")}</div>,
            meta: {
                cellClassName: "w-12",
                searchable: true,
            },
        },
        {
            accessorKey: "created_at",
            header: "Date Registered",
            cell: ({ row }: { row: any }) => (
                <div>{new Date(row.getValue("created_at")).toLocaleDateString()}</div>
            ),
            meta: {
                cellClassName: "min-w-[8rem]",
                searchable: true,
            },
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }: { row: any }) => (
                <div>
                    {row.original.first_name} {row.original.last_name}
                </div>
            ),
            enableSorting: false,
            meta: {
                cellClassName: "min-w-[10rem]",
                searchable: true,
            },
        },
        {
            accessorKey: "contact_number",
            header: "Contact",
            cell: ({ row }: { row: any }) => <div>+63 {row.getValue("contact_number")}</div>,
            enableSorting: false,
            meta: {
                cellClassName: "min-w-[8rem]",
                searchable: true,
            },
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }: { row: any }) => <div>{row.getValue("email")}</div>,
            enableSorting: false,
            meta: {
                cellClassName: "min-w-[12rem]",
                searchable: true,
            },
        },
        ...(activeTab === "Internal" ? [
            {
                accessorKey: "roles",
                header: "Current Role",
                cell: ({ row }: { row: any }) => (
                    <div>
                        {row.original.roles?.length > 0
                            ? row.original.roles
                                .map((r: any) =>
                                    r.name
                                        .replace(/_/g, " ")
                                        .replace(/\b\w/g, (c: string) =>
                                            c.toUpperCase()
                                        )
                                )
                                .join(", ")
                            : "TBA"}
                    </div>
                ),
                enableSorting: false,
                meta: {
                    cellClassName: "min-w-[10rem]",
                    searchable: true,
                },
            }
        ] : []),
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: { row: any }) => (
                <div className={`w-[80%] px-2 py-0.5 rounded border ${getStatusColor(row.getValue("status"))}`}>
                    {row.getValue("status") || "Pending"}
                </div>
            ),
            meta: {
                cellClassName: "min-w-[8rem] text-center flex justify-center",
                searchable: true,
                filterable: true,
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }: { row: any }) => {
                const hasRole = row.original.roles?.length > 0;
                const isApproved = row.getValue("status")?.toLowerCase() === "approved";
                
                if (activeTab === "Internal") {
                    return (
                        <div className="flex justify-center gap-2">
                            {!hasRole ? (
                                <>
                                    <Button
                                        onClick={() => setApprovingUser(row.original)}
                                        className="h-6 px-4 text-xs bg-secondary text-white rounded hover:bg-secondary/80 transition-all duration-200"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant={"outline"}
                                        size={"icon"}
                                        onClick={() => setRejectingUser(row.original)}
                                        className="h-6 px-4 text-xs bg-destructive text-white rounded hover:bg-destructive/80 hover:text-white transition-all duration-200"
                                    >
                                    <CircleX/>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button
                                        onClick={() => setEditingUser(row.original)}
                                        className="h-6 px-4 text-xs bg-secondary text-white rounded hover:bg-secondary/80 transition-all duration-200"
                                    >
                                        Edit
                                    </Button>
                                    {isApproved && (
                                        <Button
                                            onClick={() => setRemovingAccessUser(row.original)}
                                            className="h-6 px-4 text-xs bg-destructive text-white rounded hover:bg-destructive/80 transition-all duration-200"
                                        >
                                            Remove Access
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    );
                } else {
                    return (
                        <div className="flex justify-center gap-2">
                            {!hasRole ? (
                                <>
                                    <Button
                                        onClick={() => setApprovingUser(row.original)}
                                        className="h-6 px-4 text-xs bg-secondary text-white rounded hover:bg-secondary/80 transition-all duration-200"
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        variant={"outline"}
                                        size={"icon"}
                                        onClick={() => setRejectingUser(row.original)}
                                        className="h-6 px-4 text-xs bg-destructive text-white rounded hover:bg-destructive/80 hover:text-white transition-all duration-200"
                                    >
                                    <CircleX/>
                                    </Button>
                                </>
                            ) : isApproved && (
                                <Button
                                    onClick={() => setRemovingAccessUser(row.original)}
                                    className="h-6 px-4 text-xs bg-destructive text-white rounded hover:bg-destructive/80 transition-all duration-200"
                                >
                                    Remove Access
                                </Button>
                            )}
                        </div>
                    );
                }
            },
            meta: {
                cellClassName: "min-w-[12rem]",
            },
        },
    ];

    const sortOptions = useMemo(() => [
        { label: 'ID', value: 'id' },
        { label: 'Date Registered', value: 'created_at' }
    ], []);

    const filteredMobileUsers = useMemo(() => {
        let filtered = filteredUsers;
    
        // Apply column filters
        if (Object.keys(mobileColumnFilters).length > 0) {
            filtered = filtered.filter((row) => {
                return Object.entries(mobileColumnFilters).every(([key, filterValue]) => {
                    if (!filterValue || filterValue === "all") return true;
                    const keys = key.split(".");
                    const value = keys.reduce((obj, k) => obj?.[k], row as any);
                    return value === filterValue;
                });
            });
        }
    
        // Apply search query
        if (mobileSearchQuery) {
            filtered = filtered.filter((user) => {
                const searchLower = mobileSearchQuery.toLowerCase();
                return (
                    user.id.toString().includes(searchLower) ||
                    user.first_name?.toLowerCase().includes(searchLower) ||
                    user.last_name?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.contact_number?.includes(searchLower) ||
                    user.roles?.some((role: any) => 
                        role.name.toLowerCase().includes(searchLower)
                    )
                );
            });
        }

        // Apply sorting
        filtered = [...filtered].sort((a, b) => {
            const { key, direction } = mobileSortConfig;
            let aValue = a[key];
            let bValue = b[key];

            // Handle date sorting
            if (key === 'created_at') {
                aValue = new Date(aValue).getTime();
                bValue = new Date(bValue).getTime();
            }

            if (direction === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });
    
        return filtered;
    }, [filteredUsers, mobileSearchQuery, mobileColumnFilters, mobileSortConfig]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobileFilterModalOpen && mobileFilterButtonRef.current && !mobileFilterButtonRef.current.contains(event.target as Node)) {
                const modalElement = document.querySelector('[data-filter-modal="true"]');
                if (
                    modalElement &&
                    !modalElement.contains(event.target as Node) &&
                    !mobileFilterButtonRef.current.contains(event.target as Node)
                ) {
                    setIsMobileFilterModalOpen(false);
                }
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isMobileFilterModalOpen]);

    return (
        <AuthenticatedLayout>
            <Head title="User Management" />

            {/* Header */}
            <header className="sticky md:flex top-0 z-40 md:z-0 w-full mx-auto px-0 sm:pb-4 bg-white">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-start -mt-6 pt-6 text-center sm:text-left gap-3 sm:gap-4">
                    <h1 className="text-2xl font-semibold sm:mb-0">
                        User Management
                    </h1>

                    <SelectSeparator className="sm:hidden mt-2 bg-secondary/30"/>
                </div>
            </header>

            {/* Tabs - Desktop */}
            <div className="hidden lg:flex">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="bg-gray-200 text-black rounded-md mb-6">
                        <TabsTrigger value="Internal">Internal</TabsTrigger>
                        <TabsTrigger value="External">External</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>

            {/* Tabs - Desktop (Responsive) */}
            <div className="hidden md:flex md:flex-row lg:hidden items-center gap-1 mb-6">
                {/* Switch Tabs */}
                <div className="flex xs:flex-[1.5] sm:flex-[1] justify-start px-2">
                    <h2 className="text-sm text-primary font-semibold">
                        Switch Tabs:
                    </h2>
                </div>
                {/* Dropdown */}
                <div className="flex flex-[5]">
                    <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select tab" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Internal">Internal</SelectItem>
                            <SelectItem value="External">External</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Tabs - Mobile */}
            <div className="md:hidden gap-2 mt-4">
                <div className="flex flex-row items-center gap-1">
                    {/* Switch Tabs */}
                    <div className="flex xs:flex-[1.5] sm:flex-[1] justify-start px-2">
                        <h2 className="text-sm text-primary font-semibold">
                            Switch Tabs:
                        </h2>
                    </div>
                    {/* Dropdown */}
                    <div className="flex flex-[5]">
                        <Select value={activeTab} onValueChange={setActiveTab}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select tab" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Internal">Internal</SelectItem>
                                <SelectItem value="External">External</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-md -mt-[0.8rem] lg:-mt-[4.25rem]">
                <Datatable
                    columns={columns}
                    data={filteredUsers}
                    placeholder="Search for ID, Name, Contact, Email, or Role"
                />
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-4 mt-4">
                {/* Search and Filter Controls */}
                <div className="flex items-center gap-2">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for ID, Name, Contact, Email, or Role"
                            value={mobileSearchQuery}
                            onChange={(event) => setMobileSearchQuery(event.target.value)}
                            className="h-10 w-full pl-8 rounded-md border bg-white/70 focus-visible:bg-white"
                        />
                    </div>

                    {/* Sort */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-10 gap-1 border rounded-md"
                            >
                                <ArrowUpDown className="h-4 w-4" />
                                Sort
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className="w-48 p-2 rounded-md border bg-white shadow-md"
                        >
                            <div className="space-y-2">
                                {sortOptions.map((option) => (
                                    <div key={option.value} className="flex items-center justify-between">
                                        <span className="text-sm">{option.label}</span>
                                        <div className="flex gap-1">
                                            {/* Ascending */}
                                            <Button
                                                variant="ghost" size="sm"
                                                className={`h-6 w-6 p-0 ${ mobileSortConfig.key === option.value && mobileSortConfig.direction === 'asc'
                                                        ? 'bg-primary text-white'
                                                        : ''
                                                }`}
                                                onClick={() => setMobileSortConfig({
                                                    key: option.value,
                                                    direction: 'asc'
                                                })}
                                            >
                                                ↑
                                            </Button>
                                            {/* Descending */}
                                            <Button
                                                variant="ghost" size="sm"
                                                className={`h-6 w-6 p-0 ${ mobileSortConfig.key === option.value && mobileSortConfig.direction === 'desc'
                                                        ? 'bg-primary text-white'
                                                        : ''
                                                }`}
                                                onClick={() => setMobileSortConfig({
                                                    key: option.value,
                                                    direction: 'desc'
                                                })}
                                            >
                                                ↓
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    {/* Filter */}
                    <Button
                        ref={mobileFilterButtonRef}
                        variant={Object.keys(mobileColumnFilters).length > 0 ? "default" : "outline"}
                        size="sm"
                        className={`h-10 gap-1 border rounded-md ${
                            Object.keys(mobileColumnFilters).length > 0 ? "bg-primary text-white" : ""
                        }`}
                        onClick={() => setIsMobileFilterModalOpen(!isMobileFilterModalOpen)}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        Filter
                        {Object.keys(mobileColumnFilters).length > 0 && (
                            <span className="ml-1 rounded-full bg-white text-primary w-5 h-5 flex items-center justify-center text-xs">
                                {Object.values(mobileColumnFilters).filter((value) => value !== "" && value !== "all").length}
                            </span>
                        )}
                    </Button>
                </div>

                {/* Filter Modal */}
                <FilterModal
                    isOpen={isMobileFilterModalOpen}
                    onClose={() => setIsMobileFilterModalOpen(false)}
                    columns={columns}
                    columnFilters={mobileColumnFilters}
                    setColumnFilters={setMobileColumnFilters}
                    data={filteredUsers}
                    buttonRef={mobileFilterButtonRef as React.RefObject<HTMLButtonElement>}
                />

                {filteredMobileUsers.map((user) => (
                    <div
                        key={user.id}
                        className="border rounded-lg p-4 bg-white shadow dark:bg-gray-800 dark:border-gray-700"
                    >
                        <div className="text-sm md:text-base space-y-2">
                            <div>
                                <strong>ID:</strong> {user.id}
                            </div>
                            <div>
                                <strong>Name:</strong> {user.first_name}{" "}
                                {user.last_name}
                            </div>
                            <div>
                                <strong>Contact:</strong> +63{" "}
                                {user.contact_number}
                            </div>
                            <div>
                                <strong>Email:</strong> {user.email}
                            </div>
                            {activeTab === "Internal" && (
                                <div>
                                    <strong>Current Role:</strong>{" "}
                                    {user.roles?.length > 0
                                        ? user.roles
                                            .map((r) =>
                                                r.name
                                                    .replace(/_/g, " ")
                                                    .replace(/\b\w/g, (c) =>
                                                        c.toUpperCase()
                                                    )
                                            )
                                            .join(", ")
                                        : "TBA"}
                                </div>
                            )}
                            <div>
                                <strong>Status:</strong>{" "}
                                <span className={`px-2 py-1 rounded border ${getStatusColor(user.status)}`}>
                                    {user.status || "Pending"}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2 !mt-4">
                                {!user.roles?.length ? (
                                    <>
                                        <Button
                                            onClick={() => setApprovingUser(user)}
                                            className="flex-1 h-6 px-4 text-xs bg-secondary text-white rounded hover:bg-secondary/80 transition-all duration-200"
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant={"outline"}
                                            size={"icon"}
                                            onClick={() => setRejectingUser(user)}
                                            className="flex-1 h-6 px-4 text-xs bg-destructive text-white rounded hover:bg-destructive/80 hover:text-white transition-all duration-200"
                                        >
                                        <CircleX/>
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {activeTab === "Internal" && (
                                            <Button
                                                onClick={() => setEditingUser(user)}
                                                className="flex-1 h-6 px-4 text-xs bg-secondary text-white rounded hover:bg-secondary/80 transition-all duration-200"
                                            >
                                                Edit
                                            </Button>
                                        )}
                                        {user.status?.toLowerCase() === 'approved' && (
                                            <Button
                                                onClick={() => setRemovingAccessUser(user)}
                                                className="flex-1 h-6 px-4 text-xs bg-destructive text-white rounded hover:bg-destructive/80 transition-all duration-200"
                                            >
                                                Remove Access
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modals */}
            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    roles={roles}
                    isInternal={activeTab === "Internal"}
                    onClose={() => setEditingUser(null)}
                />
            )}

            {approvingUser && (
                <ApproveUserModal
                    user={approvingUser}
                    roles={roles}
                    onClose={() => setApprovingUser(null)}
                />
            )}

            {rejectingUser && (
                <RejectUserModal
                    user={rejectingUser}
                    onClose={() => setRejectingUser(null)}
                />
            )}

            {removingAccessUser && (
                <RemoveAccessModal
                    user={removingAccessUser}
                    onClose={() => setRemovingAccessUser(null)}
                />
            )}

            <FlashToast />

            <ScrollToTopButton
                showScrollUpButton={showScrollTop}
                scrollToTop={scrollToTop}
            />
        </AuthenticatedLayout>
    );
}
