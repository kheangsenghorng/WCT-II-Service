<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key-value array containing any custom claims to be added to the JWT.
     *
     * @return array<string, mixed>
     */
    public function getJWTCustomClaims(): array
    {
        return [];
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'password',
        'role',
        'admin_id',
        'owner_id',
        'image',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Users owned by this user (if this user is an owner).
     */
    public function ownedUsers()
    {
        return $this->hasMany(User::class, 'owner_id');
    }

    /**
     * The owner of this user.
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * The admin that created this user (if applicable).
     */
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
    public function assignedBookings()
{
    return $this->belongsToMany(Booking::class, 'booking_staff', 'staff_id', 'booking_id')
                ->withPivot('assigned_at')
                ->withTimestamps();
}
public function bookingStaffs()
{
    return $this->hasMany(BookingStaff::class, 'staff_id');
}

}
