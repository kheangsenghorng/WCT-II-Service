<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// app/Models/Type.php
class Type extends Model
{
    protected $fillable = ['service_categories_id', 'name'];

    public function serviceCategory()
    {
        return $this->belongsTo(ServiceCategory::class, 'service_categories_id');
    }
}
