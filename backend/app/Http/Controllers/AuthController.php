<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Validation\ValidationException;
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
        public function login(Request $request){
            $credentials = $request->only('email', 'password');

            try {
                if (!$token = JWTAuth::attempt($credentials)) {
                    return response()->json(['error' => 'Invalid credentials'], 401);
                }
        
                $user = auth()->user();
        
                return response()->json([
                    'token' => $token,  
                    'user' => JWTAuth::user(),
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

}
