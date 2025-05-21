import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { Label } from "@/Components/shadcnui/label";
import TextInput from "@/Components/TextInput";
import RegisterLayout from "@/Layouts/RegisterLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

const getDateLimits = () => {
    const today = new Date();
    const minDate = new Date(
        today.getFullYear() - 70,
        today.getMonth(),
        today.getDate()
    )
        .toISOString()
        .split("T")[0]; // 70 years ago
    const maxDate = new Date(
        today.getFullYear() - 18,
        today.getMonth(),
        today.getDate()
    )
        .toISOString()
        .split("T")[0]; // 18 years ago

    return { minDate, maxDate };
};

interface Department {
    id: number;
    name: string;
}

interface InternalRegistrationProps {
    departments?: Department[];
}

export default function InternalRegistration({
    departments,
}: InternalRegistrationProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        gender: "",
        contact_number: "",
        staff_type: "",
        department_id: "",
        work_group: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("register.internal"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    const { minDate, maxDate } = getDateLimits();

    return (
        <RegisterLayout width="w-1/2">
            <Head title="Registration for Internal" />
            <div>
                <h1 className="text-2xl font-bold text-center text-black dark:text-white">
                    Registration Form
                </h1>
                <h2 className="font-bold text-secondary text-center">
                    for Internal User
                </h2>
            </div>

            <form onSubmit={submit} className="px-2">

                <div className="max-h-[48vh] overflow-auto p-4">
                    {/* Name */}
                    <div className="flex justify-stretch mt-2 space-x-2">
                        {/* First Name */}
                        <div className="w-full">
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
                        <div className="w-full">
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

                    {/* Gender */}
                    <div className="flex justify-stretch mt-2 space-x-2">
                        <div className="w-full">
                            <div className="flex">
                                <InputLabel htmlFor="gender" value="Gender" />
                                <span className="text-red-500 ml-1">*</span>
                            </div>

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
                                <option value="rather not say">
                                    Rather not say
                                </option>
                            </select>

                            <InputError message={errors.gender} className="mt-2" />
                        </div>

                        {/* Contact Number */}
                        <div className="w-full">
                            <div className="flex">
                                <InputLabel htmlFor="contact_number" value="Contact Number" />
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


                    {/* Staff type and Department/Work Group */}
                    <div className="flex justify-stretch mt-4">
                        {/* Staff type */}
                        <div className="w-full">
                            <div className="flex">
                                <InputLabel htmlFor="staff_type" value="Type of Staff" />
                                <span className="text-red-500 ml-1">*</span>
                            </div>

                            <select
                                id="staff_type"
                                name="staff_type"
                                value={data.staff_type}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                onChange={(e) =>
                                    setData("staff_type", e.target.value)
                                }
                                required
                            >
                                <option value="">Select Type</option>
                                <option value="teaching">Teaching</option>
                                <option value="maintenance">
                                    Maintenance Personnel
                                </option>
                                <option value="non-teaching">Non-teaching</option>
                            </select>

                            <InputError
                                message={errors.staff_type}
                                className="mt-2"
                            />
                        </div>

                        {/* Department */}
                        {["teaching", "non-teaching"].includes(data.staff_type) && (
                            <div className="w-full ml-2">
                                <div className="flex">
                                    <InputLabel htmlFor="department" value="Department" />
                                    <span className="text-red-500 ml-1">*</span>
                                </div>

                                <select
                                    id="department_id"
                                    name="department_id"
                                    value={data.department_id}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:focus:border-indigo-600 dark:focus:ring-indigo-600"
                                    onChange={(e) =>
                                        setData("department_id", e.target.value)
                                    }
                                    required
                                >
                                    <option value="">Select Department</option>
                                    {departments?.map((dept) => (
                                        <option key={dept.id} value={dept.id}>
                                            {dept.name}
                                        </option>
                                    ))}
                                </select>

                                <InputError
                                    message={errors.department_id}
                                    className="mt-2"
                                />
                            </div>
                        )}

                        {/* Work Group */}
                        {data.staff_type === "maintenance" && (
                            <div className="w-full ml-2">
                                <div className="flex">
                                    <InputLabel htmlFor="work_group" value="Work Group" />
                                    <span className="text-red-500 ml-1">*</span>
                                </div>

                                <TextInput
                                    id="work_group"
                                    name="work_group"
                                    value={data.work_group}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("work_group", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.work_group}
                                    className="mt-2"
                                />
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div className="mt-4">
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
                    <div className="flex justify-stretch mt-4 space-x-2">
                        {/* Password */}
                        <div className="w-full">
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

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div className="w-full">
                            <div className="flex">
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
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

                <div className="flex flex-col items-center pt-4 pb-4 space-y-4 text-sm">
                    <Label className="flex self-start gap-2 ms-1">
                        <input type="checkbox" name="privacy_policy" required/>
                        <span className="text-sm">
                            I have read and understand the privacy policy
                        </span>
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
                                className="ml-1 rounded-md text-secondary font-bold underline hover:text-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
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
