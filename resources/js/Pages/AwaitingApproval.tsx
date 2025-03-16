import Dropdown from '@/Components/Dropdown';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from "@inertiajs/react";

export default function AwaitingApproval(){
    // const user = usePage().props.auth.user;

    return (
        <GuestLayout>
         <Head title="Awaiting Approval"/>
            <div className="md:h-[7rem] flex flex-col justify-around">
                <p className="md:text-xl 2xl:text-2xl text-center dark:text-white italic">
                    Your profile is currently
                    <span className="ml-1 px-1 md:text-xl 2xl:text-2xl text-center dark:text-amber-500 italic dark:hover:text-amber-300">
                        pending approval.
                    </span>
                </p>
                <Link
                    className="w-1/4 mx-auto flex justify-center rounded-lg px-4 py-2 text-md leading-5 text-gray-700 transition duration-150 ease-in-out hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:text-gray-300 dark:hover:bg-gray-500 dark:focus:bg-gray-500"
                    href={route('logout')}
                    method="post"
                    as="button">
                    Log Out
                </Link>
            </div>
        </GuestLayout>

    );
}