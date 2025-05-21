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
}
