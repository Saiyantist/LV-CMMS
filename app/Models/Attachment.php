<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Attachment extends Model
{
    protected $fillable = [
        'path',
        'file_type',
        'attachable_id',
        'attachable_type'
    ];

    public function attachable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     *  Converts the relative path to full URL
     *  i.e. https://127.0.0.1:8000/storage/work_orders/67f6300499ca5.jpg
     */
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->path);
    }
} 