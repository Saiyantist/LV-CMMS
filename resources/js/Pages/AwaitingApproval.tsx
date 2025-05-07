import Dropdown from '@/Components/Dropdown';
import PrimaryButton from '@/Components/PrimaryButton';
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
                    <span className="ml-1 md:text-xl 2xl:text-2xl text-center dark:text-amber-500 italic dark:hover:text-amber-300">
                        pending approval.
                    </span>
                </p>
                <Link
                    className="mt-4 mx-auto w-40 bg-primary text-white text-xs font-semibold tracking-widest py-3 rounded-full shadow hover:bg-secondary transition"
                    href={route('logout')}
                    method="post"
                    as="button">
                    LOG OUT
                </Link>
            </div>
        </GuestLayout>

    );
}