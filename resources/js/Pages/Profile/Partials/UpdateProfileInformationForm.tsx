import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

const getDateLimits = () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate()).toISOString().split("T")[0]; // 70 years ago
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate()).toISOString().split("T")[0]; // 18 years ago

    return { minDate, maxDate };
};
export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
    departments = [],
}: {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    departments?: { id:number; name:string;}[];
}) {

    const { minDate, maxDate } = getDateLimits();
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            first_name: user.first_name,
            last_name: user.last_name,
            contact_number: user.contact_number || '',
            birth_date: user.birth_date || '',
            gender: user.gender || '',
            staff_type: user.staff_type || '',
            department_id: user.department_id || '', // Fetch department ID
            email: user.email,
        });

        const submit: FormEventHandler = (e) => {
        e.preventDefault();

        patch(route('profile.update'), {
            preserveScroll: true
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    Profile Information
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Update your account's profile information and email address.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">

                {/* First Name */}
                <div>
                    <InputLabel htmlFor="first_name" value="First Name" />

                    <TextInput
                        id="first_name"
                        className="mt-1 block w-full"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        required
                        isFocused
                        autoComplete="first_name"
                    />

                    <InputError className="mt-2" message={errors.first_name} />
                </div>

                {/* Last Name */}
                <div>
                    <InputLabel htmlFor="last_name" value="Last Name" />

                    <TextInput
                        id="last_name"
                        className="mt-1 block w-full"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        required
                        isFocused
                        autoComplete="last_name"
                    />

                    <InputError className="mt-2" message={errors.last_name} />
                </div>

                {/* Contact Number */}
                <div>
                    <InputLabel htmlFor="contact_number" value="Contact Number" />
                    <TextInput
                        id="contact_number"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.contact_number}
                        maxLength={10}
                        onChange={(e) => setData('contact_number', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.contact_number} />
                </div>

                {/* Birth Date */}
                <div>
                    <InputLabel htmlFor="birth_date" value="Birth Date" />
                    <TextInput
                        id="birth_date"
                        type="date"
                        className="mt-1 block w-full"
                        value={data.birth_date}
                        min={minDate} // 70 years olds
                        max={maxDate} // 18 years olds
                        onChange={(e) => setData('birth_date', e.target.value)}
                        required
                    />
                    <InputError className="mt-2" message={errors.birth_date} />
                </div>

                {/* Gender */}
                <div>
                    <InputLabel htmlFor="gender" value="Gender" />
                    <select
                        id="gender"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                        value={data.gender}
                        onChange={(e) => setData('gender', e.target.value)}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="rather not say">Rather Not Say</option>
                    </select>
                    <InputError className="mt-2" message={errors.gender} />
                </div>

                {/* Staff Type */}
                <div>
                    <InputLabel htmlFor="staff_type" value="Staff Type" />
                    <select
                        id="staff_type"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                        value={data.staff_type}
                        onChange={(e) => setData('staff_type', e.target.value)}
                        required
                    >
                        <option value="">Select Staff Type</option>
                        <option value="teaching">Teaching</option>
                        <option value="non-teaching">Non-Teaching</option>
                    </select>
                    <InputError className="mt-2" message={errors.staff_type} />
                </div>

                {/* Department */}
                <div>
                    <InputLabel htmlFor="department_id" value="Department" />
                    <select
                        id="department_id"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                        value={data.department_id}
                        onChange={(e) => setData('department_id', e.target.value)}
                        required
                    >
                        <option value="">Select Department</option>
                        {departments.map((dept: { id: number; name: string }) => (
                            <option key={dept.id} value={dept.id}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                    <InputError className="mt-2" message={errors.department_id} />
                </div>

                {/* Email */}
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        disabled
                        id="email"
                        type="email"
                        className="mt-1 block w-full !text-gray-500"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                            Your email address is unverified.
                            <Link preserveScroll
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )}

                {/* Save Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
