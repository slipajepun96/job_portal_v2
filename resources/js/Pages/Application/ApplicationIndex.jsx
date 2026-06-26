import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, usePage } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import RadioGroup from '@/Components/RadioGroup';
import TextArea from '@/Components/TextArea';
import FileInput from '@/Components/FileInput';
import { Calendar } from "@/Components/ui/calendar";
import ApplicationFamily from './Partials/ApplicationFamily';
import ApplicationEducation from './Partials/ApplicationEducation';
import ApplicationEmployer from './Partials/ApplicationEmployer';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/Components/ui/select"

export default function ApplicationIndex({vacancies}) {
// console.log(vacancies);

    const { application } = usePage().props.auth;
    const applicationIndex = usePage().props.auth.applicationIndex || [];

    const now = new Date();
    const hours = now.getHours();

    const [familyMembers, setFamilyMembers] = useState([]);
    const [education, setEducation] = useState([]);
    const [employers, setEmployers] = useState([]);
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(false);
    const [startDate, setStartDate] = useState(false);
    const [startSchool, setStartSchool] = useState(false);
    const [endSchool, setEndSchool] = useState(false);
    const [bonusDate, setBonusDate] = useState(false);
    const [boardDirectors, setBoardDirectors] = useState([]);

    //state untuk family
    const handleAddFamilyMember = (memberData) => {
        console.log('Adding family member:', memberData);
        setFamilyMembers(prev => [...prev, memberData]);
        console.log('Updated family members:', familyMembers);
    };

    //state untuk education
    const handleAddEducation = (educationData) => {
        console.log('Adding education:', educationData);
        setEducation(prev => [...prev, educationData]);
        console.log('Updated education:', education);
    };

    const handleAddEmployer = (employerData) => {
        console.log('Adding employer:', employerData);
        setEmployers(prev => [...prev, employerData]);
        console.log('Updated employers:', employers);
    }

    // //buang family dari state
    // const handleRemoveFamilyMember = (id) => {
    //     setFamilyMembers(prev => prev.filter(member => member.id !== id));
    // };

    const { data, setData, post, processing, errors, reset } = useForm({
            name: '',
            ic_number: '',
            age: '',
            dateOfBirth: '',
            gender: '',
            ethnicity: '',
            marital_status: '',
            children_num: '',
            address: '',
            address_postal: '',
            no_phone: '',
            phone_home: '',
            email: '',
            expected_salary: '',
            start_date: '',

            
            educationData: [],

            salary: '',
            allowance: '',
            report_to: '',
            report_count: '',
            notice_period: '',

            language_malay: '',
            language_english: '',
            other_language: '',
            language: '',

            crime_charge: '',
            crime_charge_details: '',
            bankruptcy: '',
            business_involvement: '',
            business_involvement_details: '',
            license: '',
            license_details: '',
            smoker: '',
            drinker: '',

            medical_condition: '',
            medical_condition_details: '',
            physical_disability: '',
            physical_disability_details: '',
            pregnancy_status: '',
            pregnancy_status_details: '',

            achievement: '',

            reference_name_1: '',
            reference_relationship_1: '',
            reference_phone_1: '',

            reference_name_2: '',
            reference_phone_2: '',
            reference_company_2: '',
            reference_position_2: '',

            resume: '',
    });

    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);
        if(currentPart !== totalParts){
            return;
        }

        setData(prev => ({
            ...prev,
            boardDirectors : boardDirectors,
            education : education,
            employers : employers,
            familyMembers : familyMembers,
        }));
        setShouldSubmit(true);
    };

    useEffect(() => {
        if (shouldSubmit) {
            setShouldSubmit(false);
            console.log('Submitting data:', data);
            post(route('application.save'), {
                ...data
            },
            {
                preserveScroll: true,
                onError: errors => {
                    console.group('Submission Errors');
                    console.error('Errors:', errors);
                    console.groupEnd();
                },
                onSuccess: () => {
                    reset();
                },
            });
        }
    }, [data, shouldSubmit]); // Watch for changes in data and shouldSubmit

    const handleNext = () => {
        if (currentPart < totalParts) {
            setCurrentPart(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (currentPart > 1) {
            setCurrentPart(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const allAnswered = (currentPart) => {
        console.log(data.language_malay);
        if (currentPart === 1 && data.name !== '' && data.ic_number  !== '' && data.age !== '' && data.dateOfBirth !== '' 
            && data.gender !== '' && data.ethnicity !== '' && data.marital_status !== '' && data.address !== '' 
            && data.no_phone !== '' && data.email !== '' && data.expected_salary !== '' && data.start_date !== '') {
            return true;
        }
        else if (currentPart === 2 || currentPart === 3 || currentPart === 4 || currentPart === 5) {
            return true;
        }
        else if (currentPart === 6 && data.language_malay !== '' && data.language_english !== '' && data.crime_charge !== '' 
            && data.bankruptcy !== '' && data.business_involvement !== '' && data.license !== '' && data.smoker !== '' 
            && data.drinker !== '' && data.medical_condition !== '' && data.physical_disability !== '') {
            return true;
        }
        else if (currentPart === 7 && data.achievement !== '' && data.reference_name_1 !== '' && data.reference_relationship_1 !== '' 
            && data.reference_phone_1 !== '' && data.resume !== ''){
            return true;
        }
    }

    const handleGenderChange = (gender) => {
        setData('gender', gender);
    };

    const handleMaritalStatusChange = (maritalStatus) => {
        setData('marital_status', maritalStatus);
    };

    const handleMalayChange = (language_malay) => {
        setData('language_malay', language_malay);
    }

    const handleEnglishChange = (language_english) => {
        setData('language_english', language_english);
    }

    const handleLanguageChange = (language) => {
        setData('language', language);
    }

    const handleCrimeChargeChange = (q1) => {
        setData('crime_charge', q1);
    }
    const handleBankruptcyChange = (q2) => {
        setData('bankruptcy', q2);
    }
    const handleBusinessInvolvementChange = (q3) => {
        setData('business_involvement', q3);
    }
    const handleLicenseChange = (license) => {
        setData('license', license);
    }
    const handleSmokerChange = (smoker) => {
        setData('smoker', smoker);
    }
    const handleDrinkerChange = (drinker) => {
        setData('drinker', drinker);
    }

    const handleMedicalConditionChange = (medical_condition) => {
        setData('medical_condition', medical_condition);
    }
    const handlePhysicalDisabilityChange = (physical_disability) => {
        setData('physical_disability', physical_disability);
    }
    const handlePregnancyStatusChange = (pregnancy_status) => {
        setData('pregnancy_status', pregnancy_status);
    }

    const [dropdown, setDropdown] = useState("dropdown")

    const totalParts = 7;

    const [currentPart, setCurrentPart] = useState(1);

    const handleVacancyChange = (vacancy_uuid) => {
        setData('vacancy_uuid', vacancy_uuid);
        console.log(data.vacancy_uuid)
    };

    const [ageAlert, setAgeAlert] = useState(false);

    const setAge = (age) => {
        age = parseInt(age); 
        setData('age', age);
        setAgeAlert(true);
        if (age >= 18 && age < 70){
            setAgeAlert(false);            
        }
    }

    const vacancy = vacancies.map(value=>({value:value.id, label:value.vacancies_title}));
    
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    } 

    const familycolumns = [
        {Header: 'Nama', accessor: ['family_name'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.family_name}</div>
                    <div className='font-normal text-sm'>{row.relationship}</div> 
                </div>
            ),
        },
        {Header: 'Umur', accessor: ['family_age'],
             Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.family_age} Tahun</div> 
                </div>
            ),
        },
        {Header: 'Pekerjaan', accessor: ['family_occupation'],
             Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.family_occupation}</div> 
                </div>
            ),
        },
        {Header: 'Nama Majikan/Sekolah', accessor: ['family_occupation_name'],
             Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.family_occupation_name}</div> 
                </div>
            ),
        },
    ]

    const educationcolumns = [
        {Header: 'Nama Sekolah/IPT', accessor: ['school_name'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.school_name}</div> 
                </div>
            ),
        },
        {Header: 'Tahun Mula & Tamat', accessor: ['start_school'],
            Cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <div className='font-normal text-sm'>{row.start_school}</div> 
                    <span className="text-gray-950">-</span>
                    <div className='font-normal text-sm'>{row.end_school}</div>
                </div>
            ),
        },
        {Header: 'Tahap Pendidikan', accessor: ['education_level'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.education_level}</div> 
                </div>
            ),
        },
        {Header: 'Nama Program', accessor: ['education_field'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.education_field}</div> 
                </div>
            ),
        },
    ]

    const employercolumns = [
        {Header: 'Nama Majikan', accessor: ['employer_name'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.employer_name}</div> 
                </div>
            ),
        },
        {Header: 'Jawatan', accessor: ['position'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.position}</div> 
                </div>
            ),
        },
        {Header: 'Tahun Mula & Tamat Bekerja', accessor: ['start_year'],
            Cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <div className='font-normal text-sm'>{row.start_year}</div> 
                    <span className="text-gray-950">-</span>
                    <div className='font-normal text-sm'>{row.end_year}</div>
                </div>
            ),
        },
        {Header: 'Gaji Akhir(RM)', accessor: ['final_salary'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.final_salary}</div> 
                </div>
            ),
        },
        {Header: 'Sebab Berhenti kerja', accessor: ['reason_for_leaving'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.reason_for_leaving}</div> 
                </div>
            ),
        },
    ]

    return (
        <GuestLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Permohonan Kerja Kosong
                </h2>
            }
        >
            <Head title="Dashboard" />

            {/* <Head title="Complete Registration" /> */}
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <form onSubmit={submit}>  
                        {/* part 1 */}
                        <div className="overflow-hidden bg-white shadow-lg sm:rounded-2xl p-4">
                            {currentPart === 1 && (
                                <div>
                                    <p className='text-sm font-bold underline'>Permohonan Bagi Jawatan (Sila Pilih)
                                        <span className="text-red-500">*</span></p>
                                    <RadioGroup
                                        name="vacancy_uuid"
                                        value={data.vacancy_uuid}
                                        onChange={handleVacancyChange}
                                        options={vacancy}
                                        columns={2}
                                    />
                                    <InputError
                                            message={errors.vacancy_uuid}
                                            className="mt-2"
                                    />

                                    <p className='font-bold'>Bahagian 1 : Maklumat Peribadi</p>
                                    <div className='mt-4 space-y-4'>
                                        <p className='text-sm font-bold underline'>Maklumat Peribadi</p>
                                        <div className="grid flex-1 gap-2 md:grid-cols-1">
                                            <InputLabel
                                                //  htmlFor="vacancies_title"
                                                value={
                                                <>
                                                    Nama<span className="text-red-500">*</span>
                                                </>
                                                }
                                                />
                                            <TextInput
                                                id="name "
                                                name="name"
                                                value={data.name}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={(e) =>
                                                    setData('name', e.target.value)
                                                }  
                                                required                                  
                                                />
                                               
                                            <InputError
                                                message={errors.name}
                                                className="mt-2"
                                            />
                                            
                                        </div>

                                        <div className="grid flex-1 gap-2 md:grid-cols-3">
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        Nombor Kad Pengenalan<span className="text-red-500">*</span>
                                                    </>
                                                    }
                                                    />
                                                <TextInput
                                                    id="ic_number"
                                                    name="ic_number"
                                                    value={data.ic_number}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('ic_number', e.target.value)
                                                    } 
                                                    required                                  
                                                />
                                                <InputError
                                                    message={errors.ic_number}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        Umur(Tahun)<span className="text-red-500">*</span>
                                                    </>
                                                    }
                                                    required
                                                />
                                                <TextInput
                                                    id="age"
                                                    name="age"
                                                    type="number"
                                                    value={data.age}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        // setData('age', e.target.value)
                                                        setAge(e.target.value)
                                                    } 
                                                    required                                  
                                                />
                                                {ageAlert === true && (
                                                <div className="outline md:outline-red-400 rounded text-sm text-red-500 font-normal">Sila masukkan umur yang betul</div>
                                                )}
                                                <InputError
                                                    message={errors.age}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        Tarikh Lahir<span className="text-red-500">*</span>
                                                    </>
                                                    }
                                                />
                                                <Popover open={dateOfBirth} onOpenChange={setDateOfBirth} modal={false}>
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                className={cn(
                                                                    "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                    !data.dateOfBirth && "text-muted-foreground"
                                                                )}
                                                            >
                                                                { data.dateOfBirth ? format(data.dateOfBirth, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                            <Calendar
                                                            mode="single"
                                                            selected={data.dateOfBirth ? new Date(data.dateOfBirth) : undefined}
                                                            onSelect={selectedDate => {
                                                                    setData('dateOfBirth', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                    setDateOfBirth(false);
                                                                }}
                                                            captionLayout={dropdown}
                                                            fromYear={1900}
                                                            toYear={2100}
                                                            className="rounded-lg border shadow-sm"
                                                        />
                                                        </PopoverContent>
                                                </Popover>
                                                <InputError
                                                message={errors.dateOfBirth}
                                                className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid flex-1 gap-2 md:grid-cols-2">
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        Jantina<span className="text-red-500">*</span>
                                                    </>
                                                    }
                                                    />
                                                <RadioGroup
                                                    name="gender"
                                                    value={data.gender}
                                                    onChange={handleGenderChange}
                                                    options={[
                                                        { value: 'Lelaki', label: 'Lelaki' },
                                                        { value: 'Perempuan', label: 'Perempuan' },
                                                    ]}
                                                    columns={2}
                                                    required
                                                />
                                                <InputError
                                                message={errors.gender}
                                                className="mt-2"
                                                />
                                            </div>

                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        Bangsa<span className="text-red-500">*</span>
                                                    </>
                                                    }
                                                    />
                                                <TextInput
                                                    id="ethnicity "
                                                    name="ethnicity"
                                                    value={data.ethnicity}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('ethnicity', e.target.value)
                                                    } 
                                                    required                                  
                                                    />
                                                <InputError
                                                message={errors.ethnicity}
                                                className="mt-2"
                                                />
                                            </div>
                                        </div>

                                    <div className="grid flex-1 gap-2 md:grid-cols-2">
                                        <div className="grid flex-1 gap-2 md:grid-cols-1">
                                            <InputLabel
                                                //  htmlFor="vacancies_title"
                                                value={
                                                <>
                                                    Status Perkahwinan<span className="text-red-500">*</span>
                                                </>
                                            }
                                                />
                                            <RadioGroup
                                                    name="marital_status"
                                                    value={data.marital_status}
                                                    onChange={handleMaritalStatusChange}
                                                    options={[
                                                        { value: 'Bujang', label: 'Bujang' },
                                                        { value: 'Berkahwin', label: 'Berkahwin' },
                                                        { value: 'Bercerai', label: 'Bercerai' },
                                                    ]}
                                                    columns={3}
                                                />
                                            <InputError
                                                message={errors.marital_status}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="grid flex-1 gap-2 md:grid-cols-1">
                                            <InputLabel
                                                //  htmlFor="vacancies_title"
                                                value={
                                                <>
                                                    Bilangan Anak(Bagi status berkahwin atau bercerai)
                                                </>
                                            }
                                                />
                                            <TextInput
                                                id="children_num"
                                                name="children_num"
                                                type="number"
                                                value={data.children_num}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={(e) =>
                                                    setData('children_num', e.target.value)
                                            }                                        
                                                />
                                            <InputError
                                                message={errors.children_num}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>

                                        <div className="grid flex-1 gap-2 md:grid-cols-1">
                                            <InputLabel
                                                //  htmlFor="vacancies_title"
                                                value={
                                                <>
                                                    Alamat Tetap<span className="text-red-500">*</span>
                                                </>
                                            }
                                                />
                                            <TextInput
                                                id="address"
                                                name="address"
                                                value={data.address}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={(e) =>
                                                    setData('address', e.target.value)
                                                }  
                                                required                                 
                                                />
                                            <InputError
                                                message={errors.address}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="grid flex-1 gap-2 md:grid-cols-1">
                                            <InputLabel
                                                //  htmlFor="vacancies_title"
                                                value={
                                                <>
                                                    Alamat Surat Menyurat (Sekiranya berbeza dengan alamat tetap)
                                                </>
                                            }
                                                />
                                            <TextInput
                                                id="address_postal"
                                                name="address_postal"
                                                value={data.address_postal}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={(e) =>
                                                    setData('address_postal', e.target.value)
                                        }                                   
                                                />
                                            <InputError
                                                message={errors.address_postal}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="grid flex-1 gap-2 md:grid-cols-3">
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        No.Telefon Bimbit (0123456789)<span className="text-red-500">*</span>
                                                    </>
                                                }
                                                    />
                                                <TextInput
                                                    id="no_phone"
                                                    name="no_phone"
                                                    value={data.no_phone}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('no_phone', e.target.value)
                                                    }    
                                                    required                               
                                                    />
                                                <InputError
                                                    message={errors.no_phone}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        No.Telefon Rumah(091234567)
                                                    </>
                                                }
                                                    />
                                                <TextInput
                                                    id="phone_home"
                                                    name="phone_home"
                                                    value={data.phone_home}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('phone_home', e.target.value)
                                                }                                        
                                                    />
                                                <InputError
                                                    message={errors.phone_home}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        E-Mel<span className="text-red-500">*</span>
                                                    </>
                                                }
                                                    />
                                                <TextInput
                                                    id="email "
                                                    name="email"
                                                    value={data.email}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('email', e.target.value)
                                                    }   
                                                    required                                
                                                    />
                                                <InputError
                                                    message={errors.email}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid flex-1 gap-2 md:grid-cols-1">
                                            <InputLabel
                                                //  htmlFor="vacancies_title"
                                                value={
                                                <>
                                                    Jangkaan Gaji(RM)<span className="text-red-500">*</span>
                                                </>
                                            }
                                                />
                                            <TextInput
                                                id="expected_salary "
                                                name="expected_salary"
                                                value={data.expected_salary}
                                                className="mt-1 block w-full"
                                                isFocused={true}
                                                onChange={(e) =>
                                                    setData('expected_salary', e.target.value)
                                                } 
                                                required                                  
                                                />
                                            <InputError
                                                message={errors.expected_salary}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="grid flex-1 gap-2 md:grid-cols-1">
                                            <InputLabel
                                                //  htmlFor="vacancies_title"
                                                value={
                                                <>
                                                    Jangkaan Tarikh Masuk<span className="text-red-500">*</span>
                                                </>
                                            }
                                                />
                                            <Popover open={startDate} onOpenChange={setStartDate} modal={false}>
                                            <PopoverTrigger asChild>
                                                        <button
                                                            type="button"
                                                            className={cn(
                                                                "mt-1 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
                                                                !data.start_date && "text-muted-foreground"
                                                            )}
                                                        >
                                                            { data.start_date ? format(data.start_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                        </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                        <Calendar
                                                        mode="single"
                                                        selected={data.start_date ? new Date(data.start_date) : undefined}
                                                        onSelect={selectedDate => {
                                                                setData('start_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                                setStartDate(false);
                                                            }}
                                                        captionLayout={dropdown}
                                                        fromYear={1900}
                                                        toYear={2100}
                                                        className="rounded-lg border shadow-sm"
                                                    />
                                                    </PopoverContent>
                                            </Popover>
                                            <InputError
                                                message={errors.start_date}
                                                className="mt-2"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* part 2 */}
                            {currentPart === 2 && (
                                <div>
                                    <p className='font-bold'>Bahagian 2 : Maklumat Keluarga</p>
                                    <div className='mt-4'>
                                        <p className='text-sm font-bold underline'>Tambahan Maklumat Keluarga</p>
                                            <ApplicationFamily onAddFamilyMember={handleAddFamilyMember} />                                  
                                    </div>
                                    <DataTable columns={familycolumns} data={familyMembers} className='mt-4'/>
                                </div>
                            )}

                            {/* part 3 */}
                            {currentPart === 3 && (
                                <div>
                                    <p className='font-bold'>Bahagian 3 : Maklumat Pendidikan</p>
                                    <div className='flex'>
                                        <span class='flex items-center bg-lime-200 border border-success-subtle text-gray-700 text-sm font-medium px-1.5 py-0.5 rounded'>
                                        <span class="h-1.5 w-1.5 bg-lime-600 rounded-full me-1"></span>
                                            Sila masukkan pendidikan dari sekolah menengah
                                        </span>
                                    </div>
                                    <div className='mt-4'>
                                        <p className='text-sm font-bold underline'>Tambahan Maklumat Pendidikan</p>
                                        <ApplicationEducation onAddEducation={handleAddEducation} />
                                    </div>
                                    <DataTable columns={educationcolumns} data={education} className='mt-4'/>
                                </div>
                            )}

                            {/* part 4 */}
                            {currentPart === 4 && (
                                <div>
                                    <p className='font-bold'>Bahagian 4 : Maklumat Pekerjaan</p>
                                    <div className='mt-4'>
                                        <p className='text-sm font-bold underline'>Tambahan Maklumat Pekerjaan</p>
                                        <ApplicationEmployer onAddEmployer={handleAddEmployer} />
                                    </div>
                                    <DataTable columns={employercolumns} data={employers} className='mt-4'/>
                                </div>
                            )}

                            {/* part 5 */}
                            {currentPart === 5 && (
                                <div>
                                    <p className='font-bold'>Bahagian 5 : Maklumat Tambahan Pekerjaan Terkini</p>
                                    <div className='mt-4 space-y-4'>
                                        <p className='text-sm font-bold underline'>Tambahan Maklumat Pekerjaan</p>
                                            <div className="grid flex-1 gap-2 md:grid-cols-2">
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Gaji Pokok Semasa (RM)
                                                 </>
                                                }
                                                 />
                                                <TextInput
                                                    id="salary"
                                                    name="salary"
                                                    value={data.salary}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('salary', e.target.value)
                                                }                        
                                                 />
                                                <InputError
                                                    message={errors.salary}
                                                    className='mt-2'
                                                 />
                                            </div>

                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Elaun Semasa (RM)(Jika Ada)
                                                 </>
                                             }
                                                 />
                                                <TextInput
                                                    id="allowance"
                                                    name="allowance"
                                                    value={data.allowance}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('allowance', e.target.value)
                                                }                        
                                                 />
                                                <InputError
                                                    message={errors.allowance}
                                                    className='mt-2'
                                                 />
                                            </div>
                                            </div>

                                           <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Laporkan Kepada Siapa ? (Nama Pegawai Anda)
                                                 </>
                                            }
                                                 />
                                                <TextInput
                                                    id="report_to"
                                                    name="report_to"
                                                    value={data.report_to}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('report_to', e.target.value)
                                                }                           
                                                 />
                                                <InputError
                                                    message={errors.report_to}
                                                    className="mt-2"
                                                 />
                                           </div>

                                           <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Bilangan Orang Yang Melapor Kepada Anda
                                                 </>
                                            }
                                                 />
                                                <TextInput
                                                    id="report_count"
                                                    name="report_count"
                                                    value={data.report_count}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('report_count', e.target.value)
                                                }                           
                                                 />
                                                <InputError
                                                    message={errors.report_count}
                                                    className="mt-2"
                                                 />
                                           </div>

                                           <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Tempoh Notis Peletakan Jawatan Untuk Pekerjaan Semasa (Minggu / Bulan)
                                                 </>
                                             }
                                                 />
                                                <TextInput
                                                    id="notice_period"
                                                    name="notice_period"
                                                    value={data.notice_period}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('notice_period', e.target.value)
                                                }                           
                                                 />
                                                <InputError
                                                    message={errors.notice_period}
                                                    className="mt-2"    
                                                 />
                                            </div>                                      
                                    </div>
                                </div>
                            )}

                            {/* part 6/7/8 */}
                            {currentPart === 6 && (
                                <div>
                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Bahagian 6 : Penguasaan Bahasa</p>            
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Penguasaan Bahasa Melayu<span className="text-red-500">*</span>
                                                 </>
                                                }
                                                 />
                                                <RadioGroup
                                                name="language_malay"
                                                value={data.language_malay}
                                                 onChange={handleMalayChange}
                                                options={[
                                                    { value: 'Baik', label: 'Baik' },
                                                    { value: 'Sederhana', label: 'Sederhana' },
                                                    { value: 'Kurang Baik', label: 'Kurang Baik' },
                                                ]}
                                                columns={3}
                                                 />
                                                <InputError
                                                    message={errors.language_malay}
                                                    className="mt-2"
                                                 />
                                            </div>

                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Penguasaan Bahasa Inggeris<span className="text-red-500">*</span>
                                                 </>
                                                }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="language_english"
                                                value={data.language_english}
                                                 onChange={handleEnglishChange}
                                                options={[
                                                    { value: 'Baik', label: 'Baik' },
                                                    { value: 'Sederhana', label: 'Sederhana' },
                                                    { value: 'Kurang Baik', label: 'Kurang Baik' },
                                                ]}
                                                columns={3}
                                                 />
                                                <InputError
                                                    message={errors.language_english}
                                                    className="mt-2"
                                                 />
                                            </div>
 
                                           <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Penguasaan Bahasa Lain (Jika Ada)
                                                 </>
                                                }
                                                 />
                                                <TextInput
                                                    id="other_language"
                                                    name="other_language"
                                                    value={data.other_language}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('other_language', e.target.value)
                                                }                                 
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="language"
                                                value={data.language}
                                                 onChange={handleLanguageChange}
                                                options={[
                                                    { value: 'Baik', label: 'Baik' },
                                                    { value: 'Sederhana', label: 'Sederhana' },
                                                    { value: 'Kurang Baik', label: 'Kurang Baik' },
                                                ]}
                                                columns={3}
                                                />
                                                <InputError
                                                    message={errors.language}
                                                    className="mt-2"
                                                 />
                                           </div>                                  
                                    </div>
                                
                                    <div className='mt-4 space-y-4'>    
                                    <p className='font-bold'>Bahagian 7 : Maklumat Lain</p>
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    1)Adakah anda pernah didakwa dan disabitkan dalam mana-mana mahkamah
                                                    undang-undang untuk kesalahan jenayah atau Kesalahan dibawah Akta Dadah
                                                    Berbahaya 1952? (jika ya, nyatakan butiran)<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="crime_charge"
                                                value={data.crime_charge}
                                                 onChange={handleCrimeChargeChange}
                                                options={[
                                                    { value: 'Ya', label: 'Ya' },
                                                    { value: 'Tidak', label: 'Tidak' },
                                                ]}
                                                columns={2}
                                                />
                                                <TextInput
                                                    id="crime_charge_details"
                                                    name="crime_charge_details"
                                                    value={data.crime_charge_details}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('crime_charge_details', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.crime_charge_details}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    2)Adakah anda diisytiharkan bankrap?<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="bankruptcy"
                                                value={data.bankruptcy}
                                                 onChange={handleBankruptcyChange}
                                                options={[
                                                    { value: 'Ya', label: 'Ya' },
                                                    { value: 'Tidak', label: 'Tidak' },
                                                ]}
                                                columns={2}
                                                />
                                                <InputError
                                                    message={errors.bankruptcy}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    3)Adakah anda terlibat dalam sebarang usaha perniagaan,
                                                    termasuk perniagaan keluarga? (jika ya, nyatakan butiran)<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="business_involvement"
                                                value={data.business_involvement}
                                                 onChange={handleBusinessInvolvementChange}
                                                options={[
                                                    { value: 'Ya', label: 'Ya' },
                                                    { value: 'Tidak', label: 'Tidak' },
                                                ]}
                                                columns={2}
                                                />
                                                <TextInput
                                                    id="business_involvement_details"
                                                    name="business_involvement_details"
                                                    value={data.business_involvement_details}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('business_involvement_details', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.business_involvement_details}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    4)Adakah anda mempunyai lesen memandu? (jika ya, nyatakan kelas apa)<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="license"
                                                value={data.license}
                                                 onChange={handleLicenseChange}
                                                options={[
                                                    { value: 'Ya', label: 'Ya' },
                                                    { value: 'Tidak', label: 'Tidak' },
                                                ]}
                                                columns={2}
                                                />
                                                <TextInput
                                                    id="license_details"
                                                    name="license_details"
                                                    value={data.license_details}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('license_details', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.license_details}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    5)Adakah anda seorang perokok?<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="smoker"
                                                value={data.smoker}
                                                 onChange={handleSmokerChange}
                                                options={[
                                                    { value: 'Ya', label: 'Ya' },
                                                    { value: 'Tidak', label: 'Tidak' },
                                                ]}
                                                columns={2}
                                                />
                                                <InputError
                                                    message={errors.smoker_details}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    6)Adakah anda seorang peminum arak?<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="drinker"
                                                value={data.drinker}
                                                 onChange={handleDrinkerChange}
                                                options={[
                                                    { value: 'Ya', label: 'Ya' },
                                                    { value: 'Tidak', label: 'Tidak' },
                                                ]}
                                                columns={2}
                                                />
                                                <InputError
                                                    message={errors.drinker_details}
                                                    className="mt-2"
                                                 />
                                            </div>                                  
                                    </div>

                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Bahagian 8 : Perubatan & Keadaan Fizikal</p>            
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    1) Pernahkah anda atau sedang mengalami sebarang penyakit? (jika ya, nyatakan butiran) <span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="medical_condition"
                                                value={data.medical_condition}
                                                 onChange={handleMedicalConditionChange}
                                                options={[
                                                    { value: 'Ya', label: 'Ya' },
                                                    { value: 'Tidak', label: 'Tidak' },
                                                ]}
                                                columns={2}
                                                />
                                                <TextInput
                                                    id="medical_condition_details"
                                                    name="medical_condition_details"
                                                    value={data.medical_condition_details}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('medical_condition_details', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.medical_condition_details}
                                                    className="mt-2"
                                                 />
                                            </div>

                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    2) Adakah anda mengalami kecacatan fizikal? (jika ya, nyatakan butiran)<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="physical_disability"
                                                value={data.physical_disability}
                                                 onChange={handlePhysicalDisabilityChange}
                                                options={[
                                                    { value: 'Ya', label: 'Ya' },
                                                    { value: 'Tidak', label: 'Tidak' },
                                                ]}
                                                columns={2}
                                                />
                                                <TextInput
                                                    id="physical_disability_details"
                                                    name="physical_disability_details"
                                                    value={data.physical_disability_details}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('physical_disability_details', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.physical_disability_details}
                                                    className="mt-2"
                                                 />
                                            </div>
 
                                           <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    3) Adakah anda sedang hamil atau merancang memiliki
                                                    bayi tidak lama lagi? (untuk calon perempuan sahaja)
                                                 </>
                                            }
                                                 />
                                                <RadioGroup
                                                //change the name and value
                                                name="pregnancy_status"
                                                value={data.pregnancy_status}
                                                 onChange={handlePregnancyStatusChange}
                                                options={[
                                                    { value: 'Ya', label: 'Ya' },
                                                    { value: 'Tidak', label: 'Tidak' },
                                                ]}
                                                columns={2}
                                                />
                                                <TextInput
                                                    id="pregnancy_status_details"
                                                    name="pregnancy_status_details"
                                                    value={data.pregnancy_status_details}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('pregnancy_status_details', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.pregnancy_status_details}
                                                    className="mt-2"
                                                 />
                                           </div>                                  
                                    </div>
                                </div>    
                            )}

                            {/* part 9/10/11 */}
                            {currentPart === 7 && (
                                <div>
                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Bahagian 9 : Kemahiran/ Bakat/ Hobi</p>            
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Nama Kemahiran/ Bakat/ Hobi<span className="text-red-500">*</span>
                                                 </>
                                                }
                                                 />
                                                <TextInput
                                                    id="achievement"
                                                    name="achievement"
                                                    value={data.achievement}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('achievement', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.achievement}
                                                    className="mt-2"
                                                 />
                                            </div>                                 
                                    </div>
                                
                                    <div className='mt-4 space-y-4'>    
                                    <p className='font-bold'>Bahagian 10 : Maklumat Orang Perlu Dihubungi Semasa Kecemassan</p>
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Nama<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <TextInput
                                                    id="reference_name_1"
                                                    name="reference_name_1"
                                                    value={data.reference_name_1}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('reference_name_1', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_name_1}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Hubungan<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <TextInput
                                                    id="reference_relationship_1"
                                                    name="reference_relationship_1"
                                                    value={data.reference_relationship_1}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('reference_relationship_1', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_relationship_1}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    No.Telefon<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <TextInput
                                                    id="reference_phone_1"
                                                    name="reference_phone_1"
                                                    value={data.reference_phone_1}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('reference_phone_1', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_phone_1}
                                                    className="mt-2"
                                                 />
                                            </div>                                
                                    </div>

                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Bahagian 11 : Rujukan (Selain Keluarga)</p>
                                    <div className='mt-2'>
                                        <p className='text-sm font-bold underline'>Rujukan Pertama</p>            
                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Nama<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <TextInput
                                                    id="reference_name_2"
                                                    name="reference_name_2"
                                                    value={data.reference_name_2}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('reference_name_2', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_name_2}
                                                    className="mt-2"
                                                 />
                                            </div>

                                            <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    No.Telefon<span className="text-red-500">*</span>
                                                 </>
                                             }
                                                 />
                                                <TextInput
                                                    id="reference_phone_2"
                                                    name="reference_phone_2"
                                                    value={data.reference_phone_2}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('reference_phone_2', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_phone_2}
                                                    className="mt-2"
                                                 />
                                            </div>
 
                                           <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Nama Syarikat<span className="text-red-500">*</span>
                                                 </>
                                            }
                                                 />
                                                <TextInput
                                                    id="reference_company_2"
                                                    name="reference_company_2"
                                                    value={data.reference_company_2}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('reference_company_2', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_company_2}
                                                    className="mt-2"
                                                 />
                                           </div>

                                           <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Jawatan<span className="text-red-500">*</span>
                                                 </>
                                                }
                                                 />
                                                <TextInput
                                                    id="reference_position_2"
                                                    name="reference_position_2"
                                                    value={data.reference_position_2}
                                                    className="mt-1 block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('reference_position_2', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_position_2}
                                                    className="mt-2"
                                                 />
                                           </div>
                                                                             
                                    </div>
                                    </div>
                                    {/* <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Resume atau Sijil</p>
                                    <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Muat Nail Fail Resume atau sijil-sijil yang berkaitan (jika ada) <span className="text-red-500">*</span>
                                                 </>
                                            }
                                                 />
                                                <FileInput
                                                    id="resume"
                                                    name="resume"
                                                    accept=".pdf"
                                                    maxSize={2}
                                                    showPreview={true}
                                                    onChange={(e) =>
                                                        setData('resume', e.target.files[0])
                                                }
                                                />
                                                <InputError
                                                    message={errors.resume}
                                                    className="mt-2"
                                                 />
                                           </div> 
                                    </div> */}
                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Gambar Passport</p>
                                    <div className="grid flex-1 gap-2 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Muat Nail Fail Gambar berukuran passport (jika ada) <span className="text-red-500">*</span>
                                                 </>
                                            }
                                                 />
                                                <FileInput
                                                    id="resume"
                                                    name="resume"
                                                    accept=".png,.jpg,.jpeg"
                                                    maxSize={2}
                                                    showPreview={true}
                                                    onChange={(e) =>
                                                        setData('resume', e.target.files[0])
                                                }
                                                />
                                                <InputError
                                                    message={errors.resume}
                                                    className="mt-2"
                                                 />
                                           </div> 
                                    </div>
                                </div>    
                            )}

                        </div>
                        <div className="flex justify-between mt-6">
                            <PrimaryButton
                                onClick={handlePrev}
                                disabled={currentPart === 1}
                                className="px-4 py-2 bg-blue-500 rounded disabled:opacity-50"
                            >
                                Sebelumnya
                            </PrimaryButton>
                            {/* {allAnswered && (
                                <button
                                    onClick={handleSubmit}
                                    className="px-4 py-2 bg-green-600 text-white rounded"
                                >
                                    Hantar Undian
                                </button>
                            )} */}
                            {(currentPart === totalParts && allAnswered(currentPart)) && (
                                <PrimaryButton
                                    onClick={submit}
                                    // disabled={currentPart === totalParts}
                                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                                >
                                    Hantar
                                </PrimaryButton>
                            )}
                            {(currentPart !== totalParts && allAnswered(currentPart)) && (
                                <PrimaryButton
                                    onClick={handleNext}
                                    disabled={currentPart === totalParts}
                                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                                >
                                    Seterusnya
                                </PrimaryButton>
                            )}
                            {/* <PrimaryButton
                                onClick={handleNext}
                                disabled={currentPart === totalParts}
                                className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                            >
                                Seterusnya
                            </PrimaryButton> */}
                        </div>

                        {/* end of part 1 */}

                        {/* part 2 */}
                    </form>
                </div>
            </div>
        </GuestLayout>
    );
}
