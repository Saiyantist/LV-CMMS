import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { Label } from "@/Components/shadcnui/label";
import TextInput from "@/Components/TextInput";
import RegisterLayout from "@/Layouts/RegisterLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { ChevronLeft } from "lucide-react";
import { FormEventHandler } from "react";

export default function ExternalRegistration() {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        // birth_date: '',
        gender: "",
        contact_number: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register.external"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <RegisterLayout width="w-2/5">
            <Head title="Registration for External" />

            <div className="p-2">
                <button
                    onClick={() => window.history.back()}
                    className="absolute left-6 top-8 text-primary hover:text-secondary hover:outline-none hover:ring-2 hover:ring-secondary rounded-full"
                >
                    <ChevronLeft size={30}/>
                </button>
                <h1 className="text-2xl font-bold text-center text-black dark:text-white">
                    Registration Form
                </h1>
                <h2 className="font-bold text-primary text-center">
                    for External User
                </h2>
            </div>

            <form onSubmit={submit} className="p-4">

                <div className="max-h-[50vh] overflow-auto space-y-2 p-1">
                    {/* Name */}
                    <div className="flex justify-stretch">
                        {/* First Name */}
                        <div className="w-full mr-2">
                            <div className="flex">
                                <InputLabel htmlFor="first_name" value="First Name" />
                                <span className="text-red-500 ml-1">*</span>
                            </div>

                            <TextInput
                                id="first_name"
                                name="first_name"
                                value={data.first_name}
                                className="mt-1 block w-full"
                                autoComplete="first_name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("first_name", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.first_name}
                                className="mt-2"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="w-full ml-2">
                            <div className="flex">
                                <InputLabel htmlFor="last_name" value="Last Name" />
                                <span className="text-red-500 ml-1">*</span>
                            </div>

                            <TextInput
                                id="last_name"
                                name="last_name"
                                value={data.last_name}
                                className="mt-1 block w-full"
                                autoComplete="last_name"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("last_name", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.last_name}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Gender and Contact Number */}
                    <div className="flex justify-between space-x-4">

                        {/* Gender */}
                        <div className="w-1/2">
                            <div className="flex">
                                <InputLabel htmlFor="gender" value="Gender" />
                                <span className="text-red-500 ml-1">*</span>
                            </div>

                            <select
                                id="gender"
                                name="gender"
                                value={data.gender}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-secondary focus:ring-secondary dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                onChange={(e) => setData("gender", e.target.value)}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>

                            <InputError message={errors.gender} className="mt-2" />
                        </div>

                        {/* Contact Number */}
                        <div className="w-1/2">
                            <div className="flex">
                                <InputLabel
                                    htmlFor="contact_number"
                                    value="Contact Number"
                                />
                                <span className="text-red-500 ml-1">*</span>
                            </div>

                            <TextInput
                                id="contact_number"
                                type="tel"
                                name="contact_number"
                                value={data.contact_number}
                                className="mt-1 block w-full"
                                placeholder="9XXXXXXXXX"
                                maxLength={10}
                                pattern="[0-9]*"
                                onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && 
                                    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) =>
                                    setData("contact_number", e.target.value)
                                }
                                required
                            />
                            <InputError
                                message={errors.contact_number}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="">
                        <div className="flex">
                            <InputLabel htmlFor="email" value="Email" />
                            <span className="text-red-500 ml-1">*</span>
                        </div>

                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full"
                            autoComplete="username"
                            onChange={(e) => setData("email", e.target.value)}
                            required
                        />

                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    {/* Password and Confirm Password */}
                    <div className="flex">
                        {/* Password */}
                        <div className="w-full mr-2">
                            <div className="flex">
                                <InputLabel htmlFor="password" value="Password" />
                                <span className="text-red-500 ml-1">*</span>
                            </div>

                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                required
                            />



                            {/* Password Requirements */}
                            <div className="mt-2 space-y-1">
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    <p className="font-medium mb-1">Password Requirements:</p>
                                    <ul className="">
                                        {typeof errors.password === 'string' && errors.password.split('. ').map((error, index) => (
                                            error.trim() && (
                                                <li key={index}>
                                                    - <InputError
                                                        message={error.trim()}
                                                        className="inline"
                                                    />
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                        </div>

                        {/* Confirm Password */}
                        <div className="w-full ml-2">
                            <div className="flex">
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password"/>
                                <span className="text-red-500 ml-1">*</span>
                            </div>

                            <TextInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                className="mt-1 block w-full"
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password_confirmation", e.target.value)
                                }
                                required
                            />

                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center pt-8 pb-4 space-y-4 text-sm">
                    <Label className="flex self-start gap-2 ms-3">
                        <Checkbox name="privacy_policy" required/>
                        <span className="text-sm font-normal">
                            I have read and understand the privacy policy
                        </span>
                        <span className="text-red-500 -ms-1">*</span>
                    </Label>

                    <div className="flex flex-col items-center space-y-4 w-full">
                        <PrimaryButton
                            type="submit"
                            className="bg-secondary hover:bg-primary w-full"
                            disabled={processing}
                        >
                            <span className="text-sm self-center w-full">
                                Register
                            </span>
                        </PrimaryButton>
                        <div className="flex items-center">
                            <span>Already have an account?</span>
                            <Link
                                href={route("login")}
                                className="ml-1 rounded-md text-secondary font-bold underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </RegisterLayout>
    );
}
