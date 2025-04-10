<?php

use App\Http\Controllers\Admin\UserRoleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\WorkOrderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
    
Route::get('/', function () {
    if (Auth::user() && Auth::user()->roles->isnotempty()){
        return redirect()->route('dashboard');
    }
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'auth' => [ 'user' => Auth::check() ? Auth::user()->load('roles') : null]
    ]);
});

/**
 *  Guest Routes
 */
Route::get('/awaiting-approval', function () {
    if (Auth::user()->roles->isnotempty()){
        return redirect()->route('dashboard');
    }
    return Inertia::render('AwaitingApproval');
})->middleware('auth', 'verified');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [ 'auth' => [ 'user' => Auth::user()->load('roles')]]);
})->middleware(['auth', 'verified', 'hasRole'])->name('dashboard');

/**
 * Authenticated Routes
 */

Route::middleware(['auth', 'verified', 'hasRole'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

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
        return Inertia::render('WorkOrders/SubmitRequest');})->name('work-orders.submit-request');
    Route::resource('work-orders', WorkOrderController::class);
});

require __DIR__.'/auth.php';
