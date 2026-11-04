// import { Inertia } from '@inertiajs/inertia'; 
import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { Trash2 } from 'lucide-react';
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


export default function DeleteUser({user}) {

    const { data, setData, post, processing, errors, reset } = useForm({
        id: user.id,

    });
console.log('userDelete',);
    const [openStartDate, setOpenStartDate] = useState(false);
    const [openEndDate, setOpenEndDate] = useState(false);

    const [dropdown, setDropdown] = useState("dropdown");
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const submit = (e) => {
        e.preventDefault();
        console.log('onDelete', user);

        post(route('user.delete'), {
            id:user.id,
            ondelete: () => {
                reset(
                    'id',
                    // 'vacancies_location',
                    // 'vacancies_description',
                    // 'start_date',
                    // 'end_date',
                    // 'ads_link',
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
                <PrimaryButton
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                    <Trash2 /> Padam
                </PrimaryButton>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle>Padam Pengguna</DialogTitle>
                </DialogHeader>
                <div className="mt-4">

                    <form onSubmit={submit}>
                    <div className="items-center space-y-2">
                       
                        <p className="text-sm text-muted-foreground">
                            Adakah anda pasti mahu memadam maklumat ini? Tindakan ini tidak boleh dibatalkan.
                        </p>
                        <div className="flex justify-end gap-2 pt-4">
                            <SecondaryButton onClick={() => handleDialogClose(false)}>
                                Batal
                            </SecondaryButton>
                            <PrimaryButton variant="destructive" disabled={processing}>
                                Padam
                            </PrimaryButton>
                        </div>
                    </div>
                </form>

                </div>
            </DialogContent>
        </Dialog>
    );
}