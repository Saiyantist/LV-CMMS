// resources/js/Components/FlashToast.tsx
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Toaster } from '@/Components/shadcnui/sonner';

export default function FlashToast() {
    const { flash } = usePage().props as any;

    useEffect(() => {
        if (flash.success) toast.success(flash.success);
        if (flash.error) toast.error(flash.error);
    }, [flash]);

    return <Toaster position="bottom-right" closeButton theme='light'/>;
}