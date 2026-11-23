// import { Inertia } from '@inertiajs/inertia'; 
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Plus, Pencil, FileText } from 'lucide-react';
import FileInput from '@/Components/FileInput';
import { Button } from '@/Components/ui/button';
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


// Pass `vacancy` to edit an existing vacancy; omit it to add a new one.
export default function VacancyAddVacancy({ vacancy = null }) {
    const isEdit = vacancy !== null;
    const toDate = (value) => (value ? format(new Date(value), 'yyyy-MM-dd') : '');
    const toTime = (value, fallback) => (value ? format(new Date(value), 'HH:mm') : fallback);

    const initialData = () => ({
        vacancies_title: vacancy?.vacancies_title ?? '',
        vacancies_location: vacancy?.vacancies_location ?? '',
        vacancies_description: vacancy?.vacancies_description ?? '',
        start_date: toDate(vacancy?.start_date),
        start_time: toTime(vacancy?.start_date, '08:00'),
        end_date: toDate(vacancy?.end_date),
        end_time: toTime(vacancy?.end_date, '17:00'),
        ads_link: vacancy?.ads_link ?? '',
        ads_pdf: null,
        remove_ads_pdf: false,
    });

    const { data, setData, post, processing, errors, reset, transform, clearErrors } = useForm(initialData());

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

        post(isEdit ? route('vacancy.update', vacancy.id) : route('vacancy.save'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                if (!isEdit) reset();
                // Close the dialog
                // console.log('onSuccess', data);
                setIsDialogOpen(false);
            },
        });
    };

    // console.log('vendor_application_id', vendor_application_id);

    const handleDialogClose = (isOpen) => {
        setIsDialogOpen(isOpen);

        if (isOpen) {
            // Re-read the latest saved values each time the dialog opens.
            setData(initialData());
            clearErrors();
        }
    };
    return (
        <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
                {isEdit ? (
                    <Button type="button" size="sm" variant="outline">
                        <Pencil /> Kemaskini
                    </Button>
                ) : (
                    <PrimaryButton type="button">
                        <Plus /> Tambah Kerja Kosong
                    </PrimaryButton>
                )}
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? 'Kemaskini Kerja Kosong' : 'Tambah Kerja Kosong'}</DialogTitle>
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
                                            Pautan ke Iklan Jawatan
                                        </>
                                    }
                                />
                                <TextInput
                                    id="ads_link"
                                    name="ads_link"
                                        value={data.ads_link}
                                        className="block w-full"
                                    isFocused={true}
                                    placeholder="https://…"
                                    onChange={(e) =>
                                        setData('ads_link', e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.ads_link}
                                    className="mt-2"
                                />
                            </div>
                        </div>
                        <div className="grid flex-1 gap-2">
                            <div>
                                <InputLabel htmlFor="ads_pdf" value="PDF Iklan Jawatan" />
                                <p className="mb-2 text-xs text-muted-foreground">
                                    Masukkan pautan, PDF, atau kedua-duanya<span className="text-destructive">*</span>. Semakan AI akan menggunakan PDF jika ada.
                                </p>

                                {isEdit && vacancy.ads_pdf && !data.remove_ads_pdf && !data.ads_pdf && (
                                    <div className="mb-2 flex items-center justify-between gap-3 rounded-lg border border-border bg-background p-3">
                                        <a
                                            href={route('vacancy.ads', vacancy.id)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                                        >
                                            <FileText className="h-4 w-4" /> PDF semasa
                                        </a>
                                        <button
                                            type="button"
                                            onClick={() => setData('remove_ads_pdf', true)}
                                            className="text-xs font-medium text-destructive hover:underline"
                                        >
                                            Buang
                                        </button>
                                    </div>
                                )}
                                {isEdit && vacancy.ads_pdf && data.remove_ads_pdf && (
                                    <p className="mb-2 text-xs text-muted-foreground">
                                        PDF semasa akan dibuang semasa disimpan.{' '}
                                        <button type="button" className="font-medium text-primary hover:underline" onClick={() => setData('remove_ads_pdf', false)}>
                                            Batal
                                        </button>
                                    </p>
                                )}

                                <FileInput
                                    id="ads_pdf"
                                    name="ads_pdf"
                                    accept=".pdf"
                                    maxSize={10}
                                    showPreview={false}
                                    onChange={(e) => setData('ads_pdf', e.target.files?.[0] ?? null)}
                                />
                                <InputError message={errors.ads_pdf} className="mt-2" />
                            </div>
                        </div>
                        <PrimaryButton disabled={processing}>
                            {processing ? 'Menyimpan…' : 'Simpan'}
                        </PrimaryButton>
                    </div>
                </form>

                </div>
            </DialogContent>
        </Dialog>
    );
}