<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookingStaff extends Model
{
    protected $table = 'booking_staff';

    protected $fillable = [
        'booking_id',
        'staff_id',
        'assigned_at',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'booking_id');
    }
    

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
    

}
