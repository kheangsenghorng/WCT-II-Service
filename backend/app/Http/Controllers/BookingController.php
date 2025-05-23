<?php

namespace App\Http\Controllers;

use App\Events\BookingNotificationEvent;
use App\Mail\BookingStatusUpdated;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */public function index()
{
    $bookings = Booking::with('user', 'service')->get();

    // Transform image URLs
    $bookings->transform(function ($booking) {
        if ($booking->user && $booking->user->image) {
            // Check if the image path doesn't already start with 'http' (indicating it's already a full URL)
            if (!preg_match('/^http/', $booking->user->image)) {
                $booking->user->image = asset('storage/' . $booking->user->image);
            }
        }

        if ($booking->service && is_array($booking->service->images)) {
            // Transform each service image URL
            $booking->service->images = array_map(function ($image) {
                // Check if the image path doesn't already start with 'http'
                if (!preg_match('/^http/', $image)) {
                    return asset('storage/' . $image);
                }
                return $image;
            }, $booking->service->images);
        }

        return $booking;
    });

    return response()->json($bookings);
}

    /**
     * Store a newly created resource in storage.
     */

//     public function store(Request $request, $serviceId)
// {
//     try {
//         $validated = $request->validate([
//             'user_id' => 'required|exists:users,id',
//             'scheduled_date' => 'required|date',
//             'scheduled_time' => 'required',
//             'location' => 'required|string',
//             'status' => 'nullable|in:pending,paid,cancel',
//         ]);

//         $validated['service_id'] = $serviceId;

//         $booking = Booking::create($validated);
//         $booking->load('user', 'service');

//         Notification::create([
//             'owner_id' => auth()->id(),
//             'user_id' => $validated['user_id'],
//             'type' => 'booking',
//             'message' => 'A new booking has been created.',
//             'is_read' => false,
//             'scheduled_at' => now(),
//         ]);

//         // 🔔 Broadcast success
//         event(new BookingNotificationEvent($booking, 'success'));

//         return response()->json($booking, 201);

//     } catch (\Exception $e) {
//         // 🔔 Broadcast error (you can customize booking with partial data if needed)
//         event(new BookingNotificationEvent(new Booking([
//             'user_id' => $request->user_id ?? null
//         ]), 'error'));

//         return response()->json([
//             'message' => 'Booking failed.',
//             'error' => $e->getMessage(),
//         ], 500);
//     }
// }


