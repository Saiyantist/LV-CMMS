<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventService extends Model
{
    use HasFactory;

    protected $fillable = [
    'user_id',
    'name',
    'venue',
    'department',
    'description',
    'participants',
    'number_of_participants',
    'event_start_date',
    'event_end_date',
    'event_start_time',
    'event_end_time',
    'requested_services',
    'proof_of_approval',
    'status',
];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}