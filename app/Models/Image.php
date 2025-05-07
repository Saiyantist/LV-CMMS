<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    protected $fillable = [
        'path',
        'imageable_id',
        'imageable_type',
        'caption',
    ];

    public function imageable()
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
