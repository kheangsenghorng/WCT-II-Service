<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Service;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = Booking::with('user', 'service')->get();

        // Transform image URLs
        $bookings->transform(function ($booking) {
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

        return response()->json($bookings);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $serviceId)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'scheduled_date' => 'required|date',
            'scheduled_time' => 'required',
            'location' => 'required|string',
            'status' => 'nullable|in:pending,paid,cancel',
        ]);
    
        $validated['service_id'] = $serviceId;
    
        $booking = Booking::create($validated);
        $booking->load('user','service');
    
        return response()->json($booking, 201);
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
     * Update the specified resource in storage.
     */
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
