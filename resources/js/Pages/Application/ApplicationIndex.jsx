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
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@/Components/ui/input-group"

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
    const [clientErrors, setClientErrors] = useState({});
    const [resumePreviewUrl, setResumePreviewUrl] = useState('');
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

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
        setClientErrors((prev) => {
            if (!prev.education) return prev;
            const next = { ...prev };
            delete next.education;
            return next;
        });
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
            marital_status: "Bujang",
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
        setSubmitStatus({ type: '', message: '' });

        if(currentPart !== totalParts){
            return;
        }

        if (!validateCurrentPart(currentPart)) {
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
                    setSubmitStatus({
                        type: 'error',
                        message: 'Permohonan gagal dihantar. Sila semak semula maklumat dan cuba lagi.',
                    });
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

    const requiredFieldsByPart = {
        1: ['vacancy_uuid', 'name', 'ic_number', 'age', 'dateOfBirth', 'gender', 'ethnicity', 'marital_status', 'address', 'no_phone', 'email', 'expected_salary', 'start_date'],
        6: ['language_malay', 'language_english', 'crime_charge', 'bankruptcy', 'business_involvement', 'license', 'smoker', 'drinker', 'medical_condition', 'physical_disability'],
        7: ['achievement', 'reference_name_1', 'reference_relationship_1', 'reference_phone_1', 'resume'],
    };

    const isValueMissing = (value) => {
        if (value === null || value === undefined) return true;
        if (typeof value === 'string') return value.trim() === '';
        return false;
    };

    const validateCurrentPart = (part) => {
        if (part === 3) {
            if (education.length < 1) {
                setClientErrors({ education: 'Sila tambah sekurang-kurangnya satu rekod pendidikan.' });
                return false;
            }

            setClientErrors({});
            return true;
        }

        const requiredFields = requiredFieldsByPart[part] || [];
        if (requiredFields.length === 0) {
            setClientErrors({});
            return true;
        }

        const nextClientErrors = {};
        requiredFields.forEach((field) => {
            if (isValueMissing(data[field])) {
                nextClientErrors[field] = 'Ruangan ini wajib diisi.';
            }
        });

        setClientErrors(nextClientErrors);
        return Object.keys(nextClientErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateCurrentPart(currentPart)) {
            return;
        }

        if (currentPart < totalParts) {
            setClientErrors({});
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

    const totalParts = 8;

    const [currentPart, setCurrentPart] = useState(1);

    const handleVacancyChange = (vacancy_uuid) => {
        setData('vacancy_uuid', vacancy_uuid);
        console.log(data.vacancy_uuid)
    };

    useEffect(() => {
        setClientErrors((prev) => {
            const next = { ...prev };
            let changed = false;

            Object.keys(prev).forEach((field) => {
                if (!isValueMissing(data[field])) {
                    delete next[field];
                    changed = true;
                }
            });

            return changed ? next : prev;
        });
    }, [data]);

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

    const parsed = {
        ...data,
        familyMembers,
        education,
        employers,
    };

    useEffect(() => {
        if (data.resume instanceof File) {
            const objectUrl = URL.createObjectURL(data.resume);
            setResumePreviewUrl(objectUrl);

            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }

        if (typeof data.resume === 'string' && data.resume.trim() !== '') {
            setResumePreviewUrl(data.resume);
            return;
        }

        setResumePreviewUrl('');
    }, [data.resume]);

    const formatCurrency = (value) => {
        const numericValue = Number(value ?? 0);
        if (Number.isNaN(numericValue)) {
            return 'RM 0.00';
        }

        return new Intl.NumberFormat('ms-MY', {
            style: 'currency',
            currency: 'MYR',
            minimumFractionDigits: 2,
        }).format(numericValue);
    };

    const ValueView = ({ value }) => (
        <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800">
            {value ?? '-'}
        </div>
    );

    const DataTablePrintView = ({ columns, data: tableData, className = '' }) => {
        if (!Array.isArray(tableData) || tableData.length === 0) {
            return (
                <div className={`${className} rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600`}>
                    Tiada data.
                </div>
            );
        }

        return <DataTable columns={columns} data={tableData} className={className} />;
    };
    
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
                        {submitStatus.type === 'error' && submitStatus.message && (
                            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                {submitStatus.message}
                            </div>
                        )}
                        {Object.keys(clientErrors).length > 0 && (
                            <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                                Sila lengkapkan ruangan bertanda <span className="font-bold text-red-600">*</span>.
                            </div>
                        )}
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
                                            message={errors.vacancy_uuid || clientErrors.vacancy_uuid}
                                            className="mt-2"
                                    />

                                    {!data.vacancy_uuid && (
                                        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                                            Sila pilih jawatan terlebih dahulu untuk memaparkan borang maklumat peribadi.
                                        </div>
                                    )}

                                    {data.vacancy_uuid && (
                                    <>
                                    <p className='font-bold'>Bahagian 1 : Maklumat Peribadi</p>
                                    <div className='mt-4 space-y-2'>
                                        <p className='text-sm font-bold underline'>Maklumat Peribadi</p>
                                        <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                className="block w-full"
                                                isFocused={true}
                                                onChange={(e) =>
                                                    setData('name', e.target.value)
                                                }  
                                                required
                                                />
                                               
                                            <InputError
                                                message={errors.name || clientErrors.name}
                                                className="mt-2"
                                            />
                                            
                                        </div>

                                        <div className="grid flex-1 gap-2 md:grid-cols-3">
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('ic_number', e.target.value)
                                                    } 
                                                    required
                                                />
                                                <InputError
                                                    message={errors.ic_number || clientErrors.ic_number}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        Umur(Tahun)<span className="text-red-500">*</span>
                                                    </>
                                                    }
                                                    required
                                                />
                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="age"
                                                        name="age"
                                                        type="number"
                                                        value={data.age}
                                                        className="block w-full"
                                                        isFocused={true}
                                                        onChange={(e) =>
                                                            // setData('age', e.target.value)
                                                            setAge(e.target.value)
                                                        } 
                                                        required
                                                     />
                                                    <InputGroupAddon align="inline-end">
                                                        Tahun
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {ageAlert === true && (
                                                <div className="rounded text-sm text-red-500 font-normal">Sila masukkan umur yang betul</div>
                                                )}
                                                <InputError
                                                    message={errors.age || clientErrors.age}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                                    " h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
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
                                                message={errors.dateOfBirth || clientErrors.dateOfBirth}
                                                className="mt-2"
                                                />
                                            </div>
                                        </div>
                                        

                                        <div className="grid flex-1 gap-2 md:grid-cols-2">
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                message={errors.gender || clientErrors.gender}
                                                className="mt-2"
                                                />
                                            </div>
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    message={errors.marital_status || clientErrors.marital_status}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                    <div className="grid flex-1 gap-2 md:grid-cols-2">
                                        <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                className="block w-full"
                                                onChange={(e) =>
                                                    setData('ethnicity', e.target.value)
                                                } 
                                                required
                                                />
                                            <InputError
                                            message={errors.ethnicity || clientErrors.ethnicity}
                                            className="mt-2"
                                            />
                                        </div>
                                        
                                        {(data.marital_status !== "Bujang") && (
                                        <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                className="block w-full"
                                                onChange={(e) =>
                                                    setData('children_num', e.target.value)
                                            }                                        
                                                />
                                            <InputError
                                                message={errors.children_num}
                                                className="mt-2"
                                            />
                                        </div>)}
                                    </div>

                                        <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                className="block w-full"
                                                onChange={(e) =>
                                                    setData('address', e.target.value)
                                                }  
                                                required
                                                />
                                            <InputError
                                                message={errors.address || clientErrors.address}
                                                className="mt-2"
                                            />
                                        </div>

                                        <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                className="block w-full"
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
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('no_phone', e.target.value)
                                                    }    
                                                    required
                                                    />
                                                <InputError
                                                    message={errors.no_phone || clientErrors.no_phone}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('phone_home', e.target.value)
                                                }                                        
                                                    />
                                                <InputError
                                                    message={errors.phone_home}
                                                    className="mt-2"
                                                />
                                            </div>

                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('email', e.target.value)
                                                    }   
                                                    required
                                                    />
                                                <InputError
                                                    message={errors.email || clientErrors.email}
                                                    className="mt-2"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid flex-1 gap-1 md:grid-cols-2">
                                            <div>
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                    <>
                                                        Jangkaan Gaji(RM)<span className="text-red-500">*</span>
                                                    </>
                                                }
                                                    />

                                                <InputGroup>
                                                    <InputGroupInput
                                                        id="expected_salary "
                                                        name="expected_salary"
                                                        value={data.expected_salary}
                                                        className="block w-full"
                                                        onChange={(e) =>
                                                            setData('expected_salary', e.target.value)
                                                        }
                                                    />
                                                    <InputGroupAddon >
                                                        RM
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <InputError
                                                    message={errors.expected_salary || clientErrors.expected_salary}
                                                    className="mt-2"
                                                />
                                            </div>
                                            <div>
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
                                                                    "mt-0 h-9 w-full text-left text-sm bg-white border border-gray-300 rounded-md px-3 py-2",
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
                                                    message={errors.start_date || clientErrors.start_date}
                                                    className="mt-2"
                                                />
                                            </div>

                                            
                                        </div>
                                    </div>
                                    </>
                                    )}
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
                                    <InputError
                                        message={clientErrors.education}
                                        className="mt-2"
                                    />
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
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
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

                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
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

                                           <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
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

                                           <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
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

                                           <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
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
                                                    message={errors.language_malay || clientErrors.language_malay}
                                                    className="mt-2"
                                                 />
                                            </div>

                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    message={errors.language_english || clientErrors.language_english}
                                                    className="mt-2"
                                                 />
                                            </div>
 
                                           <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    isFocused={true}
                                                    placeholder="Contoh : Bahasa Mandarin / Tamil / Semai (Hanya Jika Ada)"
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
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    1)Adakah anda pernah didakwa dan disabitkan dalam mana-mana mahkamah
                                                    undang-undang untuk kesalahan jenayah atau Kesalahan dibawah Akta Dadah
                                                    Berbahaya 1952? <span className="text-red-500">*</span>
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
                                                {data.crime_charge === 'Ya' && (
                                                    <TextInput
                                                        id="crime_charge_details"
                                                        name="crime_charge_details"
                                                        value={data.crime_charge_details}
                                                        className="block w-full"
                                                        placeholder="Nyatakan butiran"
                                                        isFocused={true}
                                                        onChange={(e) =>
                                                            setData('crime_charge_details', e.target.value)
                                                        }
                                                    />
                                                )}
                                                <InputError
                                                    message={errors.crime_charge || clientErrors.crime_charge || errors.crime_charge_details}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    message={errors.bankruptcy || clientErrors.bankruptcy}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    3)Adakah anda terlibat dalam sebarang usaha perniagaan,
                                                    termasuk perniagaan keluarga?<span className="text-red-500">*</span>
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
                                                {data.business_involvement === 'Ya' && (
                                                <TextInput
                                                    id="business_involvement_details"
                                                    name="business_involvement_details"
                                                    value={data.business_involvement_details}
                                                    className="block w-full"
                                                    isFocused={true}
                                                    placeholder="Nyatakan butiran"
                                                    onChange={(e) =>
                                                        setData('business_involvement_details', e.target.value)
                                                }                                 
                                                 />)}
                                                <InputError
                                                    message={errors.business_involvement || clientErrors.business_involvement || errors.business_involvement_details}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                {(data.license === 'Ya') && (
                                                <TextInput
                                                    id="license_details"
                                                    name="license_details"
                                                    value={data.license_details}
                                                    className="block w-full"
                                                    placeholder="Sila nyatakan kelas lesen yang ada (Cth: B2,D,GDL)"
                                                    isFocused={true}
                                                    onChange={(e) =>
                                                        setData('license_details', e.target.value)
                                                }                                 
                                                 />)}
                                                <InputError
                                                    message={errors.license || clientErrors.license || errors.license_details}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    message={errors.smoker || clientErrors.smoker || errors.smoker_details}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    message={errors.drinker || clientErrors.drinker || errors.drinker_details}
                                                    className="mt-2"
                                                 />
                                            </div>                                  
                                    </div>

                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Bahagian 8 : Perubatan & Keadaan Fizikal</p>            
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
                                                <InputLabel
                                                    //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    1) Pernahkah anda atau sedang mengalami sebarang penyakit?<span className="text-red-500">*</span>
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
                                                {(data.medical_condition === 'Ya') && (
                                                    <TextInput
                                                        id="medical_condition_details"
                                                        name="medical_condition_details"
                                                        value={data.medical_condition_details}
                                                        className="block w-full"
                                                        placeholder="Nyatakan penyakit/keadaan yang dihadapi"
                                                        isFocused={true}
                                                        onChange={(e) =>
                                                            setData('medical_condition_details', e.target.value)
                                                    }                                 
                                                    />
                                                 )}
                                                <InputError
                                                    message={errors.medical_condition || clientErrors.medical_condition || errors.medical_condition_details}
                                                    className="mt-2"
                                                 />
                                            </div>

                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                {(data.physical_disability === 'Ya') && (
                                                    <TextInput
                                                        id="physical_disability_details"
                                                        name="physical_disability_details"
                                                        value={data.physical_disability_details}
                                                        className="block w-full"
                                                        placeholder="Nyatakan kecacatan fizikal yang anda hadapi"
                                                        isFocused={true}
                                                        onChange={(e) =>
                                                            setData('physical_disability_details', e.target.value)
                                                    }                                 
                                                    />
                                                 )}
                                                <InputError
                                                    message={errors.physical_disability || clientErrors.physical_disability || errors.physical_disability_details}
                                                    className="mt-2"
                                                 />
                                            </div>
                                            {(data.marital_status!="Bujang" && data.gender === "Perempuan") && (
                                                <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                        className="block w-full"
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
                                            )}                             
                                    </div>
                                </div>    
                            )}

                            {/* part 9/10/11 */}
                            {currentPart === 7 && (
                                <div>
                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Bahagian 9 : Kemahiran/ Bakat/ Hobi</p>            
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('achievement', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.achievement || clientErrors.achievement}
                                                    className="mt-2"
                                                 />
                                            </div>                                 
                                    </div>
                                
                                    <div className='mt-4 space-y-4'>    
                                    <p className='font-bold'>Bahagian 10 : Maklumat Orang Perlu Dihubungi Semasa Kecemasan</p>
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('reference_name_1', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_name_1 || clientErrors.reference_name_1}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('reference_relationship_1', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_relationship_1 || clientErrors.reference_relationship_1}
                                                    className="mt-2"
                                                 />
                                            </div> 
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('reference_phone_1', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_phone_1 || clientErrors.reference_phone_1}
                                                    className="mt-2"
                                                 />
                                            </div>                                
                                    </div>

                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Bahagian 11 : Rujukan (Selain Keluarga)</p>
                                    <div className='mt-2'>
                                        <p className='text-sm font-bold underline'>Rujukan Pertama</p>            
                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('reference_name_2', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_name_2}
                                                    className="mt-2"
                                                 />
                                            </div>

                                            <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('reference_phone_2', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_phone_2}
                                                    className="mt-2"
                                                 />
                                            </div>
 
                                           <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
                                                    onChange={(e) =>
                                                        setData('reference_company_2', e.target.value)
                                                }                                 
                                                 />
                                                <InputError
                                                    message={errors.reference_company_2}
                                                    className="mt-2"
                                                 />
                                           </div>

                                           <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    className="block w-full"
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
                                    <div className="grid flex-1 gap-1 md:grid-cols-1">
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
                                                    message={errors.resume || clientErrors.resume}
                                                    className="mt-2"
                                                 />
                                           </div> 
                                    </div> */}
                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Gambar Passport</p>
                                    <div className="grid flex-1 gap-1 md:grid-cols-1">
                                                <InputLabel
                                                //  htmlFor="vacancies_title"
                                                    value={
                                                 <>
                                                    Muat Nail Fail Gambar berukuran passport <span className="text-red-500">*</span>
                                                 </>
                                            }
                                                 />
                                                <FileInput
                                                    id="resume"
                                                    name="resume"
                                                    accept=".png,.jpg,.jpeg"
                                                    maxSize={2}
                                                    showPreview={true}
                                                    required
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

                            {/* part summary */}
                            {currentPart === 8 && (
                                <div>
                                    <div className='mt-4 space-y-4'>
                                    <p className='font-bold'>Ringkasan Permohonan</p>                        
                                    </div>

                                    <div>
                                        {/* part 1 : butiran peribadi */}
                                        <div>
                                        <div className='flex flex-col md:flex-row'>
                                            <div className='md:w-1/5'>
                                                <div className="mt-4 w-48 overflow-hidden border border-slate-200 rounded">
                                                    {resumePreviewUrl ? (
                                                    <img
                                                        src={resumePreviewUrl}
                                                        alt="Passport attachment"
                                                        className="w-full h-full object-contain rounded"
                                                    />
                                                    ) : (
                                                        <p className="text-sm text-slate-500">No attachment available.</p>
                                                    )}
                                                </div>
                                            </div>
            
                                            <div className='md:w-4/5 pt-4'>
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Nama
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.name} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                                                        <div className=''>
                                                            <InputLabel
                                                                htmlFor="vendor_status"
                                                                value={
                                                                    <>
                                                                        Tarikh Lahir
                                                                    </>
                                                                }
                                                            />
                                                            <ValueView value={parsed.dateOfBirth} />
                                                        </div>
            
                                                        <div className=''>
                                                            <InputLabel
                                                                htmlFor="vendor_status"
                                                                value={
                                                                    <>
                                                                        Jantina
                                                                    </>
                                                                }
                                                            />
                                                            <ValueView value={parsed.gender} />
                                                        </div>
            
                                                        <div className=''>
                                                            <InputLabel
                                                                htmlFor="vendor_status"
                                                                value={
                                                                    <>
                                                                        Bangsa
                                                                    </>
                                                                }
                                                            />
                                                            <ValueView value={parsed.ethnicity} />
                                                        </div>
                                                    </div>
            
                                                    <div className='grid flex-1 gap-2 md:grid-cols-3 my-2'>
                                                        <div className=''>
                                                            <InputLabel
                                                                htmlFor="vendor_status"
                                                                value={
                                                                    <>
                                                                        Umur
                                                                    </>
                                                                }
                                                            />
                                                            <ValueView value={parsed.age} />
                                                        </div>
            
                                                        <div className=''>
                                                            <InputLabel
                                                                htmlFor="vendor_status"
                                                                value={
                                                                    <>
                                                                        Kad Pengenalan
                                                                    </>
                                                                }
                                                            />
                                                            <ValueView value={parsed.ic_number} />
                                                        </div>
            
                                                        <div className=''>
                                                            <InputLabel
                                                                htmlFor="vendor_status"
                                                                value={
                                                                    <>
                                                                        Status Perkahwinan
                                                                    </>
                                                                }
                                                            />
                                                            <ValueView value={parsed.marital_status} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {(data.marital_status != "Bujang") && (
                                        <div className='grid flex-1 gap-2 my-2'>
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_status"
                                                    value={
                                                        <>
                                                            Bilangan Anak
                                                        </>
                                                    }
                                                />
                                                <ValueView value={parsed.children_num} />
                                            </div>
                                        </div>
                                        )}
            
                                        <div className='grid flex-1 gap-2 md:grid-cols-2 my-2'>
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_status"
                                                        value={
                                                            <>
                                                                Alamat Tetap
                                                            </>
                                                        }
                                                    />
                                                    <ValueView value={parsed.address} />
                                                </div>
                                            
                                                <div className=''>
                                                    <InputLabel
                                                        htmlFor="vendor_status"
                                                        value={
                                                            <>
                                                                Alamat Surat Menyurat
                                                            </>
                                                        }
                                                    />
                                                    <ValueView value={parsed.address_postal} />
                                                </div>
                                        </div>
            
                                        <div className='grid flex-1 gap-2 md:grid-cols-2 my-2'>
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_status"
                                                    value={
                                                        <>
                                                            No. Telefon Bimbit
                                                        </>
                                                    }
                                                />
                                                <ValueView value={parsed.no_phone} />
                                            </div>
            
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_status"
                                                    value={
                                                        <>
                                                            No. Telefon Rumah
                                                        </>
                                                    }
                                                />
                                                <ValueView value={parsed.phone_home} />
                                            </div>
                                        </div>
            
                                        <div className='grid flex-1 gap-2 my-2'>
                                            <div className=''>
                                                <InputLabel
                                                    htmlFor="vendor_status"
                                                    value={
                                                        <>
                                                            E-Mel 
                                                        </>
                                                    }
                                                />
                                                <ValueView value={parsed.email} />
                                            </div>
                                        </div>
                                        </div>
            
                                        {/* part 2 : butiran keluarga, pendidikan, bekerja */}
                                        <div>
                                            <div>
                                                <div className='mt-4'>
                                                <p className='text-l font-bold'>Butiran Keluarga</p>
                                                </div>
                                                <DataTablePrintView columns={familycolumns} data={parsed.familyMembers ?? []} className='mt-4'/>
                                            </div>
            
                                            <div>
                                                <div className='mt-4'>
                                                <p className='text-l font-bold'>Taraf Pendidikan</p>
                                                </div>
                                                <DataTablePrintView columns={educationcolumns} data={parsed.education ?? []} className='mt-4'/>
                                            </div>
            
                                            <div>
                                                <div className='mt-4'>
                                                <p className='text-l font-bold'>Pengalaman Bekerja</p>
                                                </div>
                                                <DataTablePrintView columns={employercolumns} data={parsed.employers ?? []} className='mt-4'/>
                                            </div>
                                        </div>
            
                                        {/* part 3 : maklumat tambahan pekerjaan */}
                                        <div>
                                            <div className='mt-9'>
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Gaji Semasa
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={formatCurrency(parsed.salary ?? 0)} />
                                                    </div>
                                                </div>
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Elaun Semasa(jika ada)
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={formatCurrency(parsed.allowance ?? 0)} />
                                                    </div>
                                                </div>
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Laporkan kepada siapa?
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.report_to ?? "-"} />
                                                    </div>  
                                                </div>
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Bilangan Orang yang Melaporkan Kepada Anda
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.report_count ?? "-"} />
                                                    </div>
                                                </div>
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Tempoh Notis Perletakan Jawatan Untuk Pekerjaan Semasa
                                                                </>
                                                            }
                                                        />
                                                        <div className='flex gap-2 items-center'>
                                                            <ValueView value={parsed.notice_period ?? "-"} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
            
                                        {/* part 4 : Penguasaan Bahasa */}
                                        <div>
                                            <div>
                                                <div className='mt-4'>
                                                <p className='text-l font-bold'>Penguasaan Bahasa</p>
                                                </div>
                                                <table className="w-full border-collapse border border-gray-400 mt-4">
                                                    <thead>
                                                        <tr>
                                                            <th className="border border-gray-900 bg-gray-200 w-1/2">NAMA BAHASA</th>
                                                            <th className="border border-gray-900 bg-gray-200 w-1/2">STATUS PENGUASAAN</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr>
                                                            <td className="border border-gray-900 w-1/2">Bahasa Melayu</td>
                                                            <td className="border border-gray-900 w-1/2">{parsed.language_malay}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-gray-900 w-1/2">Bahasa Inggeris</td>
                                                            <td className="border border-gray-900 w-1/2">{parsed.language_english}</td>
                                                        </tr>
                                                        <tr>
                                                            <td className="border border-gray-900 w-1/2">Bahasa lain(jika ada):{parsed.other_language ?? "-"}</td>
                                                            <td className="border border-gray-900 w-1/2">{parsed.language ?? "-"}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
            
                                        </div>
                                        
                                        {/* part 5 : Maklumat Lain */}
                                        <div>
                                            <div>
                                                <div className='mt-4'>
                                                <p className='text-l font-bold'>Maklumat Lain</p>
                                                </div>
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    1)Adakah anda pernah didakwa dan disabitkan dalam mana-mana mahkamah
                                                                undang-undang untuk kesalahan jenayah atau Kesalahan dibawah Akta Dadah
                                                                Berbahaya 1952?
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.crime_charge} />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    2)Adakah anda diisytiharkan bankrap?
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.bankruptcy} />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    3)Adakah anda terlibat dalam sebarang usaha perniagaan,
                                                                termasuk perniagaan keluarga?
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.business_involvement} />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    4)Adakah anda mempunyai lesen memandu?
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.license} />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    5)Adakah anda seorang perokok?
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.smoker} />
                                                    </div>
                                                </div>  
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    6)Adakah anda seorang peminum arak?
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.drinker} />
                                                    </div>
                                                </div> 
            
                                            </div>
                                        </div>
            
                                        {/* part 6 : Maklumat perubatan */}
                                        <div>
                                            <div>
                                                <div className='mt-4'>
                                                <p className='text-l font-bold'>Perubatan & Keadaan Fizikal</p>
                                                </div>
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    1) Pernahkah anda atau sedang mengalami sebarang penyakit?
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.medical_condition} />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    2) Adakah anda mengalami kecacatan fizikal?
                                                                </>
                                                            }
                                                        />
                                                        <ValueView value={parsed.physical_disability} />
                                                    </div>
                                                </div> 
            
                                                {(data.gender != "Lelaki" || (data.gender === "Perempuan" && data.marital_status !== "Bujang")) && (
                                                    <div className='grid flex-1 gap-2 my-2'>
                                                        <div className=''>
                                                            <InputLabel
                                                                htmlFor="vendor_status"
                                                                value={
                                                                    <>
                                                                        3) Adakah anda sedang hamil atau merancang memiliki
                                                                    bayi tidak lama lagi?
                                                                    </>
                                                                }
                                                            />
                                                            <ValueView value={parsed.pregnancy_status ?? "-"} />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
            
                                        {/* part 7 : kemahiran */}
                                        <div>
                                            <div>
                                                <div className='mt-4'>
                                                <p className='text-l font-bold'>Kemahiran/Bakat/Hobi</p>
                                                </div>
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    <ValueView value={parsed.achievement}  />
                                                                </>
                                                            }
                                                        />
                                                    </div>
                                                </div> 
                                            </div>
                                        </div>
            
                                        {/* part 8 : rujukan waris */}
                                        <div>
                                            <div>
                                                <div className="mt-4 border-t border-gray-500 pt-4">
                                                <p className='text-l font-bold'>Orang untuk dihubungi jika berlaku kecemasan</p>
                                                </div>
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Nama 
                                                                </>
                                                            }                                                
                                                        />
                                                            <ValueView value={parsed.reference_name_1}  />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Hubungan
                                                                </>
                                                            }                                                
                                                        />
                                                            <ValueView value={parsed.reference_relationship_1}  />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    No. Telefon 
                                                                </>
                                                            }                                                
                                                        />
                                                            <ValueView value={parsed.reference_phone_1}  />
                                                    </div>
                                                </div> 
                                            </div>
                                        </div>
            
                                        {/* part 9: rujukan */}
                                        <div>
                                            <div className="mt-4 border-t border-gray-500 pt-4">  
                                                <p className='text-l font-bold'>Rujukan</p>                                    
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Nama 
                                                                </>
                                                            }                                                
                                                        />
                                                            <ValueView value={parsed.reference_name_2 ?? "-"}  />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    No. Telefon
                                                                </>
                                                            }                                                
                                                        />
                                                            <ValueView value={parsed.reference_phone_2 ?? "-"}  />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Nama Syarikat
                                                                </>
                                                            }                                                
                                                        />
                                                            <ValueView value={parsed.reference_company_2 ?? "-"}  />
                                                    </div>
                                                </div> 
            
                                                <div className='grid flex-1 gap-2 my-2'>
                                                    <div className=''>
                                                        <InputLabel
                                                            htmlFor="vendor_status"
                                                            value={
                                                                <>
                                                                    Jawatan
                                                                </>
                                                            }                                                
                                                        />
                                                            <ValueView value={parsed.reference_position_2 ?? "-"}  />
                                                    </div>
                                                </div> 
                                            </div>
                                        </div>
                                    </div>

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
                            {currentPart === totalParts && (
                                <PrimaryButton
                                    onClick={submit}
                                    // disabled={currentPart === totalParts}
                                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                                >
                                    Hantar
                                </PrimaryButton>
                            )}
                            {currentPart !== totalParts && (
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
