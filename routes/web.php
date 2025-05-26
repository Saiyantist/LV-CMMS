<?php

use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetMaintenanceHistoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\EventServicesController;
use App\Http\Controllers\DepartmentController;


/**
 *  Guest Routes
 */
Route::get('/', function () {
    if (Auth::user() && Auth::user()->roles->isnotempty()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'auth' => ['user' => Auth::check() ? Auth::user()->load('roles') : null]
    ]);
});

Route::get('/register/external-user-registration', function () {
    return Inertia::render('Auth/ExternalRegistration'); 
})->name('access.registration-external-user-registration');

Route::get('/register/internal-user-registration', [RegisteredUserController::class, 'createInternal']
)->name('access.registration-internal-user-registration');

/**
 * Authenticated Routes
 */

Route::get('/awaiting-approval', function () {
    if (Auth::user()->roles->isnotempty()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('AwaitingApproval');
})->middleware('auth', 'verified');

Route::middleware(['auth', 'verified', 'hasRole'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/**
 * Autthenticated with Roles and Verified Email
 *      - for Role-based Access Control (RBAC)
 *      - ROUTING PREVENTION FOR UNAUTHORIZED ACCESS/USERS
 */
Route::middleware(['auth', 'verified', 'hasRole'])->group(function () {
    
    // Super Admins only
    Route::middleware(['role:super_admin'])->group(function () {
        Route::get('/admin/manage-roles', [UserRoleController::class, 'index'])->name('admin.manage-roles');
        Route::patch('/admin/manage-roles/{user}/role', [UserRoleController::class, 'updateRole'])->name('admin.update.role');
        Route::delete('/admin/manage-roles/{user}/role', [UserRoleController::class, 'removeRole'])->name('admin.remove.role');
    });

    /** 
     * Computerized Maintenance Management System (CMMS) Routes
     *      - Work Order Management
     *      - Asset Management
     *      - Preventive Maintenance
     *      - Compliance and Safety
     */
    Route::middleware(['auth', 'restrict_external', 'verified', 'hasRole'])->group(function () {
    
        // Maintenance Personnel only
        Route::get('/work-orders/assigned-tasks', [WorkOrderController::class, 'assignedWorkOrders'])
            ->middleware(['role:maintenance_personnel'])
            ->name('work-orders.assigned-tasks');
    
        /**
         *  Asset Management, Preventive Maintenance, and Compliance and Safety
         *      - Accessible only to Super Admins and Users with the "manage work orders" perms.
         */
        Route::middleware(['role_or_permission:super_admin|manage work orders'])->group(function () {
            Route::resource('assets', AssetController::class);

            Route::get('/work-orders/preventive-maintenance', function () { // will change to use a controller
                return Inertia::render('PreventiveMaintenance/PreventiveMaintenance');
            })->name('work-orders.preventive-maintenance');
    
            Route::get('/work-orders/compliance-and-safety', function () {
                return Inertia::render('ComplianceAndSafety/ComplianceAndSafety');
            })->name('work-orders.compliance-and-safety');
        });
        
        Route::resource('work-orders', WorkOrderController::class)->except(['create', 'show']); // ALWAYS put this at the end ng mga "/work-orders" routes.
    
        Route::post('/locations', [LocationController::class, 'store']);
    });
    
    // API route for work order statuses (for chart)
    Route::get('/api/work-orders/statuses', function () {
        return \App\Models\WorkOrder::select('status')->get();
    })->middleware(['auth', 'verified'])->name('api.work-orders.statuses');

    // asset history fetching
    Route::get('/asset-maintenance-history/{assetId}', [AssetMaintenanceHistoryController::class, 'show']);




    // Route::get('/departments', [DepartmentController::class, 'index']);
    Route::get('/departments/{type}', [DepartmentController::class, 'show']);


    /**
     * Event Services Routes
     */
    Route::middleware([])->group(function () {
        Route::get('/booking-calendar', [EventServicesController::class, 'index'])->name('booking-calendar');
        
        // My Bookings Route (use controller method)
        Route::get('/event-services/my-bookings', [EventServicesController::class, 'MyBookings'])->name('event-services.my-bookings');
        
        // My Bookings Page Route (renders the page/component, not the data)
        // Route::get('/event-services/my-bookings-page', function () {
        //     return Inertia::render('EventServices/MyBookings');
        // })->name('event-services.my-bookings-page');
        
        // Event Services Request Route
        Route::get('/event-services/request', function () {
            return Inertia::render('EventServices/EventServicesRequest');
        })->name('event-services.request');
    
        Route::post('/event-services', [EventServicesController::class, 'store'])->name('event-services.store');
        Route::delete('/event-services/{id}', [EventServicesController::class, 'destroy'])->name('event-services.destroy');
        Route::put('/event-services/{id}', [EventServicesController::class, 'update'])->name('event-services.update');
    });
});

require __DIR__ . '/auth.php';
