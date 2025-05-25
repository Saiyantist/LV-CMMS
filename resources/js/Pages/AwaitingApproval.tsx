import Dropdown from '@/Components/Dropdown';
import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, usePage } from "@inertiajs/react";

export default function AwaitingApproval(){
    // const user = usePage().props.auth.user;

    return (
        <GuestLayout>
         <Head title="Awaiting Approval"/>
            <div className="flex flex-col justify-around bg-muted p-10 py-6 space-y-6 rounded text-center italic">
                <p className="text-lg 2xl:text-2xl text-center dark:text-white">
                    Your profile is currently
                    <span className="ml-1 text-amber-500 dark:text-amber-500">
                        pending approval.
                    </span>
                </p>
                <p className='text-sm text-primary'>
                    Please contact the admin for further assistance.
                </p>
                <Link
                    className="rounded-md text-sm self-center w-20 text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    href={route('logout')}
                    method="post"
                >
                    Log Out
                </Link>
            </div>
        </GuestLayout>

    );
}