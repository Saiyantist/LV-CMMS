<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $fillable = ['name', 'added_by'];

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class);
    }

    public function assets()
    {
        return $this->hasMany(Asset::class);
    }
}


