<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    // Ensure only authenticated users can access this controller
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    /**
     * Display all users (admin only).
     */
    public function index()     
    {
        $user = Auth::user();
    
        // Check if the authenticated user has the 'admin' role
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized access. Only admins can view users.'], 403);
        }
    
        // Fetch all users and append the full image URL if it exists
        $users = User::all()->map(function ($user) {
            $user->image = $user->image
                ? asset('storage/' . $user->image)
                : null;
    
            return $user;
        });
    
        return response()->json($users);
    }
    
    /**
     * Register a new user (only admins can register users).
     */
    public function store(Request $request)
    {
        $user = Auth::user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized access. Only admins can register users.'], 403);
        }
    
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'in:user,admin,owner',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('users', 'public');
        }
    
        $data['password'] = Hash::make($data['password']);
        $data['admin_id'] = $user->id;
    
        $newUser = User::create($data);
    
        return response()->json([
            'user' => $newUser,
            'message' => 'User registered successfully'
        ], 201);
    }



    public function storeUserUnderOwner(Request $request, $ownerId)
    {
        $authUser = Auth::user();
    
        // ✅ Ensure the ownerId is valid and belongs to an actual owner
        $owner = User::where('id', $ownerId)->where('role', 'owner')->first();
        if (!$owner) {
            return response()->json(['message' => 'Invalid owner ID or user is not an owner.'], 404);
        }
    
        // ✅ Find the admin (e.g., the first one you have in the system)
        $admin = User::where('role', 'admin')->first(); // Or use specific logic to pick which admin
        if (!$admin) {
            return response()->json(['message' => 'Admin not found in the system.'], 500);
        }
    
        // ✅ Validate request
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|string|email|max:255|unique:users',
            'phone'      => 'required|string|max:20|unique:users',
            'password'   => 'required|string|min:8|confirmed',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
    
        // ✅ Handle image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('users', 'public');
        }
    
        // ✅ Prepare and store new user
        $data['password'] = Hash::make($data['password']);
        $data['admin_id'] = $admin->id; // Link to admin
        $data['owner_id'] = $ownerId;   // Link to owner
        $data['role']     = 'staff';    // Default role
    
        $newUser = User::create($data);
    
        return response()->json([
            'user' => $newUser,
            'message' => 'User created under owner successfully.'
        ], 201);
    }
    public function getUsersByOwner($ownerId)
{
    $authUser =Auth::user();

    // Authorization check
    if (!in_array($authUser->role, ['admin', 'owner']) || 
        ($authUser->role === 'owner' && $authUser->id != $ownerId)) {
        return response()->json(['message' => 'Unauthorized.'], 403);
    }

    $users = User::where('owner_id', $ownerId)->get();

    // Modify image paths
    foreach ($users as $userDetail) {
        $userDetail->image = $userDetail->image
            ? asset('storage/' . $userDetail->image)
            : null;
    }

    return response()->json([
        'users' => $users,
        'count' => $users->count()
    ]);
    }
    public function updateUserUnderOwner(Request $request, $ownerId, $userId)
    {
        $authUser = Auth::user();

        // ✅ Ensure the owner exists and is valid
        $owner = User::where('id', $ownerId)->where('role', 'owner')->first();
        if (!$owner) {
            return response()->json(['message' => 'Invalid owner ID or user is not an owner.'], 404);
        }

        // ✅ Ensure the user exists and is under this owner
        $user = User::where('id', $userId)
                    ->where('owner_id', $ownerId)
                    ->where('role', 'staff') // assuming you only want to update staff
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found or does not belong to this owner.'], 404);
        }

        // ✅ Validate request data
        $data = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name'  => 'sometimes|required|string|max:255',
            'email'      => 'sometimes|required|email|max:255|unique:users,email,' . $userId,
            'phone'      => 'sometimes|required|string|max:20|unique:users,phone,' . $userId,
            'password'   => 'sometimes|nullable|string|min:8|confirmed',
            'image'      => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        // ✅ Handle optional password update
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']); // don't overwrite existing password with null
        }

        // ✅ Handle optional image upload
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('users', 'public');
        }

        // ✅ Apply updates
        $user->update($data);

        return response()->json([
            'user' => $user,
            'message' => 'User under owner updated successfully.'
        ], 200);
    }

    public function deleteUserUnderOwner($ownerId, $userId)
    {
        // Get authenticated user if needed
        $authUser = Auth::user();

        // Validate owner exists and is an owner
        $owner = User::where('id', $ownerId)->where('role', 'owner')->first();
        if (!$owner) {
            return response()->json(['message' => 'Invalid owner ID or user is not an owner.'], 404);
        }

        // Find the user under this owner with role staff
        $user = User::where('id', $userId)
                    ->where('owner_id', $ownerId)
                    ->where('role', 'staff')
                    ->first();

        if (!$user) {
            return response()->json(['message' => 'User not found or does not belong to this owner.'], 404);
        }

        // Delete user
        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully.'
        ], 200);
    }

    public function getUserUnderOwner($ownerId, $userId)
    {
        // Validate owner exists and is an owner
        $owner = User::where('id', $ownerId)->where('role', 'owner')->first();
        if (!$owner) {
            return response()->json(['message' => 'Invalid owner ID or user is not an owner.'], 404);
        }

        // If userId is provided, fetch specific user
        if ($userId) {
            $user = User::where('id', $userId)
                        ->where('owner_id', $ownerId)
                        ->where('role', 'staff')
                        ->first();

            if (!$user) {
                return response()->json(['message' => 'User not found or does not belong to this owner.'], 404);
            }
            $user->image_url = $user->image
            ? asset('storage/' . $user->image)
            : null;

            return response()->json(['user' => $user], 200);
        }

        // Else return all staff under this owner
        $users = User::where('owner_id', $ownerId)
                    ->where('role', 'staff')
                    ->get();

                    

        return response()->json(['users' => $users], 200);
    }


    /**
     * Show a user by ID (admin or self).
     */
   public function show($id)
{
    $user = Auth::user();

    // Ensure that the user is an admin or they are trying to access their own account
    if ($user->role !== 'admin' && $user->id !== (int) $id) {
        return response()->json(['message' => 'Unauthorized access.'], 403);
    }

    // Fetch the user details
    $userDetail = User::findOrFail($id);

    // Update the user's image URL if exists
    $userDetail->image = $userDetail->image
        ? asset('storage/' . $userDetail->image)  // Prepend the full URL to the image path
        : null; // If no image, return null

    return response()->json($userDetail);
}


    /**
     * Update user (admin or self).
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
    
        // Ensure that the user is an admin or they are updating their own account
        if ($user->role !== 'admin' && $user->id !== (int) $id) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }
    
        // Validation for input fields
        $data = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:20|unique:users,phone,' . $id, // <-- Allow phone update
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'in:user,admin,owner',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // Image validation
        ]);
    
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }
    
        // If a new image is provided, handle the image upload
            if ($request->hasFile('image')) {
                // Delete the old image if it exists
                if ($user->image) {
                    Storage::disk('public')->delete($user->image);
                }
        
                // Store the new image
                $data['image'] = $request->file('image')->store('users', 'public');
            }
        
            // Find the user to update and apply the changes
            $userToUpdate = User::findOrFail($id);
            $userToUpdate->update($data);
    
        return response()->json($userToUpdate);
    }
    

    /**
     * Remove the specified user (only admins can delete users).
     */
    public function destroy($id)
    {
        $user = Auth::user();
    
        // Ensure the user is an admin
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }
    
        // Find the user to delete
        $userToDelete = User::find($id);
        if (!$userToDelete) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        // Delete the user
        $userToDelete->delete();
    
        return response()->json(['message' => 'User successfully deleted.'], 200);
    }
    
}
