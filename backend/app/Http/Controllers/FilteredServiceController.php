<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;

class FilteredServiceController extends Controller
{
    public function index(Request $request)
    {
        //GET /api/filtered-services?category=1&type=2&owner_id=3&price_min=10&price_max=100

        $query = Service::with(['category', 'type', 'owner']);

        // Optional filters
        if ($request->filled('category')) {
            $query->where('service_categories_id', $request->category);
        }

        if ($request->filled('type')) {
            $query->where('type_id', $request->type);
        }

        if ($request->filled('owner_id')) {
            $query->where('owner_id', $request->owner_id);
        }

        if ($request->filled('price_min')) {
            $query->where('base_price', '>=', $request->price_min);
        }

        if ($request->filled('price_max')) {
            $query->where('base_price', '<=', $request->price_max);
        }

        $services = $query->get();

        // Format image paths
        $services->map(function ($service) {
            if (is_array($service->images)) {
                $service->images = array_map(fn($img) => asset('storage/' . $img), $service->images);
            } elseif (is_string($service->images)) {
                $service->images = [asset('storage/' . $service->images)];
            }
            return $service;
        });

        return response()->json($services);
    }

    public function getByUserAndService($userId, $serviceId)
    {
    //         use App\Http\Controllers\BookingController;
    // GET /api/bookings/user/5/service/2
    // Route::get('/bookings/user/{userId}/service/{serviceId}', [BookingController::class, 'getByUserAndService']);

        $bookings = Booking::with(['user', 'service'])
            ->where('user_id', $userId)
            ->where('service_id', $serviceId)
            ->get();

        return response()->json($bookings);
    }


//     public function show($userId, $serviceId)
// {
//     $booking = Booking::with('user', 'service')
//         ->where('user_id', $userId)
//         ->where('service_id', $serviceId)
//         ->firstOrFail();

//     // Ensure user image URL is complete
//     if ($booking->user && $booking->user->image) {
//         $booking->user->image = asset('storage/' . ltrim($booking->user->image, '/'));
//     }

//     // Ensure service images are all full URLs
//     if ($booking->service && is_array($booking->service->images)) {
//         $booking->service->images = array_map(function ($image) {
//             return asset('storage/' . ltrim($image, '/'));
//         }, $booking->service->images);
//     }

//     return response()->json([
//         'booking' => $booking,
//     ]);
// }

public function show($userId, $serviceId)
{
    $bookings = Booking::with('user', 'service')
        ->where('user_id', $userId)
        ->where('service_id', $serviceId)
        ->get();

    // Process each booking to format images
    $bookings->transform(function ($booking) {
        // Format user image URL only if not already a full URL
        if ($booking->user && $booking->user->image && !preg_match('/^https?:\/\//', $booking->user->image)) {
            $booking->user->image = asset('storage/' . ltrim($booking->user->image, '/'));
        }

        // Format service images URLs only if not already full URLs
        if ($booking->service && is_array($booking->service->images)) {
            $booking->service->images = array_map(function ($image) {
                return preg_match('/^https?:\/\//', $image)
                    ? $image
                    : asset('storage/' . ltrim($image, '/'));
            }, $booking->service->images);
        }

        return $booking;
    });

    return response()->json([
        'bookings' => $bookings,
    ]);
}

public function showById($id)
{
    $booking = Booking::with('user', 'service')->findOrFail($id);

    // Format user image URL if not full URL
    if ($booking->user && $booking->user->image && !preg_match('/^https?:\/\//', $booking->user->image)) {
        $booking->user->image = asset('storage/' . ltrim($booking->user->image, '/'));
    }

    // Format service images URLs if not full URLs
    if ($booking->service && is_array($booking->service->images)) {
        $booking->service->images = array_map(function ($image) {
            return preg_match('/^https?:\/\//', $image)
                ? $image
                : asset('storage/' . ltrim($image, '/'));
        }, $booking->service->images);
    }

    return response()->json([
        'booking' => $booking,
    ]);
}



}
