<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventService extends Model
{
    use HasFactory;

    protected $fillable = [
          'user_id',
    'name', // or 'event_name'
    'venue', // or 'location'
    'event_date',
    'status',
    'time',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}