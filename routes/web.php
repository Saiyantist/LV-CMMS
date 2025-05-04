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

Route::get('/', function () {
    if (Auth::user() && Auth::user()->roles->isnotempty()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'auth' => ['user' => Auth::check() ? Auth::user()->load('roles') : null]
    ]);
});

/**
 *  Guest Routes
 */
Route::get('/awaiting-approval', function () {
    if (Auth::user()->roles->isnotempty()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('AwaitingApproval');
})->middleware('auth', 'verified');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', ['auth' => ['user' => Auth::user()->load('roles')]]);
})->middleware(['auth', 'verified', 'hasRole'])->name('dashboard');

/**
 * Authenticated Routes
 */

Route::middleware(['auth', 'verified', 'hasRole'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// For Testing Purposes
// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('/work-orders/testing', function () {
//         return Inertia::render('WorkOrders/Testing');
//     })->name('work-orders.testing');
// });
// Route::post('/work-orders', [WorkOrderController::class, 'store'])->name('work-orders.store');



// Route::get('/access-registration', function () {
//     return Inertia::render('Auth/AccessRegistration'); 
// })->name('access-registration');


Route::get('/register/external-user-registration', function () {
    return Inertia::render('Auth/ExternalRegistration'); 
})->name('access/registration-external-user-registration');

Route::get('/register/external-user-registration', function () {
    return Inertia::render('Auth/ExternalRegistration'); 
})->name('access.registration-external-user-registration');





// ROUTING PREVENTION FOR UNAUTHORIZED ACCESS/USERS

// Asset Management and Preventive Maintenance should be restricted to work_order_manager, super_admin, and gasd_coordinator
Route::middleware(['auth', 'verified', 'role:work_order_manager|super_admin|gasd_coordinator'])->group(function () {
    Route::get('/work-orders/asset-management', function () {
        return Inertia::render('AssetManagement/AssetManagement');
    })->name('work-orders.asset-management');

    Route::get('/work-orders/preventive-maintenance', function () {
        return Inertia::render('PMS/PreventiveMaintenance');
    })->name('work-orders.preventive-maintenance');
});

// Submit Request should be restricted to non work_order_manager and non super_admin
Route::middleware(['auth', 'verified', 'role:!work_order_manager|!super_admin'])->group(function () {
    Route::get('/work-orders/submit-request', function () {
        return Inertia::render('WorkOrders/SubmitRequest');
    })->name('work-orders.submit-request');
});

// Catch unauthorized attempts to access restricted pages
Route::fallback(function () {
    return abort(403, 'Unauthorized access');
});


// Internal Registration
Route::get('/register/internal-user-registration', [RegisteredUserController::class, 'createInternal'])->name('access.registration-internal-user-registration');


// Submit Work Order for internal users
Route::post('/work-orders', [WorkOrderController::class, 'stores'])->name('work-orders.stores');



// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



/**
 * User Role Management - for Role-based Access Control (RBAC)
 */
Route::middleware(['auth', 'role:super_admin', 'verified'])->group(function () {
    Route::get('/admin/manage-roles', [UserRoleController::class, 'index'])->name('admin.manage-roles');
    Route::patch('/admin/manage-roles/{user}/role', [UserRoleController::class, 'updateRole'])->name('admin.update.role');
    Route::delete('/admin/manage-roles/{user}/role', [UserRoleController::class, 'removeRole'])->name('admin.remove.role');
});

Route::middleware(['auth', 'restrict_external', 'hasRole', 'verified'])->group(function () {
    Route::get('/work-orders/submit-request', function () {
        return Inertia::render('WorkOrders/SubmitRequest');
    })->name('work-orders.submit-request');
    Route::resource('work-orders', WorkOrderController::class);
});

require __DIR__ . '/auth.php';
