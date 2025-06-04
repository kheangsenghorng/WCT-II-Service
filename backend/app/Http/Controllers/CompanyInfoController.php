<?php

namespace App\Http\Controllers;

use App\Models\CompanyInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyInfoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    // Create or update company info

    
    // public function store(Request $request, $id)
    // {
    //     $validated = $request->validate([
    //         'company_name'   => 'nullable|string|max:255',
    //         'description'    => 'nullable|string',
    //         'website_url'    => 'nullable|url|max:255',
    //         'business_hours' => 'nullable|string|max:255',
    //         'address'        => 'nullable|string|max:255',
    //         'city'           => 'nullable|string|max:255',
    //         'country'        => 'nullable|string|max:255',
    //         'facebook_url'   => 'nullable|url|max:255',
    //         'instagram_url'  => 'nullable|url|max:255',
    //         'twitter_url'    => 'nullable|url|max:255',
    //         'linkedin_url'   => 'nullable|url|max:255',
    //         // 'services'       => 'nullable|string|max:1000',
    //         // 'image'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
    //     ]);
    
    //     $validated['user_id'] = $id;
    
    //     // if ($request->hasFile('image')) {
    //     //     $path = $request->file('image')->store('company_images', 'public');
    //     //     $validated['image'] = $path;
    //     // }
    
    //     $company = CompanyInfo::updateOrCreate(
    //         ['user_id' => $id],
    //         $validated
    //     );
    
    //     $company->load('user');
    
    //     return response()->json([
    //         'message' => 'Company info saved successfully.',
    //         'data' => $company,
    //     ], 201);
    // }
    

    /**
     * Display the specified resource.
     */

     public function store(Request $request, $id)
{
    // Define all fields
    $fields = [
        'company_name', 'description', 'website_url', 'business_hours',
        'address', 'city', 'country',
        'facebook_url', 'instagram_url', 'twitter_url', 'linkedin_url',
    ];

    // Set defaults to null if not present
    $data = [];
    foreach ($fields as $field) {
        $data[$field] = $request->has($field) ? $request->input($field) : null;
    }

    // Optionally validate (you can skip validation if you're accepting nulls)
    $validated = validator($data, [
        'company_name'   => 'nullable|string|max:255',
        'description'    => 'nullable|string',
        'website_url'    => 'nullable|url|max:255',
        'business_hours' => 'nullable|string|max:255',
        'address'        => 'nullable|string|max:255',
        'city'           => 'nullable|string|max:255',
        'country'        => 'nullable|string|max:255',
        'facebook_url'   => 'nullable|url|max:255',
        'instagram_url'  => 'nullable|url|max:255',
        'twitter_url'    => 'nullable|url|max:255',
        'linkedin_url'   => 'nullable|url|max:255',
    ])->validate();

    $validated['user_id'] = $id;

    // Optional image handling
    // if ($request->hasFile('image')) {
    //     $path = $request->file('image')->store('avatars', 'public');
    //     $validated['image'] = $path;
    // }

    $company = CompanyInfo::updateOrCreate(
        ['user_id' => $id],
        $validated
    );

    return response()->json([
        'message' => 'Company info saved.',
        'data' => $company,
    ]);
}

    public function show($id)
    {
        $company = CompanyInfo::where('user_id', $id)->with('user')->first();
    
        if (!$company) {
            return response()->json(['message' => 'Company info not found.']);
        }
    
        return response()->json([
            'message' => 'Company info retrieved successfully.',
            'company' => $company, // ✅ change this key to "company"
        ], 200);
    }
    
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $userId)
    {
        $validated = $request->validate([
            'company_name'   => 'nullable|string|max:255',
            'description'    => 'nullable|string',
            'website_url'    => 'nullable|url|max:255',
            'business_hours' => 'nullable|string|max:255',
            'address'        => 'nullable|string|max:255',
            'city'           => 'nullable|string|max:255',
            'country'        => 'nullable|string|max:255',
            'facebook_url'   => 'nullable|url|max:255',
            'instagram_url'  => 'nullable|url|max:255',
            'twitter_url'    => 'nullable|url|max:255',
            'linkedin_url'   => 'nullable|url|max:255',
        ]);

        // Find the company info based on the user_id
        $companyInfo = CompanyInfo::where('user_id', $userId)->firstOrFail();

        // Update the company info
        $companyInfo->update($validated);

        $companyInfo->load('user');

        return response()->json([
            'message' => 'Company info updated successfully.',
            'data' => $companyInfo,
        ], 200);
    }           

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($userId)
    {
        // Find the company info by user_id
        $companyInfo = CompanyInfo::where('user_id', $userId)->firstOrFail();
    
        // Delete the company info record
        $companyInfo->delete();
    
        return response()->json([
            'message' => 'Company info deleted successfully.',
        ], 200);
    }
}
