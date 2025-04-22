<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SeoSetting;
use Illuminate\Http\Request;


class SeoSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(SeoSetting::all());
    }

    public function preview()
    {
        $seo = SeoSetting::first();
    
        if (!$seo) {
            return response()->json(['message' => 'SEO settings not found'], 404);
        }
    
        return response()->json([
            'title' => $seo->meta_title,
            'description' => $seo->meta_description,
            'image' => $seo->meta_image,
            'url' => url('/'),
            ''=> $seo->meta_keywords,
        ]);
    }
    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'page' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'keywords' => 'nullable|string',
        ]);

        $setting = SeoSetting::create($data);
        return response()->json($setting, 201);
    }

    /**
     * Display the specified resource.
     */  public function show($id)
    {
        $setting = SeoSetting::findOrFail($id);
        return response()->json($setting);
    }

    /**
     * Update the specified resource in storage.
     */
  
     public function update(Request $request, $id)
    {
        $setting = SeoSetting::findOrFail($id);

        $data = $request->validate([
            'page' => 'sometimes|string|max:255',
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'keywords' => 'nullable|string',
        ]);

        $setting->update($data);
        return response()->json($setting);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        SeoSetting::destroy($id);
        return response()->json(null, 
    
        204);
    }
}
