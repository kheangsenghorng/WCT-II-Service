<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    // GET /api/blogs
    public function index()
    {
        $blogs = Blog::latest()->get()->map(function ($blog) {
            $blog->image_url = $blog->image ? asset('storage/' . $blog->image) : null;
            return $blog;
        });

        return response()->json($blogs);
    }

    // GET /api/blogs/{id}
    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->image_url = $blog->image ? asset('storage/' . $blog->image) : null;

        return response()->json($blog);
    }

    // POST /api/blogs/admin/{id}
    public function store(Request $request, $id)
    {
        // Look for user with admin role
        $admin = User::find($id);
        if (!$admin) {
            return response()->json(['error' => 'Admin not found.'], 404);
        }

        $validated = $request->validate([
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'image'   => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('blogs', 'public');
        }

        $blog = Blog::create([
            'title'    => $validated['title'],
            'content'  => $validated['content'],
            'admin_id' => $admin->id,
            'image'    => $imagePath,
        ]);

        // Add full image URL to response
        // $blog->image_url = $imagePath ? asset('storage/' . $imagePath) : null;

        return response()->json($blog, 201);
    }

    // PUT /api/blogs/{id}
    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);
    
        $validated = $request->validate([
            'title'    => 'sometimes|required|string|max:255',
            'content'  => 'sometimes|required|string',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'admin_id' => 'nullable|exists:users,id',
        ]);
    
        // Handle image update
        if ($request->hasFile('image')) {
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
            $blog->image = $request->file('image')->store('blogs', 'public'); // stores "blogs/filename.jpg"
        }
    
        // Update other fields
        if (isset($validated['title'])) {
            $blog->title = $validated['title'];
        }
        if (isset($validated['content'])) {
            $blog->content = $validated['content'];
        }
        if (isset($validated['admin_id'])) {
            $blog->admin_id = $validated['admin_id'];
        }
    
        $blog->save();
    
        // Do not add image_url — just return stored fields
        return response()->json($blog);
    }
   
    public function destroy($id)
    {
        $blog = Blog::find($id);
    
        if (!$blog) {
            return response()->json(['error' => 'Blog not found.'], 404);
        }
    
        try {
            // Delete image file if exists
            if ($blog->image) {
                Storage::disk('public')->delete($blog->image);
            }
    
            $blog->delete();
    
            return response()->json(['message' => 'Blog deleted successfully.'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete blog.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    
}
    
