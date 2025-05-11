<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'base_price',
        'available_day',
        'available_time',
        'service_categories_id',
        'type_id',
        'images',
        'owner_id',
    ];
    protected $casts = [
        'images' => 'array',
    ];
    
    

   // Service.php
public function category()
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
