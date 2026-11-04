import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import DataTable from '@/Components/DataTable';
import { Link } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { UserPlus } from 'lucide-react';
import DeleteUser from './Partials/DeleteUser';
import { useState, useEffect} from 'react';

export default function User({user}) {
    const columns = [
        // { Header: 'Nama', accessor: 'allottee_name' },
        // { Header: 'No. Fail / Geran', accessor: 'lot_file_num' },
        {
            Header: 'Nama',
            accessor: ['name'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='font-semibold'>{row.name}</div> 
                </div>
            ),
        },

        {
            Header: 'Jawatan',
            accessor: ['designation'],
            Cell: ({ row }) => (
                <div className="flex flex-col">
                    <div className='text-muted-foreground'>{row.designation}</div> 
                </div>
            ),
        },

        {
            Header: 'Tarikh',
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
            Cell: ({ row }) => (
                <div className="flex space-x-2 gap-2">
                    <DeleteUser user={row}/>
                </div>
            ),
        },
    ];

    const submitRegister = (e) => 
    {
        e.preventDefault();

        post(route('vendor.register.store'), {
            preserveScroll: true,
            preserveState: (page) => Object.keys(page.props.errors).length,
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }; 

    const formatDateTime = (dateTimeString) => 
    {
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
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2>Pengguna</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Urus akaun pentadbir sistem.</p>
                </div>
                <Button asChild>
                    <Link href={route('register')}>
                        <UserPlus /> Daftar Pengguna
                    </Link>
                </Button>
            </div>
            }
        >
            <Head title="Pengguna" />

           

            <div className="py-8">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm">
                        <div className="p-6">
                            <DataTable columns={columns} data={user} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
