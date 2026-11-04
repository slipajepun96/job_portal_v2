import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import LoginLayout from '@/Layouts/LoginLayout';
import { Head, Link, useForm } from '@inertiajs/react';

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
        <LoginLayout>
            <Head title="Log Masuk" />

            <div className="mb-6 space-y-1">
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">Log Masuk</h1>
                <p className="text-sm text-muted-foreground">Masukkan emel dan kata laluan anda untuk meneruskan.</p>
            </div>

            {status && (
                <div className="mb-4 rounded-md border border-primary/20 bg-accent px-4 py-3 text-sm font-medium text-accent-foreground">
                    {status}
                </div>
            )}
        <div className=''>
            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Emel" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Kata Laluan" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="block w-full"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-muted-foreground">
                            Ingat saya
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm font-medium text-primary underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Lupa kata laluan?
                        </Link>
                    )}

                    <PrimaryButton className="ms-auto" disabled={processing}>
                        Log Masuk
                    </PrimaryButton>
                </div>
            </form>    
        </div>
        </LoginLayout>
    );
}
