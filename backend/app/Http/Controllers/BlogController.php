<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use Illuminate\Support\Facades\Storage;

class BlogController extends Controller
{
    // List all blogs
public function store(Request $request)
{
    // Debug: dump all input and uploaded files, then stop execution
    dd($request->all(), $request->file('images'));

    // Validation
    $request->validate([
        'title' => 'required|string|max:255',
        'content' => 'required|string',
        'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        'admin_id' => 'nullable|exists:admins,id',
    ]);

    $imagePaths = [];

    if ($request->hasFile('images')) {
        foreach ($request->file('images') as $image) {
            // Store images in storage/app/public/blogs
            $path = $image->store('blogs', 'public');
            $imagePaths[] = $path;
        }
    }

    $blog = new Blog();
    $blog->title = $request->title;
    $blog->content = $request->content;
    $blog->admin_id = $request->admin_id ?? auth()->id();
    $blog->images = $imagePaths; // Assign array directly
    $blog->save();

    return response()->json($blog, 201);
}


    // Show single blog
    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        return response()->json($blog);
    }

    // List all blogs
    public function index()
    {
        $blogs = Blog::latest()->get();
        return response()->json($blogs);
    }

    // Update blog
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'images' => 'nullable|image|max:2048',
        ], [
            'title.required' => 'Title is required.',
            'content.required' => 'Content is required.',
            'images.image' => 'Uploaded file must be an image.',
        ]);
    
        $blog = Blog::findOrFail($id);
        $blog->title = $request->title;
        $blog->content = $request->content;
    
        if ($request->hasFile('images')) {
            // Delete old image if exists
            if ($blog->images) {
                $oldPath = str_replace('/storage/', '', $blog->images);
                Storage::disk('public')->delete($oldPath);
            }
    
            $path = $request->file('images')->store('blogs', 'public');
            $blog->images = Storage::url($path);
        }
    
        $blog->save();
    
        return response()->json($blog);
    }
    
    

    // Delete blog
    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        if ($blog->images) {
            $oldPath = str_replace('/storage/', '', $blog->images);
            Storage::disk('public')->delete($oldPath);
        }

        $blog->delete();

        return response()->json(['message' => 'Blog deleted successfully']);
    }
}
