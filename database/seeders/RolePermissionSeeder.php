<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define permissions
        $permissions = [

            /**
             * Internal Requesters:
             *  Teaching and non-teaching
             *  Department Head
             */
            'request work orders',
            'view own work orders',            
            'cancel own work orders',            
            'request event services', // External and dept. head
            'view own event services', // External and dept. head
            'cancel own event services', // External and dept. head

            // GASD Coordinator
            'manage work orders',

            // Maintenance Personnel
            'view work orders assigned to them',
            'update assigned work order status', 

            // Communications Officer
            'manage event services',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Define roles
        $roles = [
            'internal_requester' => ['request work orders', 'view own work orders', 'cancel own work orders'], 
            'external_requester' => ['request event services', 'view own event services', 'cancel own event services'],
            'department_head' => [
                'request work orders', 'view own work orders', 'cancel own work orders',
                'request event services', 'view own event services', 'cancel own event services',
            ],
            'gasd_coordinator' => [
                'manage work orders', 'request work orders',
            ], 
            'maintenance_personnel' => ['view work orders assigned to them', 'update assigned work order status'],
            'communications_officer' => [
                'manage event services',
                'request work orders', 'view own work orders', 'cancel own work orders'
            ],
            'super_admin' => [],
        ];

        // Assign Permissions to Roles
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);

            if ($roleName === 'super_admin') {
                $role->syncPermissions(Permission::all()); // Give Super Admin all permissions
            } else {
                $role->syncPermissions($rolePermissions);
            }
        }        // Assign Permissions to Roles
        foreach ($roles as $roleName => $rolePermissions) {
            $role = Role::firstOrCreate(['name' => $roleName]);

            if ($roleName === 'super_admin') {
                $role->syncPermissions(Permission::all()); // Give Super Admin all permissions
            } else {
                $role->syncPermissions($rolePermissions);
            }
        }
    }
}
