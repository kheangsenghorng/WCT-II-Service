<?php

namespace App\Events;

use App\Models\Booking;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BookingNotificationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $booking;
    public $status;

    public function __construct(Booking $booking, $status)
    {
        $this->booking = $booking;
        $this->status = $status;
    }

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('owner.' . $this->booking->service->owner_id);
    }
    

    public function broadcastWith(): array
    {
        return [
            'booking' => $this->booking,
            'status' => $this->status,
            'message' => $this->status === 'success'
                ? 'Booking created successfully.'
                : 'Booking failed.'
        ];
    }

    public function broadcastAs()
    {
        return 'booking.notification';
    }
}
