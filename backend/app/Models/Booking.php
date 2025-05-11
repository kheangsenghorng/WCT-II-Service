<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'service_id',
        'scheduled_date',
        'scheduled_time',
        'location',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function serviceCategory()
{
    return $this->belongsTo(ServiceCategory::class, 'service_categories_id');
}

public function type()
{
    return $this->belongsTo(Type::class, 'type_id');
}

public function owner()
{
    return $this->belongsTo(User::class, 'owner_id');
}
}

