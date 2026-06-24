import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTablePrintView from '@/Components/DataTablePrintView';
import { Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState, useEffect} from 'react';
import InputLabel from '@/Components/InputLabel';
import ValueView from '@/Components/ValueView';
import { ChevronLeft } from 'lucide-react';
// import ApplicationDelete from './Partials/ApplicationDelete';

export default function ViewApplicationReceived({application, success}) {

    // const vacancyTitle = ''
    // // return <h1>test</h1>;

    // function getVacancyTitle(vacancy_uuid)
    // {
    //     const vacancy = vacancies.find(v=> v.id === vacancy_uuid)
    //     return vacancy? vacancy.vacancies_title:'Ralat';

    //     // console.log(vacancyTitle);
    // }

console.log(application.application_snapshot);

const parsed=JSON.parse(application.application_snapshot)
console.log(parsed);
    const familycolumns = [
        {Header: 'Nama', accessor: ['family_name'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-normal text-sm'>{row.family_name}</div>
                </div>
            ),
        },
        {Header: 'Hubungan', accessor: ['relationship'],
             Cell: ({ row }) => (
                <div className="flex flex-col">
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

    const [successMessage, setSuccessMessage] = useState(false);
    // const displaySuccessMessage = () => {
    // if (success) {
    //     setSuccessMessage(true);
    // }}
    useEffect(() => {
        if (success) {
            setSuccessMessage(true);
            // optional: hide after a few seconds
            // setTimeout(() => setSuccessMessage(false), 3000);
        }
    }, [success]);



    const formatCurrency = (value) => {
        if (value === null || value === undefined) return '-';
        return `RM ${parseFloat(value).toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        
        // Convert to UTC+8
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${day}/${month}/${year}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => window.history.back()}
                        className="hover:bg-gray-100 rounded px-1 transition-colors"
                    >
                        <ChevronLeft className="w-7 h-7" />
                    </button>
                    {/* <Link
                        href={route('applicationReceived')}
                        className="hover:bg-gray-100 rounded px-1 transition-colors"
                    >
                        <ChevronLeft className="w-7 h-7" />
                    </Link> */}
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Maklumat Pemohon
                </h2>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {successMessage && (
                                <div className="p-4 bg-green-300 rounded-lg shadow-md mb-3">
                                    Berjaya Dipadam!
                                </div>

                            )}
                            
                            {/* part 1 : butiran peribadi */}
                            <div>
                            <div className='flex flex-col md:flex-row'>
                                <div className='md:w-1/5'>
                                    <div className="mt-4 w-48 overflow-hidden border border-slate-200 rounded">
                                        {parsed.resume ? (
                                        <img
                                            src={route('application.resume', application.id)}
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
                                                <span>Minggu</span>
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
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
    
}
