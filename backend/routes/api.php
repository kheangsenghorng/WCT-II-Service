<?php


use App\Http\Controllers\Api\TypeController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\FilteredServiceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ServiceCategoryController;
use App\Http\Controllers\ServiceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Broadcast;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\BookingStaffController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::middleware('auth:sanctum')->post('/broadcasting/auth', function () {
    return Broadcast::auth(request());
});


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

          // Blog Routes
          Route::prefix('blogs')->group(function () {
            Route::get('/', [BlogController::class, 'index']);   // Get all blogs
            Route::post('/{id}', [BlogController::class, 'store']);         // Create a new blog
            Route::get('/{id}', [BlogController::class, 'show']);       // Get blog by id
            Route::put('/edit/{id}', [BlogController::class, 'update']);     // Update blog by id
            Route::delete('/{id}', [BlogController::class, 'destroy']); // Delete blog by id
        });
        
        
    });
    
    Route::get('type', [TypeController::class, 'index']);  
    // Users can update their own profile
    Route::put('users/{id}', [UserController::class, 'update']); // Update own profile
    Route::get('users/{id}', [UserController::class, 'show']); // Get user by id (admin only)
  //Booking
    // Route::get('/booking/user/{userId}/service/{serviceId}', [BookingController::class, 'show']);
    // Route::post('/{serviceId}/bookings', [BookingController::class, 'store']);

    Route::prefix('bookings')->group(function () {
        Route::get('/', [BookingController::class, 'index']); // GET all bookings
        Route::post('/services/{serviceId}', [BookingController::class, 'store']); // POST create booking for a specific service
        Route::get('/user/{userId}/service/{serviceId}', [BookingController::class, 'show']); // GET booking by user & service
        Route::get('/user/{userId}/service/{serviceId}/booking/{bookingId}', [BookingController::class, 'showid']); // GET booking by user & service
        Route::get('/user/{id}', [FilteredServiceController::class, 'showByIduser']);  
        Route::put('/{id}', [BookingController::class, 'update']); // PUT update booking by ID
        Route::delete('/{id}', [BookingController::class, 'destroy']); // DELETE booking by ID
    });

} );

Route::put('bookingtest/{id}', [BookingController::class, 'update']); // PUT update booking by ID
//owner

Route::middleware('auth:api')->group(function () {
    Route::prefix('owner')->group(function () {
        Route::get('users', [UserController::class, 'index']);  // Get all users (admin only)
        Route::post('/{id}', [UserController::class, 'storeUserUnderOwner']); // Create a new user (admin only)
        Route::get('users/{id}', [UserController::class, 'getUsersByOwner']); // Get user by id (admin only)
        Route::put('users/{id}', [UserController::class, 'update']); // Update user (admin only)
        Route::put('{ownerId}/user/{userId}', [UserController::class, 'updateUserUnderOwner']);
        Route::delete('{ownerId}/user/{userId}', [UserController::class, 'deleteUserUnderOwner']);

       // Owner-specific service management
       Route::get('/{ownerId}/users/{userId}', [UserController::class, 'getUserUnderOwner']);
       
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

    // 📦 Service routes for owner (nested under owner's ID)
    Route::prefix('{id}/services')->group(function () {
        Route::post('/', [ServiceController::class, 'store']);              // Create service
        Route::get('/{serviceId}', [ServiceController::class, 'show']);     // Show specific service
        Route::put('/{serviceId}', [ServiceController::class, 'update']);   // Update service
        Route::delete('/{serviceId}', [ServiceController::class, 'destroy']); // Delete service
        // Route::delete('{serviceId}/image', [ServiceController::class, 'deleteImage']);

    });
    Route::get('/{id}/services', [ServiceController::class, 'getByOwner']);
    Route::delete('/services/{serviceId}/image', [ServiceController::class, 'deleteImage']);  
    // 🔔 Notification routes (not nested under services)
    Route::prefix('/notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);          // All notifications (ordered by owners_id)
        Route::get('/my/all', [NotificationController::class, 'myNotifications']); // Current user's notifications
        Route::get('/my/{ownerId}', [NotificationController::class, 'getByOwnerId']); // Current user's notifications
        Route::patch('/{id}/read', [NotificationController::class, 'markAsRead']); // Mark as read
        Route::delete('/{id}',  [NotificationController::class, 'destroy']);     // Delete
    });
 
    // FilteredServiceController
    
    Route::get('/booking/{id}', [FilteredServiceController::class, 'showById']);  
    Route::get('/user/{userId}/service/{serviceId}', [FilteredServiceController::class, 'show']);


    //BookingController
    Route::get('/bookings/by-owner/{id}', [BookingController::class, 'showownerid']);
    Route::get('/bookings/by-owner/{id}/service/{serviceId}', [BookingController::class, 'showByOwnerAndService']);
    Route::get('/bookings/user', [BookingController::class, 'getUserBookings']);
    Route::get('/by-owner/{ownerId}', [BookingController::class, 'getByIdOwner']);


Route::post('/{ownerId}/booking-staff/assign', [BookingStaffController::class, 'assign']);
Route::get('/booking-staff/{bookingId}', [BookingStaffController::class, 'getStaffByBooking']);
Route::delete('/booking-staff/{bookingId}/staff/{staffId}', [BookingStaffController::class, 'unassign']);
//show no complete staff by owner
Route::get('/booking-staff/by-owner/{ownerId}', [BookingStaffController::class, 'getStaffByOwner']);
//show all staff by owner
Route::get('/booking-staff/show/{ownerId}', [BookingStaffController::class, 'getShowStaff']);
});

Route::get('/categories', [ServiceCategoryController::class, 'index']);
Route::get('blogs', [BlogController::class, 'index']);   
Route::get('/type', [TypeController::class, 'index']);  

//ServiceController
Route::get('/services', [ServiceController::class, 'index']);
//get by id service
Route::get('/services/{id}', [FilteredServiceController::class, 'showservice']);
Route::get('/bookings/booked-times/{serviceId}', [FilteredServiceController::class, 'getBookedSlots']);

// routes/api.php
Route::get('/service-types', [TypeController::class, 'showcategoryId']);






