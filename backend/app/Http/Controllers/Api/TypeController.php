<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use App\Models\Type;
use Illuminate\Http\Request;

class TypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Type::with('serviceCategory')->get());
    }

    /**
     * Store a newly created resource in storage.
     */
   
public function store(Request $request)
{
    $validated = $request->validate([
        'service_categories_id' => 'nullable|exists:service_categories,id',
        'name' => 'required|string|max:255',
    ]);

    // Manually check if the category has services
    if (!empty($validated['service_categories_id'])) {
        $category = ServiceCategory::find($validated['service_categories_id']);

        if ($category->services_count === 0) {
            return response()->json([
                'message' => 'The selected category does not have any services.'
            ], 422);
        }
    }

    $type = Type::create($validated);
    return response()->json($type, 201);
}

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $types = Type::with('serviceCategory')
        ->where('service_categories_id', $id)
        ->get();

    return response()->json($types);
    }
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $type = Type::findOrFail($id);
        $type->update($validated);
        return response()->json($type);
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
