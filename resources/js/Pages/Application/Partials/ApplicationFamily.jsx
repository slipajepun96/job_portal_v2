// import { Inertia } from '@inertiajs/inertia'; 
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';

import { useForm } from '@inertiajs/react';
import { Calendar } from "@/Components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils";
import { format } from "date-fns";


export default function ApplicationFamily({onAddFamilyMember}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        family_name: '',
        relationship: '',
        family_age: '',
        family_occupation: '',
        family_occupation_name: '',
    });

    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    const [dropdown, setDropdown] = useState("dropdown");
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);

        // Call the parent callback to add the board member
        if (onAddFamilyMember) {
            onAddFamilyMember({
                id: Date.now(), // Generate unique ID
                ...data
            });
        }


        // Reset form and close dialog
        reset(
            'family_name',
            'relationship',
            'family_age',
            'family_occupation',
            'family_occupation_name',
        );
        setIsDialogOpen(false);
        
    };

    // console.log('vendor_application_id', vendor_application_id);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
            'family_name',
            'relationship',
            'family_age',
            'family_occupation',
            'family_occupation_name',
            );
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    + Tambah Maklumat Ahli Keluarga
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Tambah Maklumat Ahli Keluarga</DialogTitle>
                </DialogHeader>
                <div className="mt-4">

                    <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                       < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    htmlFor="family_name"
                                    value={
                                        <>
                                            Nama<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="family_name"
                                    name="family_name"
                                    value={data.family_name}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('family_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.family_name}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    htmlFor="vacancies_location"
                                    value={
                                        <>
                                            Hubungan<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="relationship"
                                    name="relationship"
                                    value={data.relationship}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('relationship', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.relationship}
                                    className="mt-2"
                                />
                            </div>
                        </div>< div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="vacancies_description"
                                    value={
                                        <>
                                            Umur<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="family_age"
                                    name="family_age"
                                    value={data.family_age}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('family_age', e.target.value)
                                    }
                                    required
                                
                                />
                                <InputError
                                    message={errors.family_age}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="start_date"
                                    value={
                                        <>
                                            pekerjaan
                                        </>
                                    }
                                />
                                <TextInput
                                    id="family_occupation"
                                    name="family_occupation"
                                    value={data.family_occupation}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('family_occupation', e.target.value)
                                    }
                                
                                />
                                
                                    <InputError
                                    message={errors.family_occupation}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="end_date"
                                    value={
                                        <>
                                            Nama Majikan/Sekolah
                                        </>
                                    }
                                />
                               <TextInput
                                    id="family_occupation_name"
                                    name="family_occupation_name"
                                    value={data.family_occupation_name}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('family_occupation_name', e.target.value)
                                    }
                                
                                />
                                <InputError
                                    message={errors.family_occupation_name}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <PrimaryButton disabled={processing}>
                            Simpan
                        </PrimaryButton>
                    </div>
                </form>

                </div>
            </DialogContent>
        </Dialog>
    );
}