<?php

use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkOrderController;
use App\Http\Controllers\Auth\RegisteredUserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\LocationController;

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

Route::middleware(['auth', 'restrict_external', 'verified'])->group(function () {
    Route::get('/work-orders/submit-request', function () {
        return Inertia::render('WorkOrders/SubmitRequest');
    })->middleware('restrict_work_order_manager')->name('work-orders.submit-request'); // Submit Request should be restricted to non work_order_manager and non super_admin

    // Asset Management and Preventive Maintenance should be restricted to work_order_manager or super_admin
    Route::middleware(['role_or_permission:super_admin|manage work orders'])->group(function () {
        Route::get('/work-orders/asset-management', function () { // will change
            return Inertia::render('AssetManagement/AssetManagement');
        })->name('work-orders.asset-management');
        
        Route::get('/work-orders/preventive-maintenance', function () { // will change
            return Inertia::render('PreventiveMaintenance/PreventiveMaintenance');
        })->name('work-orders.preventive-maintenance');

        Route::get('/work-orders/compliance-and-safety', function () {
            return Inertia::render('ComplianceAndSafety/ComplianceAndSafety');
        })->name('work-orders.compliance-and-safety');
    });
    
    Route::get('/work-orders/assigned-tasks', [WorkOrderController::class, 'assignedWorkOrders'])->name('work-orders.assigned-tasks');

    Route::resource('work-orders', WorkOrderController::class); // ALWAYS put this at the end ng mga "/work-orders" routes.

    Route::post('/locations', [LocationController::class, 'store']);
});

// Catch unauthorized attempts to access restricted pages
Route::fallback(function () {
    return abort(403, 'Unauthorized access');
});
require __DIR__ . '/auth.php';
