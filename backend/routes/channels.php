<?php


use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('booking.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});