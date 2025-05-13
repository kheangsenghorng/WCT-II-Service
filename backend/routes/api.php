<?php


use App\Http\Controllers\Api\TypeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// rest routes
//Auth
Route::post("register", [AuthController::class, "register"]);
Route::post("login", [AuthController::class, "login"]);
Route::get('/check-email', [AuthController::class, 'checkEmail']);
Route::get('check-phone', [AuthController::class, 'checkPhone']);


Route::middleware("auth:api")->group(function () {
    Route::get("user", [AuthController::class, "user"]);
    Route::post("logout", [AuthController::class, "logout"]);
    Route::post("refresh", [AuthController::class, "refresh"]);
    Route::post("me", [AuthController::class, "me"]);
});



//User
Route::middleware('auth:api')->group(function () {
    // Only accessible by admin
    Route::prefix('admin')->group(function () {
        Route::get('users', [UserController::class, 'index']);  // Get all users (admin only)
        Route::post('users', [UserController::class, 'store']); // Create a new user (admin only)
        Route::get('users/{id}', [UserController::class, 'show']); // Get user by id (admin only)
        Route::put('users/{id}', [UserController::class, 'update']); // Update user (admin only)
        Route::delete('users/{id}', [UserController::class, 'destroy']); // Delete user (admin only)

        //Category by admin
        Route::prefix('categories')->group(function () {
            Route::get('/', [ServiceCategoryController::class, 'index']);
            Route::post('/', [ServiceCategoryController::class, 'store']);
            Route::get('/{slug}', [ServiceCategoryController::class, 'show']);
            Route::put('/{slug}', [ServiceCategoryController::class, 'update']);
            Route::delete('/{slug}', [ServiceCategoryController::class, 'destroy']);
        });

        Route::prefix('type')->group(function () {
            Route::get('', [TypeController::class, 'index']);  // Get all users (admin only)
            Route::post('/', [TypeController::class, 'store']); // Create a new user (admin only)
            Route::get('/{id}', [TypeController::class, 'show']); // Get user by id (admin only)
            Route::put('/{id}', [TypeController::class, 'update']); // Update user (admin only)
            Route::delete('/{id}', [TypeController::class, 'destroy']); // Delete user (admin only)
    
        });
        
    });
    
    Route::get('/', [ServiceController::class, 'index']);  

    // Users can update their own profile
    Route::put('users/{id}', [UserController::class, 'update']); // Update own profile
    Route::get('users/{id}', [UserController::class, 'show']); // Get user by id (admin only)
//Booking
    // Route::get('/booking/user/{userId}/service/{serviceId}', [BookingController::class, 'show']);
    // Route::post('/{serviceId}/bookings', [BookingController::class, 'store']);

    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingController::class, 'index']); // GET all bookings
        Route::post('/{serviceId}', [BookingController::class, 'store']); // POST create booking for a specific service
        Route::get('/user/{userId}/service/{serviceId}', [BookingController::class, 'show']); // GET booking by user & service
        Route::put('/{id}', [BookingController::class, 'update']); // PUT update booking by ID
        Route::delete('/{id}', [BookingController::class, 'destroy']); // DELETE booking by ID
    });
});
//owner

Route::middleware('auth:api')->group(function () {
    Route::prefix('owner')->group(function () {
        Route::get('users', [UserController::class, 'index']);  // Get all users (admin only)
        Route::post('/{id}', [UserController::class, 'storeUserUnderOwner']); // Create a new user (admin only)
        Route::get('users/{id}', [UserController::class, 'getUsersByOwner']); // Get user by id (admin only)
        Route::put('users/{id}', [UserController::class, 'update']); // Update user (admin only)
        Route::delete('users/{id}', [UserController::class, 'destroy']); // Delete user (admin only)
       // Owner-specific service management
       
    });
    

});

//category

Route::middleware('auth:api')->group(function () {
    Route::prefix('categories')->group(function () {
        Route::get('/', [ServiceCategoryController::class, 'index']);
        Route::get('/{slug}', [ServiceCategoryController::class, 'show']);


    });

});

// Route::prefix('{id}/services')->group(function () {
//     Route::get('/', [ServiceController::class, 'index']);         // List services for owner
//     Route::post('/', [ServiceController::class, 'store']);        // Create service for owner
//     Route::get('/{serviceId}', [ServiceController::class, 'show']);   // Show specific service
//     Route::put('/{serviceId}', [ServiceController::class, 'update']); // Update service
//     Route::delete('/{serviceId}', [ServiceController::class, 'destroy']); // Delete service
// });


Route::middleware('auth:api')->prefix('owner')->group(function () {
    Route::prefix('{id}/services')->group(function () {
             // List services for owner
        Route::post('/', [ServiceController::class, 'store']);        // Create service for owner
        Route::get('/{serviceId}', [ServiceController::class, 'show']);   // Show specific service
        Route::put('/{serviceId}', [ServiceController::class, 'update']); // Update service
        Route::delete('/{serviceId}', [ServiceController::class, 'destroy']); // Delete service
    });

     // Booking routes nested under service
 
});





