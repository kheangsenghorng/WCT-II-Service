<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        $notifications = Notification::orderBy('owner_id', 'asc')->get();
        return response()->json($notifications);
    }

    // Get only authenticated user's notifications
    public function myNotifications()
    {
        $notifications = Notification::where('owner_id', auth()->id())
                                     ->orderBy('created_at', 'desc')
                                     ->get();
        return response()->json($notifications);
    }
    public function getByOwnerId($ownerId)
    {
        if (auth()->id() !== (int) $ownerId && !auth()->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        $notifications = Notification::with(['user', 'service'])
            ->where('owner_id', $ownerId)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                // Process user image
                if ($notification->user && $notification->user->image) {
                    $image = $notification->user->image;
                    if (!preg_match('/^https?:\/\//', $image)) {
                        $notification->user->image = asset('storage/' . $image);
                    }
                }
    
                // Process service images (assuming images is an array or JSON field)
                if ($notification->service) {
                    // If single image
                    if (isset($notification->service->image) && !preg_match('/^https?:\/\//', $notification->service->image)) {
                        $notification->service->image = asset('storage/' . $notification->service->image);
                    }
    
                    // If multiple images
                    if (is_array($notification->service->images)) {
                        $notification->service->images = array_map(function ($img) {
                            return asset('storage/' . $img);
                        }, $notification->service->images);
                    }
                }
    
                return $notification;
            });
    
        return response()->json($notifications);
    }
    


    // (Optional) Mark a notification as read
    public function markAsRead($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marked as read.']);
    }

      // (Optional) Delete a notification
      public function destroy($id)
      {
          Notification::destroy($id);
          return response()->json(['message' => 'Notification deleted.']);
      }

}
