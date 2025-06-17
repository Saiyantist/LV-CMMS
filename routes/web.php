<?php

use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AssetMaintenanceHistoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ComplianceAndSafetyController;
use App\Http\Controllers\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\EventServicesController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\PreventiveMaintenanceController;
use App\Mail\TestWorkOrderAssigned;
use Illuminate\Support\Facades\Mail;
use App\Http\Controllers\AttachmentController;

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
});

/**
 * Autthenticated with Roles and Verified Email
 *      - for Role-based Access Control (RBAC)
 *      - ROUTING PREVENTION FOR UNAUTHORIZED ACCESS/USERS
 */
Route::middleware(['auth', 'verified', 'hasRole'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
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
    Route::middleware(['auth', 'restrict_external', 'restrict_internal', 'verified', 'hasRole'])->group(function () {
    
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

            Route::group(['prefix' => 'work-orders/preventive-maintenance'], function () {
                Route::get('/', [PreventiveMaintenanceController::class, 'index'])->name('work-orders.preventive-maintenance');
                Route::post('/', [PreventiveMaintenanceController::class, 'store'])->name('work-orders.preventive-maintenance.store');
                Route::put('/{id}', [PreventiveMaintenanceController::class, 'update'])->name('work-orders.preventive-maintenance.update');
                Route::put('/schedule/{id}', [PreventiveMaintenanceController::class, 'updateSchedule'])->name('work-orders.preventive-maintenance.update-schedule');
                Route::delete('/{id}', [PreventiveMaintenanceController::class, 'destroy'])->name('work-orders.preventive-maintenance.destroy');
            });
            
            Route::group(['prefix' => 'work-orders/compliance-and-safety'], function () {
                Route::get('/', [ComplianceAndSafetyController::class, 'index'])->name('work-orders.compliance-and-safety');
                Route::get('/create', [ComplianceAndSafetyController::class, 'create'])->name('work-orders.compliance-and-safety.create');
                Route::post('/', [ComplianceAndSafetyController::class, 'store'])->name('work-orders.compliance-and-safety.store');
                Route::put('/{id}', [ComplianceAndSafetyController::class, 'update'])->name('work-orders.compliance-and-safety.update');
                Route::delete('/{id}', [ComplianceAndSafetyController::class, 'destroy'])->name('work-orders.compliance-and-safety.destroy');
            });

            // Attachment routes
            Route::delete('/attachments/{id}', [AttachmentController::class, 'destroy'])->name('attachments.destroy');
        });
        
        // ALWAYS ensure this route is at the end of "/work-orders" routes.
        Route::resource('work-orders', WorkOrderController::class)
            ->except(['create', 'show'])
            ->middleware(['role_or_permission:senior_management|manage work orders|view own work orders|update assigned work order status']);
    
        Route::post('/locations', [LocationController::class, 'store']);
    });
    
    /**
     * Unorganized Routes
     */

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
        Route::get('/event-services/my-bookings', [EventServicesController::class, 'MyBookings'])->name('event-services.my-bookings');
        
        // Event Services Request Route
        Route::get('/event-services/request', function () {
            return Inertia::render('EventServices/EventServicesRequest');
        })->name('event-services.request');
        Route::post('/event-services', [EventServicesController::class, 'store'])->name('event-services.store');
        Route::delete('/event-services/{id}', [EventServicesController::class, 'destroy'])->name('event-services.destroy');
        Route::put('/event-services/{id}', [EventServicesController::class, 'update'])->name('event-services.update');

        Route::get('/departments/{type}', [DepartmentController::class, 'show']);


        Route::get('/event-services/time-options', [EventServicesController::class, 'getTimeOptions']);
        
        Route::get('/event-services/occupied-times', [EventServicesController::class, 'getOccupiedTimes']);

        
        Route::post('/event-services/check-conflict', [EventServicesController::class, 'checkConflict']);
   
        // Route to fetch the Booking Statistics (Donut Chart = COMMS Officer's Dashboard)
        Route::get('/api/event-services/statuses', function () {
            return \App\Models\EventService::select('status')->get();
        })->middleware(['auth', 'verified'])->name('api.event-services.statuses');

        Route::get('/api/event-services/bookings', [EventServicesController::class, 'bookingsData']);
    });

    // User Role Management Routes
    Route::prefix('admin/manage-roles')->group(function () {
        Route::get('/', [UserRoleController::class, 'index'])->name('admin.manage-roles');
        Route::patch('/{user}/role', [UserRoleController::class, 'updateRole'])->name('admin.update-role');
        Route::delete('/{user}/role', [UserRoleController::class, 'removeRole'])->name('admin.remove-role');
        Route::patch('/{user}/approve', [UserRoleController::class, 'approveUser'])->name('admin.approve-user');
        Route::patch('/{user}/reject', [UserRoleController::class, 'rejectUser'])->name('admin.reject-user');
        Route::patch('/{user}/remove-access', [UserRoleController::class, 'removeAccess'])->name('admin.remove-access');
    });
});

Route::get('/mail-test', function () {
    $email = 'angelo.delossantos000@gmail.com';

    $data = [
        'name' => 'John Doe',
        'description' => 'Replace fire extinguisher at Building A',
        'due_date' => now()->addDays(3)->format('F j, Y'),
    ];

    Mail::to($email)->send(new TestWorkOrderAssigned($data));

    return 'Email sent to ' . $email . '!';
});
    

require __DIR__ . '/auth.php';
