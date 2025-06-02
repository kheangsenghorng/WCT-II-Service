<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    // Register a new user
        public function register(Request $request)
    {
        try {
            $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'phone' => 'required|string|max:20|unique:users', // <-- Add phone validation
                'password' => 'required|string|min:8|confirmed',
                'role' => 'in:user,admin,owner',
            ]);

            // Find the first user with role = 'admin'
            $admin = User::where('role', 'admin')->first();

            // Create the user and auto-assign admin_id if admin is found
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone, // <-- Save phone
                'password' => Hash::make($request->password),
                'role' => $request->role ?? 'user',
                'admin_id' => $admin ? $admin->id : null,
            ]);

            return response()->json([
                'user' => $user,
                'message' => 'User registered successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        }
    }

    
    
    //Login user

    // public function login(Request $request)
    // {
    //     $request->validate([
    //         'email' => 'required|email',
    //         'password' => 'required|string',
    //     ]);
    
    //     try {
    //         // Check if user exists
    //         $user = User::where('email', $request->email)->first();
    
    //         if (!$user) {
    //             return response()->json(['error' => 'Invalid email']);
    //         }
    
    //         // Check if password is correct
    //         if (!Hash::check($request->password, $user->password)) {
    //             return response()->json(['error' => 'Invalid password']);
    //         }
    
    //         // Generate JWT token
    //         if (!$token = JWTAuth::fromUser($user)) {
    //             return response()->json(['error' => 'Could not create token']);
    //         }
    
    //         return response()->json([
    //             'token' => $token,
    //             'user' => $user,
    //             'message' => 'Login successful',
    //         ]);
    
    //     } catch (JWTException $e) {
    //         return response()->json(['error' => 'Could not create token'], 500);
    //     }
    // }

    public function login(Request $request){
        $credentials = $request->only('email', 'password');
    
        $user = User::where('email', $credentials['email'])->first();
    
        if (!$user) {
            return response()->json(['error' => 'Invalid email'], 401);
        }
    
        if (!Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Invalid password'], 401);
        }
    
        try {
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json(['error' => 'Invalid credentials'], 401);
            }
    
            return response()->json([
                'token' => $token,
                'user' => $user,
                'message' => 'Login successful',
            ]);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Could not create token'], 500);
        }
    }
    
    
        public function checkEmail(Request $request)
        {
            $email = $request->query('email');
        
            if (!$email) {
                return response()->json([
                    'message' => 'Email is required.',
                ], 400);
            }
        
            $exists = User::where('email', $email)->exists();
        
            return response()->json([
                'available' => !$exists,
            ]);
        }
        /**
     * Update phone number for the authenticated user.
     */
   /**
     * Check if phone number is already taken.
     */
    public function checkPhone(Request $request)
    {
        $phone = $request->query('phone'); // Get the phone number from the request

        if (!$phone) {
            return response()->json([
                'message' => 'Phone number is required.',
            ], 400);
        }

        // Check if phone exists in the database
        $exists = User::where('phone', $phone)->exists();

        return response()->json([
            'available' => !$exists, // If phone doesn't exist, it's available
        ]);
    }
        public function logout(Request $request)
    {
        try {
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'message' => 'User successfully logged out.'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'error' => 'Failed to logout, please try again.'
            ], 500);
        }
    }

    public function refresh()
    {
        try {
            $newToken = JWTAuth::parseToken()->refresh();

            return response()->json([
                'token' => $newToken,
                'message' => 'Token refreshed successfully.'
            ]);
        } catch (JWTException $e) {
            return response()->json([
                'error' => 'Token refresh failed.',
            ], 401);
        }
    }

    public function me()
{
    return response()->json([
        'user' => Auth::user()
    ]);
}


}
