// index.d.ts

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string; // ✅ Added
    birth_date: dat; // ✅ Added
    gender: string; // ✅ Added
    staff_type: string; // ✅ Added
    email_verified_at?: string;
    profile_photo_url?: string; // Optional for profile photo
    [key: string]: any; // To allow dynamic properties if needed
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
