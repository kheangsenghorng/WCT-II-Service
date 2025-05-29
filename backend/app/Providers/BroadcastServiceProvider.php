<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Broadcast; // Correct facade import

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register broadcast routes with 'auth:sanctum' middleware
        Broadcast::routes(['middleware' => ['auth:sanctum']]);

        // Load channel authorization routes
        require base_path('routes/channels.php');
    }
}
