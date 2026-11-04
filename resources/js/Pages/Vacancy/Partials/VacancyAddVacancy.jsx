// import { Inertia } from '@inertiajs/inertia'; 
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus } from 'lucide-react';
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


export default function VacancyAddVacancy({}) {

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        vacancies_title: '',
        vacancies_location: '',
        vacancies_description: '',
        start_date: '',
        start_time: '08:00',
        end_date: '',
        end_time: '17:00',
        ads_link: '',
    });

    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    const [dropdown, setDropdown] = useState("dropdown");
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        // console.log('onSuccess', data);

        // Send the date and time together, e.g. "2026-11-04 08:00"
        transform((data) => ({
            ...data,
            start_date: data.start_date ? `${data.start_date} ${data.start_time}` : '',
            end_date: data.end_date ? `${data.end_date} ${data.end_time}` : '',
        }));

        post(route('vacancy.save'), {
            onSuccess: () => {
                reset(
                    'vacancies_title',
                    'vacancies_location',
                    'vacancies_description',
                    'start_date',
                    'start_time',
                    'end_date',
                    'end_time',
                    'ads_link',
                );
                // Close the dialog
                // console.log('onSuccess', data);
                setIsDialogOpen(false);
            },
        });
    };

    // console.log('vendor_application_id', vendor_application_id);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (!isOpen) {
            reset(
              'vendor_id',
            );
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                <PrimaryButton type="button">
                    <Plus /> Tambah Kerja Kosong
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Tambah Kerja Kosong</DialogTitle>
                </DialogHeader>
                <div className="mt-4">

                    <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                       < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    htmlFor="vacancies_title"
                                    value={
                                        <>
                                            Nama Kerja Kosong<span className="text-destructive">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="vacancies_title"
                                    name="vacancies_title"
                                    value={data.vacancies_title}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('vacancies_title', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.vacancies_title}
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
                                            Lokasi Kerja Kosong<span className="text-destructive">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="vacancies_location"
                                    name="vacancies_location"
                                    value={data.vacancies_location}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('vacancies_location', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.vacancies_location}
                                    className="mt-2"
                                />
                            </div>
                        </div>< div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    htmlFor="vacancies_description"
                                    value={
                                        <>
                                            Keterangan Kerja Kosong
                                        </>
                                    }
                                />
                                <TextInput
                                    id="vacancies_description"
                                    name="vacancies_description"
                                    value={data.vacancies_description}
                                    className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('vacancies_description', e.target.value)
                                    }
                                    
                                
                                />
                                <InputError
                                    message={errors.vacancies_description}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    htmlFor="start_date"
                                    value={
                                        <>
                                            Tarikh & Masa Mula<span className="text-destructive">*</span>
                                        </>
                                    }
                                />
                                <div className="mt-1 grid grid-cols-[1fr_8rem] gap-2">
                                <Popover open={openStartDate} onOpenChange={setOpenStartDate} modal={false}>
                                        <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className={cn(
                                                            "h-9 w-full text-left text-sm bg-background border border-border rounded-md px-3 py-2",
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
                                                            setOpenStartDate(false);
                                                        }}
                                                    captionLayout={dropdown}
                                                    fromYear={1900}
                                                    toYear={2100}
                                                    className="rounded-lg border shadow-sm"
                                                />
                                                </PopoverContent>
                                        </Popover>
                                <TextInput
                                    id="start_time"
                                    type="time"
                                    aria-label="Masa"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    required
                                />
                                </div>
                                    <InputError
                                    message={errors.start_date}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    htmlFor="end_date"
                                    value={
                                        <>
                                            Tarikh & Masa Tutup<span className="text-destructive">*</span>
                                        </>
                                    }
                                />
                                <div className="mt-1 grid grid-cols-[1fr_8rem] gap-2">
                                <Popover open={openEndDate} onOpenChange={setOpenEndDate} modal={false}>
                                                <PopoverTrigger asChild>
                                                    <button
                                                        type="button"
                                                        className={cn(
                                                            "h-9 w-full text-left text-sm bg-background border border-border rounded-md px-3 py-2",
                                                            !data.end_date && "text-muted-foreground"
                                                        )}
                                                    >
                                                        { data.end_date ? format(data.end_date, "dd/MM/yyyy") : "Pilih Tarikh"}
                                                    </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" trapFocus={false}>
                                                    <Calendar
                                                    mode="single"
                                                    selected={data.end_date ? new Date(data.end_date) : undefined}
                                                    onSelect={selectedDate => {
                                                            setData('end_date', selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '');
                                                            setOpenEndDate(false);
                                                        }}
                                                    captionLayout={dropdown}
                                                    fromYear={1900}
                                                    toYear={2100}
                                                    className="rounded-lg border shadow-sm"
                                                />
                                                </PopoverContent>
                                            </Popover>
                                <TextInput
                                    id="end_time"
                                    type="time"
                                    aria-label="Masa"
                                    value={data.end_time}
                                    onChange={(e) => setData('end_time', e.target.value)}
                                    required
                                />
                                </div>
                                <InputError
                                    message={errors.end_date}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        < div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel
                                    htmlFor="ads_link"
                                    value={
                                        <>
                                            Pautan ke Iklan Jawatan<span className="text-destructive">*</span>
                                        </>
                                    }
                                />
                                <TextInput
                                    id="ads_link"
                                    name="ads_link"
                                        value={data.ads_link}
                                        className="block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData('ads_link', e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.ads_link}
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