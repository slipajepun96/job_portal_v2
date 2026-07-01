import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Welcome({ auth, canResetPassword, status, vacancies, success }) {
    const [formType, setFormType] = useState('login'); // 'login', 'register', or 'admin'

    // console.log(vacancies);
    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    const { data, setData, post, processing, errors, reset } = useForm({
        vendor_contact_person: '',
        vendor_email: '',
        password: '',
        password_confirmation: '',
    });

    const switchForm = (type) => {
        reset();
        setFormType(type);
    };

    // const [vacancies, setvacancies] = useState([]);

    // const submitLogin = (e) => {
    //     e.preventDefault();

    //     post(route('vendor.login.store'), {
    //         preserveScroll: true,
    //         preserveState: (page) => Object.keys(page.props.errors).length,
    //         onFinish: () => reset('password'),
    //     });
    // };

    // const submitRegister = (e) => {
    //     e.preventDefault();

    //     post(route('vendor.register.store'), {
    //         preserveScroll: true,
    //         preserveState: (page) => Object.keys(page.props.errors).length,
    //         onFinish: () => reset('password', 'password_confirmation'),
    //     });
    // };

    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50" style={{
                backgroundImage: `
                    radial-gradient(125% 125% at 50% 90%, #ffffff 40%, #3ABCC2 100%)
                `,
                backgroundSize: "100% 100%",
                }}> 

                <div className="relative flex min-h-screen flex-col items-center justify-center">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <nav className="-mx-3 flex flex-1 justify-end">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>

                                <Link
                                    href={route('login')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Log in
                                </Link>

                                <Link
                                    href={route('register')}
                                    className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                >
                                    Register
                                </Link>
                                </>
                                )}
                        </nav>



                        <main className="mt-6">
                            {success && (
                                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                                    {success}
                                    <div className='p-3 bg-green-100 rounded-xl text-center'>
                                        <p>Pihak tuan/puan perlu menghantar salinan sijil-sijil / dokumen pendidikan / dokumen sokongan yang berkaitan secara fizikal melalui pos dengan kos tangungan sendiri ke :<br/></p>
                                        <p className='font-bold'>
                                            Bahagian Pentadbiran,<br/>
                                            Ibu Pejabat PKPP Agro Sdn. Bhd.<br/>
                                            KM 4 Jalan Selendang,<br/>
                                            26800 Kuala Rompin,<br/>
                                            Pahang Darul Makmur
                                        </p>
                                    </div>
                                </div>
                            )}
                            <section className=" ">
                                <div className=" py-2 md:py-8 px-2 md:mx-auto md:max-w-screen-xl lg:py-16 grid lg:grid-cols-2 gap-8 lg:gap-16">
                                    <div className="flex flex-col justify-center">
                                        <h1 className="mb-2 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl">Portal Kerjaya</h1>
                                        <p className="mb-6 text-lg font-normal text-gray-500 lg:text-xl">PKPP Agro Sdn. Bhd.</p>
                                        <div className='grid grid-cols-1 gap-2'>
                                           
                                            <p className="mb-2 text-sm font-normal text-gray-950">Berminat ? Sila klik butang di bawah untuk mengisi borang permohonan</p>
                                            <div className='bg-green-300 p-2 rounded-lg text-center text-amber-500 font-semibold'>
                                            <Link
                                                href={route('application')}
                                                className="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
                                            >
                                            Mohon Sekarang    
                                            </Link>
                                            </div>
                                        </div>
                                        {/* <div className='mt-4'>
                                            Daftar sebagai vendor PKPP Agro Sdn. Bhd. sebagai kelayakan untuk menyertai sebut harga & tender yang dibuka oleh PKPP Agro Sdn. Bhd.
                                        </div> */}
                                    </div>
                                    <div>
                                        <div className="w-full lg:max-w-xl md:p-6 md:space-y-8 sm:p-8 md:bg-white rounded-lg md:shadow-xl md:border md:border-gray-200">
                                            <h2 className="text-2xl font-bold text-gray-900">
                                                {/* {formType === 'register' ? 'Daftar Sebagai Vendor' : formType === 'admin' ? 'Log Masuk Pentadbir' : 'Log Masuk Vendor'} */}
                                            </h2>

                                            <div>
                                                {/* {vacancies[0].vacancies_title} */}
                                                {vacancies.length === 0? "Tiada": null}
                                                {vacancies.length > 0 && (
                                                <div className="mt-6">
                                                    <h3 className="text-lg text-gray-900 font-bold mb-4">Senarai Kerja Kosong Sedang Dibuka</h3>
                                                    <div className="grid gap-2">
                                                        {vacancies.map((vacancy) => (
                                                            <div key={vacancy.id} className="border rounded-lg p-4 bg-gray-50">
                                                                <div className="flex justify-between items-start">
                                                                    <div className="grid gap-2 flex-1">
                                                                        <div>
                                                                            <p className="font-medium text-gray-900">{vacancy.vacancies_title}</p>
                                                                        </div>
                                                                        <div>
                                                                            <p className="font-medium">{vacancy.vacancies_location}</p>
                                                                        </div>
                                                                        <div>
                                                                            <a href={vacancy.ads_link} target="_blank">                                                            
                                                                                <PrimaryButton className="text-gray-900 ml-2 cursor-pointer">
                                                                                    Iklan
                                                                                </PrimaryButton>
                                                                            </a>                                                                            
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>    
                                                )}
                                            </div>                                       
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </main>
                    </div>
                </div>
            </div>
            <footer className="text-center text-sm text-black border-t py-4">
            | PKPP Agro Sdn Bhd © 2025 Hak Cipta Terpelihara
            </footer>
        </>
    );
}