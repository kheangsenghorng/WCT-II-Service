<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\User;
use App\Models\BookingStaff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;


class BookingStaffController extends Controller
{
    // Assign a staff to a bookinguse Illuminate\Support\Facades\Auth;

    /**
     * Assign a staff member to a booking.
     *
     * @param Request $request
     * @param int $ownerId
     * @return \Illuminate\Http\JsonResponse
     */

     private function transformStaffImage($staffCollection)
    {
        return $staffCollection->map(function ($user) {
            $user->image = $user->image ? asset('storage/' . $user->image) : null;
            return $user;
        });
    }

    // ✅ Assign a staff member to a booking
    // public function assign(Request $request, $ownerId)
    // {
    //     $validated = $request->validate([
    //         'booking_id' => 'required|exists:bookings,id',
    //         'staff_id' => 'required|exists:users,id',
    //     ]);
    
    //     // Confirm the authenticated user matches the route owner ID
    //     if ((int) $ownerId !== Auth::id()) {
    //         return response()->json(['message' => 'Unauthorized: owner ID mismatch.'], 403);
    //     }
    
    //     // Confirm this user is actually an 'owner'
    //     $owner = User::where('id', $ownerId)->where('role', 'owner')->first();
    //     if (!$owner) {
    //         return response()->json(['message' => 'Invalid owner ID or user is not an owner.'], 404);
    //     }
    
    //     // Confirm the booking belongs to this owner
    //     // $booking = Booking::find($validated['booking_id']);
    //     // if (!$booking || $booking->owner_id !== (int) $ownerId) {
    //     //     return response()->json(['message' => 'Unauthorized: You do not own this booking.'], 403);
    //     // }
    
    //     // Confirm the staff belongs to this owner
    //     $staff = User::where('id', $validated['staff_id'])
    //         ->where('role', 'staff')
    //         ->where('owner_id', $ownerId)
    //         ->first();
    
    //     if (!$staff) {
    //         return response()->json(['message' => 'The staff does not belong to this owner.'], 403);
    //     }
    
    //     // Prevent assigning the same staff more than once to this booking
    //     // $alreadyAssigned = BookingStaff::where('booking_id', $validated['booking_id'])
    //     //     ->where('staff_id', $validated['staff_id'])
    //     //     ->exists();
    
    //     // if ($alreadyAssigned) {
    //     //     return response()->json(['message' => 'This staff is already assigned to this booking.'], 409);
    //     // }
    
    //     // Assign the staff
    //     $assignment = BookingStaff::create([
    //         'booking_id' => $validated['booking_id'],
    //         'staff_id' => $validated['staff_id'],
    //         'assigned_at' => now(),
    //     ]);
    
    //     return response()->json([
    //         'message' => 'Staff assigned successfully.',
    //         'data' => $assignment
    //     ], 201);
    // }

//     public function assign(Request $request, $ownerId)
// {
//     $validated = $request->validate([
//         'booking_id' => 'required|exists:bookings,id',
//         'staff_id' => 'required|exists:users,id',
//     ]);

//     // Confirm the authenticated user matches the route owner ID
//     if ((int) $ownerId !== Auth::id()) {
//         return response()->json(['message' => 'Unauthorized: owner ID mismatch.'], 403);
//     }

//     // Confirm this user is actually an 'owner'
//     $owner = User::where('id', $ownerId)->where('role', 'owner')->first();
//     if (!$owner) {
//         return response()->json(['message' => 'Invalid owner ID or user is not an owner.'], 404);
//     }

//     // Confirm the staff belongs to this owner
//     $staff = User::where('id', $validated['staff_id'])
//         ->where('role', 'staff')
//         ->where('owner_id', $ownerId)
//         ->first();

//     if (!$staff) {
//         return response()->json(['message' => 'The staff does not belong to this owner.'], 403);
//     }

//     // Assign the staff
//     $assignment = BookingStaff::create([
//         'booking_id' => $validated['booking_id'],
//         'staff_id' => $validated['staff_id'],
//         'assigned_at' => now(),
//     ]);

//     // ✅ Update booking status to "approve"
//     Booking::where('id', $validated['booking_id'])->update([
//         'status' => 'approve',
//     ]);

//     return response()->json([
//         'message' => 'Staff assigned successfully and booking approved.',
//         'data' => $assignment
//     ], 201);
// }

