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
            'description' => 'nullable|string',
            'website_url' => 'nullable|url|max:255',
            'business_hours' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
        ]);
    
        // Ensure the user_id is set based on the route parameter
        $validated['user_id'] = $id;
    
        // Save or update the record
        $company = CompanyInfo::updateOrCreate(
            ['user_id' => $id],
            $validated
        );
    
        // Load the related user
        $company->load('user');
    
        return response()->json([
            'message' => 'Company info saved successfully.',
            'data' => $company
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
     * Show the form for editing the specified resource.
     */
    public function edit(CompanyInfo $companyInfo)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CompanyInfo $companyInfo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CompanyInfo $companyInfo)
    {
        //
    }
}
