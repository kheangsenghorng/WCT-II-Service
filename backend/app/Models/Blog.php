<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['title', 'content', 'images', 'admin_id'];

    // Cast images attribute to array automatically
    protected $casts = [
        'images' => 'array',
    ];
    
    public function getImagesAttribute($images)
    {
        if (is_array($images)) {
            return array_map(fn($img) => asset('storage/' . ltrim($img, '/')), $images);
        }
        return [];
    }    
}
