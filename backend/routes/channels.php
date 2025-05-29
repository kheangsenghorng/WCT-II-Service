<?php


use Illuminate\Support\Facades\Broadcast;

// Broadcast::channel('booking.{userId}', function ($user, $userId) {
//     return (int) $user->id === (int) $userId;
// });

Broadcast::channel('owner.{ownerId}', function ($user, $ownerId) {
    return (int) $user->id === (int) $ownerId;
});
