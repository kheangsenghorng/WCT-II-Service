<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class BookingNotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Booking $booking;
    public string $status;

    public function __construct($booking, $status)
    {
        $this->booking = $booking;
        $this->status = $status;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('private-owner.' . $this->booking->service->owner_id);
    }

    public function broadcastAs()
    {
        return 'booking.notification';
    }

    public function broadcastWith()
    {
        $this->booking->load(['user', 'service']);
        
        Log::info("Booking notification sent", [
            'owner_id' => $this->booking->service->owner_id,
            'booking_id' => $this->booking->id,
            'status' => $this->status
        ]);

        return [
            'booking' => [
                'id' => $this->booking->id,
                'user' => $this->booking->user->only(['id', 'name', 'email']),
                'service' => $this->booking->service->only(['id', 'name']),
                'scheduled_date' => $this->booking->scheduled_date,
                'scheduled_time' => $this->booking->scheduled_time,
                'location' => $this->booking->location,
                'status' => $this->booking->status,
            ],
            'status' => $this->status,
            'timestamp' => now()->toISOString(),
            'message' => $this->getStatusMessage(),
        ];
    }

    protected function getStatusMessage(): string
    {
        return match($this->status) {
            'success' => 'New booking created successfully',
            'error' => 'Booking creation failed',
            default => 'Booking status updated',
        };
    }
}