export interface User {
    id: number;
    first_name: string;
    last_name: string;
    birth_date?: string;
    contact_number?: string;
    email: string;
    email_verified_at?: string;
    profile_photo_url?: string; // Optional for profile photo
    [key: string]: any; // To allow dynamic properties if needed
    roles: Role[];
    gender?: string;
    staff_type?: string;
    department_id?: number;
}

export interface Role {
    id: number;
    name: string;
}

export interface UserRoleProps {
    users: User[];
    roles: Role[];
    auth: { user: User };
  }

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
