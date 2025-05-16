<?php

use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\EventServicesController;

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
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');})->name('dashboard');
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/**
 * Autthenticated with Roles and Verified Email
 *      - for Role-based Access Control (RBAC)
 *      - ROUTING PREVENTION FOR UNAUTHORIZED ACCESS/USERS
 */

Route::middleware(['auth', 'role:super_admin', 'verified'])->group(function () {
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

    Route::get('/work-orders/submit-request', [WorkOrderController::class, 'create'])
        ->middleware('restrict_work_order_manager') // Internal and Maintenance Personnel only
        ->name('work-orders.submit-request');

    Route::get('/work-orders/assigned-tasks', [WorkOrderController::class, 'assignedWorkOrders'])
        ->middleware(['role:maintenance_personnel']) // Maintenance Personnel only
        ->name('work-orders.assigned-tasks');

    /**
     *  Asset Management, Preventive Maintenance, and Compliance and Safety
     *      - Accessible only to Super Admins and Users with the "manage work orders" perms.
     */
    Route::middleware(['role_or_permission:super_admin|manage work orders'])->group(function () {


        Route::resource('assets', AssetController::class);

        Route::get('/work-orders/preventive-maintenance', function () { // will change
            return Inertia::render('PreventiveMaintenance/PreventiveMaintenance');
        })->name('work-orders.preventive-maintenance');

        Route::get('/work-orders/compliance-and-safety', function () {
            return Inertia::render('ComplianceAndSafety/ComplianceAndSafety');
        })->name('work-orders.compliance-and-safety');
    });
    
    Route::resource('work-orders', WorkOrderController::class); // ALWAYS put this at the end ng mga "/work-orders" routes.

    Route::post('/locations', [LocationController::class, 'store']);
});

// API route for work order statuses (for chart)
Route::get('/api/work-orders/statuses', function () {
    return \App\Models\WorkOrder::select('status')->get();
})->middleware(['auth', 'verified'])->name('api.work-orders.statuses');

// Event Services Routes
Route::get('/booking-calendar', [EventServicesController::class, 'index'])->name('booking-calendar');

// My Bookings Route (use controller method)
Route::get('/event-services/my-bookings', [EventServicesController::class, 'MyBookings'])->name('event-services.my-bookings');

// My Bookings Page Route (renders the page/component, not the data)
Route::get('/event-services/my-bookings-page', function () {
    return Inertia::render('EventServices/MyBookings');
})->name('event-services.my-bookings-page');

// Event Services Request Route
Route::get('/event-services/request', function () {
    return Inertia::render('EventServices/EventServicesRequest');
})->name('event-services.request');


// Catch unauthorized attempts to access restricted pages
Route::fallback(function () {
    return abort(403, 'Unauthorized access');
});
require __DIR__ . '/auth.php';