public function store(Request $request, $serviceId)
{
    try {
        // ✅ Validate booking data
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'required',
            'location' => 'required|string',
            'status' => 'nullable|in:pending,paid,cancel',
        ]);

        // ✅ Attach service ID to booking data
        $validated['service_id'] = $serviceId;

        // ✅ Get service and its owner_id
        $service = Service::findOrFail($serviceId);
        $ownerId = $service->owner_id;
   
        // ✅ Create booking
        $booking = Booking::create($validated);
        $booking->load('user', 'service');

        // ✅ Create notification with booking_id
        Notification::create([
            'owner_id'     => $ownerId,
            'user_id'      => $validated['user_id'],
            'booking_id'   => $booking->id, // ✅ Add booking_id
            'type'         => 'booking',
            'message'      => 'A new booking has been created.',
            'is_read'      => false,
            'service_id'   => $serviceId,
            'scheduled_at' => $validated['scheduled_date'] . ' ' . $validated['scheduled_time'],
        ]);

        // 🔔 Broadcast success
        event(new BookingNotificationEvent($booking, 'success'));

        return response()->json($booking, 201);

    } catch (\Exception $e) {
        event(new BookingNotificationEvent(new Booking([
            'user_id' => $request->user_id ?? null
        ]), 'error'));

        return response()->json([
            'message' => 'Booking failed.',
            'error' => $e->getMessage(),
        ], 500);
    }
}


    
    /**
     * Display the specified resource.
     */
    public function show($userId, $serviceId)
    {
        $booking = Booking::with('user', 'service')
            ->where('user_id', $userId)
            ->where('service_id', $serviceId)
            ->firstOrFail();
    
        // Append full image URL to the user image
        if ($booking->user && $booking->user->image) {
            $booking->user->image = asset('storage/' . $booking->user->image);
        }
    
        // Append full URLs to all service images if they exist
        if ($booking->service && is_array($booking->service->images)) {
            $booking->service->images = array_map(function ($image) {
                return asset('storage/' . $image);
            }, $booking->service->images);
        }
    
        return response()->json([
            'booking' => $booking,
        ]);
    }
    
    public function showownerid($id)
    {
        // Get all bookings with user and service info (including category, type)
        $allBookings = Booking::with([
            'user',
            'service' => function ($query) {
                $query->with(['category', 'type']);
            }
        ])
        ->whereHas('service', function ($query) use ($id) {
            $query->where('owner_id', $id);
        })
        ->get();
    
        // Total booking count (count all bookings)
        $totalBookingCount = $allBookings->count();
    
        // Total base price (sum of base_price * bookings)
        $totalBasePrice = $allBookings->sum(function ($booking) {
            return $booking->service->base_price ?? 0;
        });
    
        // Group bookings by service_id to calculate per-service counts and sums
        $groupedByService = $allBookings->groupBy('service_id');
    
        // Map unique service bookings with additional data (booking count and total price per service)
        $uniqueServiceBookings = $groupedByService->map(function ($bookings, $serviceId) {
            $firstBooking = $bookings->first();
    
            // Add per service booking count and total price fields
            $firstBooking->service_booking_count = $bookings->count();
            $firstBooking->service_total_price = $bookings->sum(function ($booking) {
                return $booking->service->base_price ?? 0;
            });
    
            return $firstBooking;
        })->values();
    
        // Format images urls
        $uniqueServiceBookings->transform(function ($booking) {
            if ($booking->user && $booking->user->image) {
                $booking->user->image = asset('storage/' . $booking->user->image);
            }
    
            if ($booking->service && is_array($booking->service->images)) {
                $booking->service->images = array_map(function ($image) {
                    return asset('storage/' . $image);
                }, $booking->service->images);
            }
    
            return $booking;
        });
    
        return response()->json([
            'owner_id' => $id,
            'related_bookings_stats' => [
                'total_booking_count' => $totalBookingCount,
                'unique_services_count' => $uniqueServiceBookings->count(),
                'total_base_price' => $totalBasePrice,
            ],
            'bookings' => $uniqueServiceBookings,
        ]);
    }
    
    
    
    
    
    /**
     * Update the specified resource in storage.
     */
    // public function update(Request $request, string $id)
    // {
    //     $booking = Booking::findOrFail($id);

    //     $validated = $request->validate([
    //         'scheduled_date' => 'sometimes|date',
    //         'scheduled_time' => 'sometimes',
    //         'location' => 'sometimes|string',
    //         'status' => 'nullable|in:pending,paid,cancel',
    //     ]);

    //     $booking->update($validated);
    //     $booking->load('user', 'service');

    //     // Transform image URLs
    //     if ($booking->user && $booking->user->image) {
    //         $booking->user->image = asset('storage/' . $booking->user->image);
    //     }

    //     if ($booking->service && is_array($booking->service->images)) {
    //         $booking->service->images = array_map(function ($image) {
    //             return asset('storage/' . $image);
    //         }, $booking->service->images);
    //     }

    //     return response()->json($booking);
    // }


public function update(Request $request, string $id)
{
    $booking = Booking::findOrFail($id);

    $validated = $request->validate([
        'scheduled_date' => 'sometimes|date',
        'scheduled_time' => 'sometimes',
        'location' => 'sometimes|string',
        'status' => 'nullable|in:pending,paid,cancel',
    ]);

    $booking->update($validated);
    $booking->load('user', 'service');

    // Send email notification
    if ($booking->user && $booking->user->email) {
        Mail::to($booking->user->email)->send(new BookingStatusUpdated($booking));
    }

    // Transform image URLs
    if ($booking->user && $booking->user->image) {
        $booking->user->image = asset('storage/' . $booking->user->image);
    }

    if ($booking->service && is_array($booking->service->images)) {
        $booking->service->images = array_map(function ($image) {
            return asset('storage/' . $image);
        }, $booking->service->images);
    }

    return response()->json($booking);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully.']);
    }
}
