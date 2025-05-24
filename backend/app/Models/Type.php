<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Type extends Model
{
    // Include 'image' and 'icon' in the fillable array
    protected $fillable = [
        'service_categories_id',
        'name',
        'image',
    ];

    public function serviceCategory()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_categories_id');
    }

    public function getImageUrlAttribute()
{
        return $this->image ? asset('storage/' . $this->image) : null;
    }
    protected $appends = ['image_url'];



}
