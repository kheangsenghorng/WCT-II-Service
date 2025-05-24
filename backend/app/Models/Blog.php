<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    protected $fillable = ['title', 'content', 'image', 'admin_id'];

    public function getImageAttribute($value)
    {
        return $value ? url('storage/' . $value) : null;
    }
}


