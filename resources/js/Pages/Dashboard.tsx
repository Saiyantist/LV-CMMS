import { Button } from "@/Components/shadcnui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/shadcnui/dropdown-menu";

export default function Dashboard() {
    const user = usePage().props.auth.user;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                    <div className="p-6 text-black">
                        Welcome {user.first_name} {user.last_name}!
                    </div>

                    {/* <div className="p-6 text-black">
                        You are logged in as {user.roles[0].name}!
                    </div> */}

                    {/* <div className="p-6 flex flex-row justify-center items-center gap-4">
                        <Button>Default Button</Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="lg">Open Dropdownsky</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>
                                    Mga Titan
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>Attack</DropdownMenuItem>
                                <DropdownMenuItem>Beast</DropdownMenuItem>
                                <DropdownMenuItem>Collosal</DropdownMenuItem>
                                <DropdownMenuItem>Carthead</DropdownMenuItem>
                                <DropdownMenuItem>Warhammer</DropdownMenuItem>
                                <DropdownMenuItem>Titan's gel?</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div> */}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
