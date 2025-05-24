<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Blog;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class BlogController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'    => 'required|string|max:255',
            'content'  => 'required|string',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'admin_id' => 'nullable|exists:admins,id',
        ]);
    
        $imagePath = null;
    
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('blogs', 'public'); // saves like blogs/filename.jpg
        }
    
        $blog = new Blog();
        $blog->title = $validated['title'];
        $blog->content = $validated['content'];
        $blog->admin_id = $validated['admin_id'] ?? auth()->id();
        $blog->image = $imagePath; // saved as blogs/filename.jpg
        $blog->save();
    
        return response()->json($blog, 201);
    }
    
    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        return response()->json($blog);
    }
    
    public function index()
    {
        $blogs = Blog::latest()->get();
        return response()->json($blogs);
    }
    

    public function update(Request $request, $id)
    {
        $blog = Blog::findOrFail($id);
    
        $validated = $request->validate([
            'title'    => 'sometimes|required|string|max:255',
            'content'  => 'sometimes|required|string',
            'image'    => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'admin_id' => 'nullable|exists:admins,id',
        ]);
    
        if ($request->hasFile('image')) {
            // Optionally delete the old image
            if ($blog->image) {
                $oldPath = str_replace(url('storage/') . '/', '', $blog->image);
                Storage::disk('public')->delete($oldPath);
            }
    
            // Store the new image
            $newImagePath = $request->file('image')->store('blogs', 'public');
            $blog->image = $newImagePath;
        }
    
        // Update other fields if present
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
    
        return response()->json($blog);
    }
    

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);

        if (is_array($blog->image)) {
            foreach ($blog->image as $img) {
                Storage::disk('public')->delete($img);
            }
        }

        $blog->delete();

        return response()->json(['message' => 'Blog deleted successfully']);
    }
}
