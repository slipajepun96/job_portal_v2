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


export default function ApplicationEducation({onAddEducation}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        school_name: '',
        start_school: '',
        end_school: '',
        education_level: '',
        education_field: '',
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
        if (onAddEducation) {
            onAddEducation({
                id: Date.now(), // Generate unique ID
                ...data
            });
        }


        // Reset form and close dialog
        reset(
            'school_name',
            'start_school',
            'end_school',
            'education_level',
            'education_field',
        );
        setIsDialogOpen(false);
    };

    // console.log('vendor_application_id', vendor_application_id);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
            'school_name',
            'start_school',
            'end_school',
            'education_level',
            'education_field',
            );
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton variant="outline">
                    + Tambah Maklumat Pendidikan
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Tambah Maklumat Pendidikan</DialogTitle>
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
                                            Nama Sekolah/IPT<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="school_name"
                                    name="school_name"
                                    value={data.school_name}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('school_name', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.school_name}
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
                                            Tahun Mula<span className="text-red-500">*</span>
                                        </>
                                    }
                                />
                            
                                <TextInput
                                    id="start_school"
                                    name="start_school"
                                    type="number"
                                    value={data.start_school}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('start_school', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.start_school}
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
                                            Tahun Akhir<span className="text-red-500">*</span>
                                        </>
                                    }
                                 />
                                <TextInput
                                    id="end_school"
                                    name="end_school"
                                    type="number"
                                    value={data.end_school}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('end_school', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.end_school}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="grid flex-1 gap-1 md:grid-cols-1">
                            <InputLabel
                                 //  htmlFor="vacancies_title"
                                value={
                             <>
                                Tahap Pendidikan<span className="text-red-500">*</span>
                             </>
                            }
                             />
                            <RadioGroup
                                name="education_level"
                                value={data.education_level}
                                 onChange={handleEducationChange}
                                options={[
                                { value: 'SPM', label: 'SPM' },
                                { value: 'STPM', label: 'STPM' },
                                { value: 'Asasi', label: 'Asasi'},
                                { value: 'Matrikulasi', label: 'Matrikulasi' },
                                { value: 'Diploma', label: 'Diploma' },
                                { value: 'Degree', label: 'Ijazah Sarjana Muda' },
                                { value: 'Master', label: 'Ijazah Sarjana' },
                                { value: 'PhD', label: 'Doktor Falsafah' },
                            ]}
                            columns={8}
                            />
                            <InputError
                                message={errors.education_level}
                                className='mt-2'
                             />
                        </div>

                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    // htmlFor="end_date"
                                    value={
                                        <>
                                            Nama Program/ Kursus/ Bidang
                                        </>
                                    }
                                />
                               <TextInput
                                    id="education_field"
                                    name="education_field"
                                    value={data.education_field}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('education_field', e.target.value)
                                    }
                                
                                />
                                <InputError
                                    message={errors.education_field}
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