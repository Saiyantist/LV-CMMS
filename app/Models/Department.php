<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentFactory> */
    use HasFactory;

    protected
    $fillable = ['name', 'type'];

        /**
     * Get all users in this department.
     */
    public function users()
    {
        return $this->hasMany(User::class);
    }

}
