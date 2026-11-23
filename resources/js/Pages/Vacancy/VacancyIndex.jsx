import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { Link } from '@inertiajs/react';
import Alert from '@/Components/Alert';
import { Badge } from '@/Components/ui/badge';
import VacancyAddVacancy from './Partials/VacancyAddVacancy';
import VacancyDeleteVacancy from './Partials/VacancyDeleteVacancy';
import { useState, useEffect} from 'react';
import { FileText } from 'lucide-react';

export default function VacancyIndex({vacancy, success}) {

    const columns = [
        // { Header: 'Nama', accessor: 'allottee_name' },
        // { Header: 'No. Fail / Geran', accessor: 'lot_file_num' },
        {
            Header: 'Nama Kerja Kosong',
            accessor: ['vacancies_title'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.vacancies_title}</div>
                    <div className='text-sm text-muted-foreground'>{row.vacancies_description}</div>
                </div>
            ),
        },

        {
            Header: 'Tempoh Permohonan',
            accessor: ['start_date'],
            Cell: ({ row }) => (
                <div className="space-y-0.5 text-sm tabular-nums">
                    <div><span className="text-muted-foreground">Buka:</span> {formatDateTime(row.start_date)}</div>
                    <div><span className="text-muted-foreground">Tutup:</span> {formatDateTime(row.end_date)}</div>
                </div>
            ),
        },

        {
            Header: 'Status',
            accessor: 'status',
            Cell: ({ row }) => {
                const now = new Date();
                if (now < new Date(row.start_date)) {
                    return <Badge variant="outline">Belum Dibuka</Badge>;
                }
                if (now > new Date(row.end_date)) {
                    return <Badge variant="secondary" className="text-muted-foreground">Ditutup</Badge>;
                }
                return <Badge className="border-transparent bg-highlight text-highlight-foreground hover:bg-highlight">Dibuka</Badge>;
            },

        },

        {
            Header: 'Pautan Iklan',
            accessor: ['ads_link'],
            Cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    {row.ads_pdf && (
                        <a href={route('vacancy.ads', row.id)} target='_blank' rel='noreferrer' className='flex items-center gap-1 text-sm font-medium text-primary hover:underline'>
                            <FileText className="h-4 w-4" /> PDF Iklan
                        </a>
                    )}
                    {row.ads_link && (
                        <a href={row.ads_link} target='_blank' rel='noreferrer' className='break-all text-sm font-medium text-primary hover:underline'>{row.ads_link}</a>
                    )}
                    {!row.ads_pdf && !row.ads_link && <span className="text-sm text-muted-foreground">-</span>}
                </div>
            ),
        },
        // {
        //     Header: 'Jenis Entiti',
        //     accessor: ['vendor_type',],
        //     Cell: ({ row }) => (
        //         <div className="flex flex-col text-sm">
        //             {row.vendor_type === 'company' && ('Syarikat')}
        //             {row.vendor_type === 'gov_entity' && ('Perbadanan / Entiti Kerajaan')}
        //             {row.vendor_type === 'cooperation' && ('Koperasi')}
        //             {row.vendor_type === 'organisation' && ('Pertubuhan / Kelab')}
        //         <p> </p>
        //             {row.vendor_company_type === 'bhd' && ('Berhad')}
        //             {row.vendor_company_type === 'sdn-bhd' && ('Sendirian Berhad')}
        //             {row.vendor_company_type === 'partnership' && ('Perkongsian')}
        //             {row.vendor_company_type === 'sole-ownership' && ('Milikan Tunggal')}
        //         </div>
        //     ),
        // },
        // { Header: 'No. Telefon', accessor: 'vendor_phone' },
        {
            Header: 'Tindakan',
            accessor: 'actions',
            Cell: ({ row }) => (
                <div className="flex space-x-2 gap-2">
                    <VacancyAddVacancy vacancy={row} />
                    <VacancyDeleteVacancy vacancy={row}/>
                    {/* {<PrimaryButton
                        className="px-2 py-1 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={() => handleDelete(row.id)}  
                    >
                        Padam
                    </PrimaryButton>} */}
                </div>
            ),
        },
    ];

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



    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return '-';
        const date = new Date(dateTimeString);
        
        // Convert to UTC+8
        
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h2>Kerja Kosong</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Urus jawatan yang diiklankan kepada pemohon.</p>
                    </div>
                    <VacancyAddVacancy/>
                </div>
            }
        >
            <Head title="Kerja Kosong" />

            

            <div className="py-8">
                
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            {successMessage && (
                                <div className="mb-4">
                                    <Alert key={success} type="success" message={success} />
                                </div>

                            )}

                            <DataTable columns={columns} data={vacancy} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
    
}
