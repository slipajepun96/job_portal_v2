import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import Alert from '@/Components/Alert';
import { useState, useEffect} from 'react';
// import ApplicationIndex from './Application/ApplicationIndex';
import ViewApplicationReceived from './ViewApplicationReceived';
import ApplicationDelete from './Partials/ApplicationDelete';
import { Eye, Paperclip, Printer } from 'lucide-react';
import { ChevronLeft } from 'lucide-react';

export default function ApplicationReceivedIndex({applications, vacancies, success, backRoute}) {

    const vacancyTitle = ''

function getVacancyTitle(vacancy_uuid)
{
    const vacancy = vacancies.find(v=> v.id === vacancy_uuid)
    return vacancy? vacancy.vacancies_title:'Ralat';

    // console.log(vacancyTitle);
}

// console.log(applications);
    const columns = [
        {
            Header: 'Nama Kerja Kosong',
            accessor: [],
            Cell: ({ row }) => {
                const dataSnapshot = JSON.parse(row.application_snapshot);
                return (
                    <div className="flex flex-col">
                        
                        <div className='font-semibold'>{dataSnapshot.name}</div>
                        <div className='text-sm tabular-nums text-muted-foreground'>{row.candidate_nric}</div>
                    </div>
                );
            },
        },

        {
            Header: 'Jawatan',
            accessor: [],
            Cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <div>{getVacancyTitle(row.vacancy_uuid)}</div> 
                </div>
            ),

        },

        {
            Header: 'Tarikh Hantar',
            accessor: ['created_at'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='tabular-nums text-muted-foreground'>{formatDateTime(row.created_at)}</div> 
                </div>
            ),

        },

        {
            Header: 'Tindakan',
            accessor: 'actions',
            Cell: ({ row }) => {
                 const dataSnapshot = JSON.parse(row.application_snapshot);
                return (
                <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm">
                        <Link href={route('viewApplicationReceived', row.id)}>
                            <Eye /> Papar
                        </Link>
                    </Button>

                    <Button asChild size="sm" variant="outline">
                        <a href={route('applicationPdf', row.id)} target='_blank' rel='noreferrer'>
                            <Printer /> Cetak
                        </a>
                    </Button>

                    {Object.keys(dataSnapshot.resume).length > 0 && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                                e.preventDefault();
                                window.location.href = route('application.downloadAttachment', { id: row.id });
                            }}
                        >
                            <Paperclip /> Lampiran
                        </Button>
                    )}


                    <ApplicationDelete applications={row}/>
                </div>)
            }
            
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
        
        return `${day}/${month}/${year}`;
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-2">
                    {backRoute === 'dashboard' && (
                    <Link
                        href={route('dashboard')}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </Link>)}
                    <h2>Senarai Permohonan</h2>
                </div>
            }
        >
            <Head title="Senarai Permohonan" />
            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            {successMessage && (
                                <div className="mb-4">
                                    <Alert type="success" message="Berjaya dipadam." />
                                </div>

                            )}

                            <DataTable columns={columns} data={applications} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );   
}
