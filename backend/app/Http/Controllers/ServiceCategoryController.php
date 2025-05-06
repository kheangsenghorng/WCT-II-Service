<?php

namespace App\Http\Controllers;
use App\Models\ServiceCategory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $categories = ServiceCategory::all()->map(function ($category) {
        $category->image = $category->image
            ? asset('storage/' . $category->image)
            : null;
        return $category;
    });

    return response()->json($categories);
}

 

    /**
     * Show the form for creating a new resource.
     */
    
     public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:service_categories,name',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('categories', 'public');
        }

        $category = ServiceCategory::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
            'image' => $imagePath,
        ]);

        return response()->json($category, 201);
    }


    /**
     * Display the specified resource.
     */
    public function show($slug)
    {
        $category = ServiceCategory::where('slug', $slug)->firstOrFail();
        return response()->json($category);
    }


    public function update(Request $request, $slug)
    {
        $category = ServiceCategory::where('slug', $slug)->firstOrFail();
    
        $request->validate([
            'name' => 'sometimes|required|string|unique:service_categories,name,' . $category->id,
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048', // Check these rules
        ]);
        
    
        $data = [];
    
        if ($request->has('name')) {
            $data['name'] = $request->name;
            $data['slug'] = Str::slug($request->name);
        }
    
        if ($request->has('description')) {
            $data['description'] = $request->description;
        }
    
        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
    
            // Store new image
            $data['image'] = $request->file('image')->store('categories', 'public');
        }
    
        $category->update($data);
    
        return response()->json($category);
    }

    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($slug)
    {
        $category = ServiceCategory::where('slug', $slug)->firstOrFail();
    
        // Delete image file if it exists
        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }
    
        $category->delete();
    
        return response()->json(['message' => 'Category deleted']);
    }
}
