<?php


use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceCategoryController;
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
    });

    // Users can update their own profile
    Route::put('users/{id}', [UserController::class, 'update']); // Update own profile
    Route::get('users/{id}', [UserController::class, 'show']); // Get user by id (admin only)
});

//owner

Route::middleware('auth:api')->group(function () {
    Route::prefix('owner')->group(function () {
        Route::get('users', [UserController::class, 'index']);  // Get all users (admin only)
        Route::post('users/{id}', [UserController::class, 'storeUserUnderOwner']); // Create a new user (admin only)
        Route::get('users/{id}', [UserController::class, 'getUsersByOwner']); // Get user by id (admin only)
        Route::put('users/{id}', [UserController::class, 'update']); // Update user (admin only)
        Route::delete('users/{id}', [UserController::class, 'destroy']); // Delete user (admin only)

    });

});


//category


Route::prefix('categories')->group(function () {
    Route::get('/', [ServiceCategoryController::class, 'index']);
    Route::get('/{slug}', [ServiceCategoryController::class, 'show']);
});

