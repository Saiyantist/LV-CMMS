// resources/js/Components/FlashToast.tsx
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Toaster } from '@/Components/shadcnui/sonner';
import { useMediaQuery } from '@/hooks/useMediaQuery';

export default function FlashToast() {
    const { flash } = usePage().props as any;
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        if (flash.success) {
            toast.success(flash.success, {
                style: {
                    background: '#f0fdf4',
                    color: '#166534',
                    border: '1px solid #bbf7d0'
                }
            });
        }
        if (flash.error) {
            toast.error(flash.error, {
                style: {
                    background: '#fef2f2',
                    color: '#991b1b',
                    border: '1px solid #fecaca'
                }
            });
        }
    }, [flash]);

    return (
        <Toaster 
            position={isMobile ? "top-right" : "bottom-right"} 
            closeButton 
            theme='system'
            duration={ 7000 }
            toastOptions={{
                style: {
                    background: '#ffffff',
                    color: '#1f2937',
                    border: '1px solid #e5e7eb'
                }
            }}
        />
    );
}