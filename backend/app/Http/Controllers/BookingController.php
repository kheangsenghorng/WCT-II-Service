<?php

namespace App\Http\Controllers;

use App\Events\BookingNotificationEvent;
use App\Mail\BookingStatusUpdated;
use App\Models\Booking;
use App\Models\Notification;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;

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

    public function getUserBookings(Request $request)
    {
        $query = Booking::with('service', 'user');

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('token')) {
            $query->orWhere('token', $request->token);
        }

        $bookings = $query->get();

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
            'status' => 'nullable|in:pending,approve,complete,cancel',
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

    /**
     * Display the specified resource by ID.
     */
    public function showid($userId, $serviceId, $bookingId)
    {
        $booking = Booking::with([
                'user.companyInfo',         // booking user + their company info
                'service.owner.companyInfo' // service owner + their company info
            ])
            ->where('id', $bookingId)
            ->where('user_id', $userId)
            ->where('service_id', $serviceId)
            ->firstOrFail();
    
        // Fix image URL for booking user
        if ($booking->user && $booking->user->image) {
            $booking->user->image = asset('storage/' . $booking->user->image);
        }
    
        // Fix image URLs for service images
        if ($booking->service && is_array($booking->service->images)) {
            $booking->service->images = array_map(fn($img) => asset('storage/' . $img), $booking->service->images);
        }
    
        // Fix image URL for service owner
        if ($booking->service && $booking->service->owner && $booking->service->owner->image) {
            $booking->service->owner->image = asset('storage/' . $booking->service->owner->image);
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

    public function getByIdOwner($ownerId)
    {
        $bookings = Booking::with(['user', 'service' => function ($query) use ($ownerId) {
            $query->where('owner_id', $ownerId);
        }])->get();
    
        // Filter out bookings with no service (because the owner_id condition is inside the relation)
        $bookings = $bookings->filter(function ($booking) {
            return $booking->service !== null;
        })->values();
    
        // Transform image URLs 
        $bookings->transform(function ($booking) {
            if ($booking->user && $booking->user->image) {
                if (!preg_match('/^http/', $booking->user->image)) {
                    $booking->user->image = asset('storage/' . $booking->user->image);
                }
            }
    
            if ($booking->service && is_array($booking->service->images)) {
                $booking->service->images = array_map(function ($image) {
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

    
  

    public function showByOwnerAndService($ownerId, $serviceId)
    {
        $authUser = Auth::user();
    
        if (!$authUser || $authUser->id != $ownerId) {
            return response()->json([
                'message' => 'Unauthorized. You are not the owner of this service.'
            ], 403);
        }
    
        $service = Service::with(['category', 'type'])
            ->where('id', $serviceId)
            ->where('owner_id', $ownerId)
            ->first();
    
        if (!$service) {
            return response()->json([
                'message' => 'Service not found for this owner.'
            ], 404);
        }
    
        if (is_array($service->images)) {
            $service->images = array_map(function ($image) {
                return preg_match('/^http/', $image) ? $image : asset('storage/' . $image);
            }, $service->images);
        }
    
        if ($service->category && $service->category->image) {
            if (!preg_match('/^http/', $service->category->image)) {
                $service->category->image = asset('storage/' . $service->category->image);
            }
        }
    
        $bookings = Booking::with(['user'])
            ->whereHas('service', function ($query) use ($ownerId, $serviceId) {
                $query->where('owner_id', $ownerId)
                      ->where('id', $serviceId);
            })
            ->get();
    
        if ($bookings->isEmpty()) {
            return response()->json([
                'message' => 'No bookings found for this service.',
                'service' => $service,
                'related_bookings_stats' => [
                    'total_booking_count' => 0,
                    'unique_users_count' => 0,
                    'total_base_price' => 0,
                ],
                'user_bookings' => [],
            ]);
        }
    
        $basePrice = $service->base_price ?? 0;
    
        $groupedByUser = $bookings->groupBy('user_id');
    
        $userBookings = $groupedByUser->map(function ($userBookings, $userId) use ($basePrice) {
            $firstBooking = $userBookings->first();
    
            if ($firstBooking->user && $firstBooking->user->image) {
                if (!preg_match('/^http/', $firstBooking->user->image)) {
                    $firstBooking->user->image = asset('storage/' . $firstBooking->user->image);
                }
            }
    
            return [
                'user' => $firstBooking->user,
                'booking_count' => $userBookings->count(),
                'total_price' => $userBookings->count() * $basePrice,
                'bookings' => $userBookings->map(function ($booking) {
                    return [
                        'id' => $booking->id,
                        'scheduled_date' => $booking->scheduled_date,
                        'scheduled_time' => $booking->scheduled_time,
                        'location' => $booking->location,
                    ];
                })->values(),
            ];
        })->values();
    
        return response()->json([
            'owner_id' => $ownerId,
            'service_id' => $serviceId,
            'service' => $service,
            'related_bookings_stats' => [
                'total_booking_count' => $bookings->count(),
                'unique_users_count' => $userBookings->count(),
                'total_base_price' => $userBookings->sum('total_price'),
            ],
            'user_bookings' => $userBookings,
        ]);
    }
    

public function update(Request $request, string $id)
{
    $booking = Booking::findOrFail($id);

    $validated = $request->validate([
        'scheduled_date' => 'sometimes|date',
        'scheduled_time' => 'sometimes',
        'location' => 'sometimes|string',
        'status' => 'nullable|in:pending,approve,complete,cancel',
    ]);

    $booking->update($validated);
    $booking->load('user', 'service');

    // // Send email notification
    // if ($booking->user && $booking->user->email) {
    //     Mail::to($booking->user->email)->send(new BookingStatusUpdated($booking));
    // }

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