    public function assign(Request $request, $ownerId)
    {
        $data = $request->all();

        // Validate array structure
        $request->validate([
            '*.booking_id' => 'required|exists:bookings,id',
            '*.staff_id' => 'required|exists:users,id',
        ]);

        // Confirm the authenticated user matches the route owner ID
        if ((int) $ownerId !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized: owner ID mismatch.'], 403);
        }

        // Confirm this user is actually an 'owner'
        $owner = User::where('id', $ownerId)->where('role', 'owner')->first();
        if (!$owner) {
            return response()->json(['message' => 'Invalid owner ID or user is not an owner.'], 404);
        }

        $assignments = [];
        foreach ($data as $item) {
            $bookingId = $item['booking_id'];
            $staffId = $item['staff_id'];

            // Confirm the staff belongs to this owner
            $staff = User::where('id', $staffId)
                ->where('role', 'staff')
                ->where('owner_id', $ownerId)
                ->first();

            if (!$staff) {
                return response()->json([
                    'message' => "Staff ID $staffId does not belong to this owner."
                ], 403);
            }

            // Assign staff to booking
            $assignment = BookingStaff::create([
                'booking_id' => $bookingId,
                'staff_id' => $staffId,
                'assigned_at' => now(),
            ]);

            // Update booking status to "approve"
            Booking::where('id', $bookingId)->update([
                'status' => 'approve',
            ]);

            $assignments[] = $assignment;
        }

        return response()->json([
            'message' => 'Staff assigned successfully and bookings approved.',
            'data' => $assignments
        ], 201);
    }


    // List staff assigned to a booking
    public function getStaffByBooking($bookingId)
    {
        $booking = Booking::with('staff')->findOrFail($bookingId);
    
        // Pass only the staff collection to the transform function
        $transformedStaff = $this->transformStaffImage($booking->staff);
    
        return response()->json($transformedStaff);
    }
    

    // Remove staff from booking
    public function unassign($bookingId, $staffId)
    {
        BookingStaff::where('booking_id', $bookingId)
                    ->where('staff_id', $staffId)
                    ->delete();

        return response()->json(['message' => 'Staff unassigned successfully']);
    }


    public function getStaffByOwner($ownerId)
    {
        // Ensure the authenticated user is the requested owner
        if ((int) $ownerId !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized: Owner ID mismatch.'], 403);
        }
    
        // Confirm the user is an actual owner
        $owner = User::where('id', $ownerId)->where('role', 'owner')->first();
        if (!$owner) {
            return response()->json(['message' => 'Owner not found or not authorized.'], 404);
        }
    
        // Get all staff under this owner
        $allStaff = User::where('owner_id', $ownerId)
            ->where('role', 'staff')
            ->get();
    
        // Filter staff: exclude if assigned to any booking not complete
        $filteredStaff = $allStaff->filter(function ($staff) {
            // Check if there exists any booking for this staff that is not complete
            return DB::table('booking_staff')
                ->join('bookings', 'booking_staff.booking_id', '=', 'bookings.id')
                ->where('booking_staff.staff_id', $staff->id)
                ->where('bookings.status', '!=', 'complete')
                ->exists();
        })->values();

          // Transform images
          $transformedStaff = $this->transformStaffImage($filteredStaff);
    
        return response()->json([
            'message' => 'Filtered staff retrieved successfully.',
            'data' => $transformedStaff,
        ]);
    }

    public function getShowStaff($ownerId)
    {
        // Ensure the authenticated user is the requested owner
        if ((int) $ownerId !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized: Owner ID mismatch.'], 403);
        }

        // Confirm the user is an actual owner
        $owner = User::where('id', $ownerId)->where('role', 'owner')->first();
        if (!$owner) {
            return response()->json(['message' => 'Owner not found or not authorized.'], 404);
        }

        // Get all staff under this owner
        $allStaff = User::where('owner_id', $ownerId)
            ->where('role', 'staff')
            ->get();

        // Filter staff: remove staff with any booking that is not complete
        $filteredStaff = $allStaff->filter(function ($staff) {
            // Check if this staff has any booking not complete
            $hasIncompleteBooking = DB::table('booking_staff')
                ->join('bookings', 'booking_staff.booking_id', '=', 'bookings.id')
                ->where('booking_staff.staff_id', $staff->id)
                ->where('bookings.status', '!=', 'complete')
                ->exists();

            // Return true to keep staff if they have NO incomplete booking
            return !$hasIncompleteBooking;
        })->values();

        // Transform images
        $transformedStaff = $this->transformStaffImage($filteredStaff);

        return response()->json([
            'message' => 'Filtered staff retrieved successfully.',
            'data' => $transformedStaff,
        ]);
    }

    

}
