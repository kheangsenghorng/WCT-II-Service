<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyInfo extends Model
{
    use HasFactory;

    protected $table = 'companies_info';

    protected $fillable = [
        'user_id',
        'company_name',
        'description',
        'website_url',
        'business_hours',
        'address',
        'city',
        'country',
        'facebook_url',
        'instagram_url',
        'twitter_url',
        'linkedin_url',
    ];

    /**
     * The user that owns this company info.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
