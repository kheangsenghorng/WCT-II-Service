<?php


use Illuminate\Support\Facades\Broadcast;

// Broadcast::channel('booking.{userId}', function ($user, $userId) {
//     return (int) $user->id === (int) $userId;
// });

// routes/channels.php
Broadcast::channel('private-owner.{ownerId}', function ($user, $ownerId) {
    return (int) $user->id === (int) $ownerId;
});
