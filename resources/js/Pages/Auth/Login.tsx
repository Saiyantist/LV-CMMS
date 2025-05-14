import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

interface LoginFormData {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: string | boolean | File | null;
}

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } =
        useForm<LoginFormData>({
            email: "",
            password: "",
            remember: false,
        });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <div className="flex">
                        <InputLabel htmlFor="email" value="Email" />
                        {errors.email && (
                            <span className="text-red-500 ml-1">*</span>
                        )}
                    </div>

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className={`mt-1 block w-full ${
                            errors.email ? "border-red-500" : ""
                        }`}
                        autoComplete="username"
                        isFocused
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <div className="flex">
                        <InputLabel htmlFor="password" value="Password" />
                        {errors.password && (
                            <span className="text-red-500 ml-1">*</span>
                        )}

                    </div>

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className={`mt-1 block w-full ${
                            errors.password ? "border-red-500" : ""
                        }`}
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="rounded-md text-sm text-secondary underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                        >
                            Forgot your password?
                        </Link>
                    )}

                </div>

                <div className="mt-4 flex flex-col items-center justify-between space-y-2 w-full">
                    <PrimaryButton
                        className="bg-secondary hover:bg-primary w-full rounded-xl flex items-center justify-center"
                        disabled={processing}
                    >
                        Log in
                    </PrimaryButton>

                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Don't have an account yet?{" "}
                        </span>
                        <Link
                            href="/register"
                            className="text-sm font-bold text-secondary hover:text-primary hover:underline dark:hover:text-secondary"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
