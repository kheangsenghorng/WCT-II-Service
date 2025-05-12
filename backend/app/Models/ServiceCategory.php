<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Service; // Make sure this import is present

class ServiceCategory extends Model
{
   
    protected $fillable = ['name', 'slug', 'description', 'image'];

    // Relationship: one category has many services
    // public function services(): HasMany
    // {
    //     return $this->hasMany(Service::class, 'service_categories_id');
    // }

    // Automatically generate slug on creating and updating
    protected static function booted()
    {
        static::creating(function ($category) {
            $category->slug = Str::slug($category->name);
        });

        static::updating(function ($category) {
            $category->slug = Str::slug($category->name);
        });
    }
}
