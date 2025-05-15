<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Booking;

class BookingNotificationEvent
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $booking;
    public $status; // success or error


    /**
     * Create a new event instance.
     */
    public function __construct(Booking $booking, $status)
    {
        $this->booking = $booking;
        $this->status = $status;
    }

    public function broadcastOn(): Channel
    {
        return new PrivateChannel('booking.' . $this->booking->user_id);
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
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
}
