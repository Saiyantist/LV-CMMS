import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col">
            {/* NavBar at the top */}
            <header className="bg-slate-800 shadow-md">
                <nav className="p-5 flex items-center justify-between">
                    {/* Logo aligned to the left */}
                    <div className="flex items-center">
                        <img 
                            src='/images/LVlogo.jpg' 
                            alt="Logo" 
                            className="w-12 h-12 rounded-full object-cover" 
                        />
                    </div>

                    {/* Navigation links centered */}
                    <div className="flex-grow flex justify-center space-x-4">
                        <Link className="text-slate-200 hover:bg-slate-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" href="/">
                            Home
                        </Link>
                        <Link className="text-slate-200 hover:bg-slate-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" href="/about">
                            About
                        </Link>
                        <Link className="text-slate-200 hover:bg-slate-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" href="/">
                            Features
                        </Link>
                    </div>

                    {/* Login button aligned to the right */}
                    <div>
                        <Link className="text-slate-200 hover:bg-slate-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium" href="/login">
                            Login
                        </Link>
                    </div>
                </nav>
            </header>

            {/* Main content */}
            <div className="flex flex-grow">
                {/* Left side (Form part) */}
                <div className="w-full sm:w-1/2 flex items-center justify-center py-6 px-4">
                    <div className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                        <Head title="Log in" />

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full sm:w-3/4 md:w-2/3 lg:w-1/2 px-4 py-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                />
                                <InputError message={errors.email} className="mt-2 text-red-500" />
                            </div>

                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full sm:w-3/4 md:w-2/3 lg:w-1/2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                />
                                <InputError message={errors.password} className="mt-2 text-red-500" />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-black-600">
                                    Don't have an account?{' '}
                                    <Link
                                        href={route('register')}
                                        className="text-sm text-blue-600 hover:underline"
                                    >
                                        Register
                                    </Link>
                                </span>
                            </div>

                            {/* Adjusted login button width */}
                            <PrimaryButton className="w-full sm:w-3/4 md:w-2/3 lg:w-1/2 mt-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={processing}>
                                {processing ? 'Logging in...' : 'LOG IN'}
                            </PrimaryButton>
                        </form>
                    </div>
                </div>

                {/* Right side (Image part) */}
                <div
                    className="w-1/2 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/LVBuilding.jpg')" }}
                ></div>
            </div>
        </div>
    );
}
