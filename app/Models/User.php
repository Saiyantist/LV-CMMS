<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Psy\CodeCleaner\FunctionReturnInWriteContextPass;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'birth_date',
        'gender',
        'contact_number',
        'staff_type',
        'department_id',
        'email',
        'password',
    ];

    /**
     * Encrypts and decrypts the contact number.
     *
     */
    protected function contactNumber(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value && Str::startsWith($value, 'eyJpdiI6') ? Crypt::decryptString($value) : $value,
            set: fn ($value) => $value ? Crypt::encryptString($value) : null,
        );
    }

    /**
     * Encrypts and decrypts the birth date.
     *
     */
    protected function birthDate(): Attribute
    {
        return Attribute::make(
            get: fn ($value) => $value && Str::startsWith($value, 'eyJpdiI6') ? Crypt::decryptString($value) : $value,
            set: fn ($value) => $value ? Crypt::encryptString($value) : null
        );
    }
    /**
     * Work orders requested by this user.
     */
    public function requestedWorkOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class, 'requested_by');
    }

    /**
     * Work orders assigned to this user.
     */
    public function assignedWorkOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class, 'assigned_to');
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

        /**
     * Check if the user is a teaching staff.
     */
    public function isTeachingStaff(): bool
    {
        return $this->staff_type === 'teaching';
    }

    /**
     * Check if the user is a non-teaching staff.
     */
    public function isNonTeachingStaff(): bool
    {
        return $this->staff_type === 'non_teaching';
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
