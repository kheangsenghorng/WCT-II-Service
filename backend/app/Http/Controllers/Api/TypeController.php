<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use App\Models\Type;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Type::with('serviceCategory')->get());
    }


    public function showcategoryId(Request $request)
    {
        $categoryId = $request->query('categoryId');
        $types = Type::where('service_categories_id', $categoryId)->get();
        return response()->json($types);
    }

    /**
     * Store a newly created resource in storage.
     */
   
// public function store(Request $request)
// {
//     $validated = $request->validate([
//         'service_categories_id' => 'nullable|exists:service_categories,id',
//         'name' => 'required|string|max:255',
//     ]);

//     // Manually check if the category has services
//     if (!empty($validated['service_categories_id'])) {
//         $category = ServiceCategory::find($validated['service_categories_id']);

//         if ($category->services_count === 0) {
//             return response()->json([
//                 'message' => 'The selected category does not have any services.'
//             ], 422);
//         }
//     }

//     $type = Type::create($validated);
//     return response()->json($type, 201);
// }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'service_categories_id' => 'nullable|exists:service_categories,id',
            'name' => 'required|string|max:255',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp,svg,ico|max:2048',
        ]);

        // Check if the selected category has services
        if (!empty($validated['service_categories_id'])) {
            $category = ServiceCategory::find($validated['service_categories_id']);

            if ($category->services_count === 0) {
                return response()->json([
                    'message' => 'The selected category does not have any services.'
                ], 422);
            }
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('types', 'public');
        }

        // Create the type
        $type = Type::create($validated);

        return response()->json([
            'message' => 'Type created successfully.',
            'data' => $type
        ], 201);
    }
    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $types = Type::with('serviceCategory')
            ->where('service_categories_id', $id)
            ->get();
    
        // Loop through the collection and add image_url explicitly if you want
        $types->each(function ($type) {
            // This calls the accessor and adds 'image_url' attribute manually
            $type->image_url = $type->getImageUrlAttribute();
        });
    
        return response()->json($types);
    }
    
    
    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'service_categories_id' => 'nullable|exists:service_categories,id',
            'name' => 'sometimes|string|max:255',
            'image' => 'nullable|file|mimes:jpg,jpeg,png,webp,svg,ico|max:2048',
        ]);
    
        // Check if a service category ID is provided and if it has services
        if (!empty($validated['service_categories_id'])) {
            $category = ServiceCategory::find($validated['service_categories_id']);
    
            if (!$category || $category->services_count === 0) {
                return response()->json([
                    'message' => 'The selected category does not have any services.'
                ], 422);
            }
        }
    
        $type = Type::findOrFail($id);
    
        // Handle image upload if exists
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($type->image) {
                Storage::disk('public')->delete($type->image);
            }
            // Store new image
            $validated['image'] = $request->file('image')->store('types', 'public');
        }
    
        $type->update($validated);
    
        return response()->json([
            'message' => 'Type updated successfully.',
            'data' => $type,
        ]);
    }
    
    


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $type = Type::findOrFail($id);
        $type->delete();

        return response()->json(['message' => 'Type deleted']);
    }
}
