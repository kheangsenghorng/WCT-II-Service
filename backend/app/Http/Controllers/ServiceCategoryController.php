<?php

namespace App\Http\Controllers;
use App\Models\ServiceCategory;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ServiceCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
     public function index()
     {
         $categories = ServiceCategory::all();
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
         ]);
 
         $category = ServiceCategory::create([
             'name' => $request->name,
             'slug' => Str::slug($request->name),
             'description' => $request->description,
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
            'description' => 'sometimes|nullable|string',
        ]);
    
        $data = [];
    
        if ($request->has('name')) {
            $data['name'] = $request->name;
            $data['slug'] = Str::slug($request->name);
        }
    
        if ($request->has('description')) {
            $data['description'] = $request->description;
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
        $category->delete();

        return response()->json(['message' => 'Category deleted']);
    }
}
