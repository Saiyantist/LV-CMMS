import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

function maxDate(){
    // Calculate the maximum date (18 years ago from today)
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate()) // Optional: Limit to 70 years old max
    const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    const maxDateString = maxDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    const minDateString = minDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD

    return {maxDateString, minDateString};
}
export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        birth_date: '',
        gender: '',
        contact_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const { minDateString, maxDateString } = maxDate();

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>

                {/* Name */}
                <div className='flex justify-stretch mt-2'>

                    {/* First Name */}
                    <div className='w-full mr-2'>
                        <InputLabel htmlFor="first_name" value="First Name" />

                        <TextInput
                            id="first_name"
                            name="first_name"
                            value={data.first_name}
                            className="mt-1 block w-full"
                            autoComplete="first_name"
                            isFocused={true}
                            onChange={(e) => setData('first_name', e.target.value)}
                            required
                        />

                        <InputError message={errors.first_name} className="mt-2" />
                    </div>

                    {/* Last Name */}
                    <div className='w-full ml-2'>
                        <InputLabel htmlFor="last_name" value="Last Name" />

                        <TextInput
                            id="last_name"
                            name="last_name"
                            value={data.last_name}
                            className="mt-1 block w-full"
                            autoComplete="last_name"
                            isFocused={true}
                            onChange={(e) => setData('last_name', e.target.value)}
                            required
                        />

                        <InputError message={errors.last_name} className="mt-2" />
                    </div>
                    
                </div>
                
                {/* Birth Date and Gender */}
                <div className='flex justify-stretch mt-4'>

                    {/* Birth date */}
                    <div className='w-full mr-2'>
                        <InputLabel htmlFor="birth_date" value="Birth Date" />

                        <TextInput
                            id="birth_date"
                            type="date"
                            name="birth_date"
                            value={data.birth_date}
                            className="mt-1 block w-full"
                            autoComplete="bday"
                            min={minDateString} // 70 years olds
                            max={maxDateString} // 18 years olds
                            onChange={(e) => setData("birth_date", e.target.value)}
                            required
                        />
                        <InputError message={errors.birth_date} className="mt-2" />
                    </div>

                    {/* Gender */}
                    <div className='w-full ml-2'>
                        <InputLabel htmlFor="gender" value="Gender" />

                        <select
                            id="gender"
                            name="gender"
                            value={data.gender}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                            onChange={(e) => setData("gender", e.target.value)}
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="rather not say">Rather not say</option>
                        </select>

                        <InputError message={errors.gender} className="mt-2" />
                    </div>
                </div>

                {/* Contact Number */}
                <div className='mt-4'>
                    <InputLabel htmlFor="contact_number" value="Contact Number" />
                    <TextInput
                        id="contact_number"
                        type="tel"
                        name="contact_number"
                        value={data.contact_number}
                        className="mt-1 block w-full"
                        placeholder="9XXXXXXXXX"
                        onChange={(e) => setData("contact_number", e.target.value)}
                        required
                    />
                    <InputError message={errors.contact_number} className="mt-2" />
                </div>

                {/* Email */}
                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                {/* Password and Confirm Password */}
                <div className='flex justify-stretch mt-4'>

                    {/* Password */}
                    <div className="w-full mr-2">
                        <InputLabel htmlFor="password" value="Password" />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />

                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Confirm Password */}
                    <div className="w-full ml-2">
                        <InputLabel
                            htmlFor="password_confirmation"
                            value="Confirm Password"
                        />

                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full"
                            autoComplete="new-password"
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            required
                        />

                        <InputError
                            message={errors.password_confirmation}
                            className="mt-2"
                        />
                    </div>

                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href={route('login')}
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
