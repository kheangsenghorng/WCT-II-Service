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

    
    public function store(Request $request, $id)
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
    
        $validated['user_id'] = $id;
    
        $company = CompanyInfo::updateOrCreate(
            ['user_id' => $id],
            $validated
        );
    
        $company->load('user');
    
        return response()->json([
            'message' => 'Company info saved successfully.',
            'data' => $company,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $company = CompanyInfo::where('user_id', Auth::id())->first();

        if (!$company) {
            return response()->json(['message' => 'Company info not found.'], 404);
        }

        return response()->json($company);
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
