export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    email_verified_at?: string;
    roles: Role[];
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