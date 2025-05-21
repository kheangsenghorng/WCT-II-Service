<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    // public function index(Request $request)
    // {
    //     // Start by querying services for the given owner_id
    //     $query = Service::where('owner_id');
    
    //     // If 'category' parameter is provided, filter by service_categories_id
    //     if ($request->has('category')) {
    //         $query->where('service_categories_id', $request->category);
    //     }
    
    //     // If 'type' parameter is provided, filter by type_id
    //     if ($request->has('type')) {
    //         $query->where('type_id', $request->type);
    //     }
    
    //     // Execute the query and return the results as JSON
    //     return response()->json($query->get());
    // }
    public function index(Request $request)
    {
        // Eager load related models: category, type, and owner
        $query = Service::with(['category', 'type', 'owner']);
    
        // Apply category filter if provided
        if ($request->filled('category')) {
            $query->where('service_categories_id', $request->category);
        }
    
        // Apply type filter if provided
        if ($request->filled('type')) {
            $query->where('type_id', $request->type);
        }
    
        // Get the filtered services
        $services = $query->get();
    
        // Format service image URLs (assuming 'images' is a string or a single image path)
        $services->map(function ($service) {
            if (is_array($service->images)) {
                $service->images = array_map(function ($img) {
                    return asset('storage/' . $img);
                }, $service->images);
            }
            return $service;
        });
        
    
        return response()->json($services);
    }
    
    public function getByOwner($ownerId)
{
    $services = Service::with(['category', 'type', 'owner'])
        ->where('owner_id', $ownerId)
        ->get();

    $services->map(function ($service) {
        if (is_array($service->images)) {
            $service->images = array_map(fn($img) => asset('storage/' . $img), $service->images);
        } elseif (is_string($service->images)) {
            $service->images = [asset('storage/' . $service->images)];
        }
        return $service;
    });

    return response()->json($services);
}

    



    public function show($id, $serviceId)
    {
        $service = Service::with(['category', 'type', 'owner'])
            ->where('id', $serviceId)
            ->where('owner_id', $id)
            ->first();
    
        if (!$service) {
            return response()->json(['message' => 'Service not found or access denied'], 404);
        }
    
        // Handle image formatting
        if (is_array($service->images)) {
            $service->images = array_map(function ($img) {
                return asset('storage/' . $img);
            }, $service->images);
        } elseif (is_string($service->images)) {
            // If it's a single image stored as string
            $service->images = [asset('storage/' . $service->images)];
        } else {
            $service->images = [];
        }
    
        return response()->json($service);
    }


    // public function store(Request $request, $id)
    // {
    //     // Validate input fields
    //     $validated = $request->validate([
    //         'name' => 'required|string',
    //         'description' => 'nullable|string',
    //         'base_price' => 'required|numeric',
    //         'service_categories_id' => 'required|exists:service_categories,id', // Validates against service_categories table
    //         'type_id' => 'required|exists:types,id', // Validates against types table
    //         'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048', // Adjusted for multiple images
    //     ]);
        
    //     // Handle image upload (supporting multiple images)
    //     if ($request->hasFile('images')) {
    //         $images = $request->file('images');
        
    //         // Ensure $images is always an array
    //         $images = is_array($images) ? $images : [$images];
        
    //         $imagePaths = [];
        
    //         foreach ($images as $image) {
    //             if ($image->isValid()) {
    //                 $imagePaths[] = $image->store('services', 'public');
    //             }
    //         }
        
    //         $validated['images'] = $imagePaths; // Don't encode to JSON here if you want array output
    //     }
        
    //     // Add the owner_id to the validated data
    //     $validated['owner_id'] = $id;
        
    //     // Create the service record in the database
    //     $service = Service::create($validated);

        
    
    //     // Return the created service as a response
    //     return response()->json($service, 201);
    // }
    

    

    public function store(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric',
            'service_categories_id' => 'required|exists:service_categories,id',
            'type_id' => 'required|exists:types,id',
            'images' => 'nullable',
            'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
        ]);
    
        $images = $request->file('images');
    
        if ($images && !is_array($images)) {
            $images = [$images];
        }
    
        $imagePaths = [];
    
        if ($images) {
            foreach ($images as $image) {
                if ($image->isValid()) {
                    $imagePaths[] = $image->store('services', 'public');
                }
            }
        }
    
        $validated['images'] = $imagePaths;
    
        $validated['owner_id'] = $id;
    
        $service = Service::create($validated);

        
    
        return response()->json($service, 201);
    }
    
    

    // public function update(Request $request, $id, $serviceId)
    // {
    //     $service = Service::find($serviceId);
    
    //     if (!$service) {
    //         return response()->json(['message' => 'Service not found'], 404);
    //     }
    
    //     // Ownership check
    //     if ($service->owner_id != $id) {
    //         return response()->json(['message' => 'Unauthorized.'], 403);
    //     }
    
    //     $validated = $request->validate([
    //         'name' => 'sometimes|string',
    //         'description' => 'nullable|string',
    //         'base_price' => 'sometimes|numeric',
    //         'service_categories_id' => 'sometimes|exists:service_categories,id',
    //         'type_id' => 'sometimes|exists:types,id',
    //         'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    //     ]);
    
    //     // Retrieve existing images or initialize as an empty array
    //     $existingImages = is_array($service->images) ? $service->images : [];
    
    //     // Handle new image uploads
    //     if ($request->hasFile('images')) {
    //         // Delete old images from storage (if any)
    //         foreach ($existingImages as $oldImage) {
    //             if (is_string($oldImage) && Storage::disk('public')->exists($oldImage)) {
    //                 Storage::disk('public')->delete($oldImage);
    //             }
    //         }
    
    //         // Store new images
    //         $newImages = $request->file('images');
    //         $newImages = is_array($newImages) ? $newImages : [$newImages]; // Ensure $newImages is an array
    
    //         $newImagesPaths = [];
    //         foreach ($newImages as $image) {
    //             if ($image->isValid()) {
    //                 $path = $image->store('services', 'public');
    //                 $newImagesPaths[] = $path; // Store only the paths of the new images
    //             }
    //         }
    
    //         // Replace the existing images with the new ones
    //         $validated['images'] = $newImagesPaths;
    //     } else {
    //         // If no new images are uploaded, retain the existing images
    //         $validated['images'] = $existingImages;
    //     }
    
    //     // Update the service with the validated data
    //     $service->update($validated);
    
    //     // Reload relationships and return the updated service
    //     $service->load(['category', 'type', 'owner']);
    
    //     return response()->json($service);
    // }

    

    public function update(Request $request, $id, $serviceId)
    {
        $service = Service::find($serviceId);
    
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }
    
        // Optional: check ownership
        if ($service->owner_id != $id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
    
        $validated = $request->validate([
            'name' => 'sometimes|string',
            'description' => 'nullable|string',
            'base_price' => 'sometimes|numeric',
            'service_categories_id' => 'sometimes|exists:service_categories,id',
            'type_id' => 'sometimes|exists:types,id',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);
    
        $existingImages = $service->images ?? [];
    
        if ($request->hasFile('images')) {
            $newImages = $request->file('images');
            $newImages = is_array($newImages) ? $newImages : [$newImages];
    
            foreach ($newImages as $image) {
                if ($image->isValid()) {
                    $path = $image->store('services', 'public');
                    $existingImages[] = $path;
                }
            }
        }
    
        $validated['images'] = $existingImages;
    
        $service->update($validated);

        $service->load(['category', 'type', 'owner']);

        return response()->json($service);
    }



    public function deleteImage(Request $request, $serviceId)
    {
        $service = Service::find($serviceId);
    
        if (!$service) {
            return response()->json(['message' => 'Service not found'], 404);
        }
    
        // Validate input
        $request->validate([
            'image_path' => 'required|string',
        ]);
    
        $inputPath = $request->input('image_path');
    
        // Convert full URL to relative path if needed
        $parsedPath = str_replace(url('/storage/') . '/', '', $inputPath);
        $parsedPath = str_replace(url('/storage'), '', $parsedPath); // handle case without trailing slash
    
        // Check if the image exists in the service images
        $existingImages = $service->images ?? [];
    
        if (!in_array($parsedPath, $existingImages)) {
            return response()->json(['message' => 'Image not found in service'], 404);
        }
    
        // Delete the file from storage if it exists
        if (Storage::disk('public')->exists($parsedPath)) {
            Storage::disk('public')->delete($parsedPath);
        }
    
        // Remove the image path from the array
        $updatedImages = array_filter($existingImages, fn($img) => $img !== $parsedPath);
        $updatedImages = array_values($updatedImages);
    
        $service->images = $updatedImages;
        $service->save();
    
        return response()->json(['message' => 'Image deleted successfully', 'images' => $updatedImages]);
    }
    

    public function destroy($id, $serviceId)
    {
        $service = Service::where('id', $serviceId)
            ->where('owner_id', $id)
            ->first();
    
        if (!$service) {
            return response()->json(['message' => 'Service not found or access denied'], 404);
        }
    
        $service->delete();
    
        return response()->json(['message' => 'Deleted successfully']);
    }
    
}
