<?php

use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'auth' => [ 'user' => Auth::check() ? Auth::user()->load('roles') : null]
    ]);
});

Route::get('/awaiting-approval', function () {
    if (Auth::user()->roles->isnotempty()){
        return redirect()->route('dashboard');
    }
    return Inertia::render('AwaitingApproval');
})->middleware('auth', 'verified');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [ 'auth' => [ 'user' => Auth::user()->load('roles')]]);
})->middleware(['auth', 'verified', 'hasRole'])->name('dashboard');

// Gelo:
// Not good implementation
// For Work Order, I created a work order grouped routes
Route::get('/submitrequest', function () {
    return Inertia::render('SubmitRequest');
})->middleware(['auth', 'verified', 'hasRole'])->name('submitrequest');

Route::get('/requestdetails', function () {
    return Inertia::render('RequestDetails');
})->middleware(['auth', 'verified', 'hasRole'])->name('requestdetails');

Route::middleware(['auth', 'verified', 'hasRole'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/**
 * User Role Management - our Role-based Access Control (RBAC)
 */
Route::middleware(['auth', 'role:super_admin', 'verified'])->group(function () {
    Route::get('/admin/manage-roles', [UserRoleController::class, 'index'])->name('admin.manage-roles');
    Route::patch('/admin/manage-roles/{user}/role', [UserRoleController::class, 'updateRole'])->name('admin.update.role');
    Route::delete('/admin/manage-roles/{user}/role', [UserRoleController::class, 'removeRole'])->name('admin.remove.role');
});

require __DIR__.'/auth.php';
