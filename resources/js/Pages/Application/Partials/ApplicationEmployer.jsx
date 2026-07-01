// import { Inertia } from '@inertiajs/inertia'; 
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import RadioGroup from '@/Components/RadioGroup';
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


export default function ApplicationEmployer({onAddEmployer}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        employer_name: '',
        position: '',
        start_year: '',
        end_year: '',
        final_salary: '',
        reason_for_leaving: '',
    });

    const [startSchool, setStartSchool] = useState(false);
    const [endSchool, setEndSchool] = useState(false);

    const [dropdown, setDropdown] = useState("dropdown");

    const handleEducationChange = (educationLevel) => {
        setData('education_level', educationLevel);
    }
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        console.log('onSuccess', data);

        // Call the parent callback to add the board member
        if (onAddEmployer) {
            onAddEmployer({
                id: Date.now(), // Generate unique ID
                ...data
            });
        }


        // Reset form and close dialog
        reset(
            'employer_name',
            'position',
            'start_year',
            'end_year',
            'final_salary',
            'reason_for_leaving',
        );
        setIsDialogOpen(false);
    };

    // console.log('vendor_application_id', vendor_application_id);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
            'employer_name',
            'position',
            'start_year',
            'end_year',
            'final_salary',
            'reason_for_leaving',
            );
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    + Tambah Maklumat Pekerjaan
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Tambah Maklumat Pekerjaan</DialogTitle>
                </DialogHeader>
                <div className="mt-4">

                    <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                       < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="vacancies_title"
                                    value={
                                        <>
                                            Nama Majikan<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="employer_name"
                                    name="employer_name"
                                    value={data.employer_name}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('employer_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.employer_name}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="vacancies_location"
                                    value={
                                        <>
                                            Jawatan<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="position"
                                    name="position"
                                    value={data.position}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('position', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.position}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        
                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="vacancies_location"
                                    value={
                                        <>
                                            Tahun Mula Bekerja<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="start_year"
                                    name="start_year"
                                    value={data.start_year}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('start_year', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.start_year}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="vacancies_location"
                                    value={
                                        <>
                                            Tahun Habis Bekerja
                                        </>
                                    }
                                />
                                <TextInput
                                    id="end_year"
                                    name="end_year"
                                    value={data.end_year}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('end_year', e.target.value)
                                    }
                                    
                                />
                                <InputError
                                    message={errors.end_year}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="vacancies_location"
                                    value={
                                        <>
                                            Gaji Akhir(RM)<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="final_salary"
                                    name="final_salary"
                                    value={data.final_salary}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('final_salary', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.final_salary}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="vacancies_location"
                                    value={
                                        <>
                                            Sebab Berhenti Kerja
                                        </>
                                    }
                                />
                                <TextInput
                                    id="reason_for_leaving"
                                    name="reason_for_leaving"
                                    value={data.reason_for_leaving}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('reason_for_leaving', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.reason_for_leaving}
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