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
        // Validation
        $validator = Validator::make($request->all(), [
            'title'   => 'required|string|max:255',
            'content' => 'required|string',
            'images'  => 'array',
            'images.*' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'admin_id' => 'nullable|exists:admins,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $validated = $validator->validated();

        $imagePaths = [];

        if ($request->hasFile('images')) {
            $images = $request->file('images');
            if (is_array($images)) {
                foreach ($images as $image) {
                    $path = $image->store('blogs', 'public');
                    $imagePaths[] = $path;
                }
            }
        }

        $blog = new Blog();
        $blog->title = $validated['title'];
        $blog->content = $validated['content'];
        $blog->admin_id = $validated['admin_id'] ?? auth()->id();
        $blog->images = $imagePaths;
        $blog->save();

        $blog->images = $blog->getImagesAttribute($blog->images); //Access to your images path getter to return path.

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

    public function update(Request $request, $id)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'images' => 'nullable|image|max:2048',
            ]);
    
            $blog = Blog::findOrFail($id);
            $blog->title = $request->title;
            $blog->content = $request->content;
    
            if ($request->hasFile('images')) {
                if ($blog->images) {
                    $oldPath = str_replace('/storage/', '', $blog->images);
                    if (Storage::disk('public')->exists($oldPath)) {
                        Storage::disk('public')->delete($oldPath);
                    }
                }
    
                $path = $request->file('images')->store('blogs', 'public');
                $blog->images = Storage::url($path);
            }
    
            $blog->save();
    
            return response()->json($blog);
        } catch (\Exception $e) {
            \Log::error('Blog update error: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to update blog'], 500);
        }
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
