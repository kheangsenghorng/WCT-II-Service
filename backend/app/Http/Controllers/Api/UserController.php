<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
        $user = auth()->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized access. Only admins can view users.'], 403);
        }

        return response()->json(User::all());
    }

    /**
     * Register a new user (only admins can register users).
     */
    public function store(Request $request)
    {
        $user = auth()->user();
        if ($user->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized access. Only admins can register users.'], 403);
        }

        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:20|unique:users', // <-- Add phone validation
            'password' => 'required|string|min:8|confirmed',
            'role' => 'in:user,admin,owner',
        ]);
        
        $newUser = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'email' => $request->email,
            'phone' => $request->phone, // <-- Save phone
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'user',
            'admin_id' => $user->role === 'admin' ? $user->id : null,
        ]);
        
        return response()->json([
            'user' => $newUser,
            'message' => 'User registered successfully'
        ], 201);
    }

    /**
     * Show a user by ID (admin or self).
     */
    public function show($id)
    {
        $user = auth()->user();

        // Ensure that the user is an admin or they are trying to access their own account
        if ($user->role !== 'admin' && $user->id !== (int) $id) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        $userDetail = User::findOrFail($id);
        return response()->json($userDetail);
    }

    /**
     * Update user (admin or self).
     */
    public function update(Request $request, $id)
    {
        $user = auth()->user();

        // Ensure that the user is an admin or they are updating their own account
        if ($user->role !== 'admin' && $user->id !== (int) $id) {
            return response()->json(['message' => 'Unauthorized access.'], 403);
        }

        $data = $request->validate([
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'phone' => 'sometimes|string|max:20|unique:users,phone,' . $id, // <-- Allow phone update
            'password' => 'nullable|string|min:8|confirmed',
            'role' => 'in:user,admin,owner',
        ]);
        
        if ($request->has('password')) {
            $data['password'] = Hash::make($request->password);
        }

        $userToUpdate = User::findOrFail($id);
        $userToUpdate->update($data);
        return response()->json($userToUpdate);
    }

    /**
     * Remove the specified user (only admins can delete users).
     */
    public function destroy($id)
    {
        $user = auth()->user();
    
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
