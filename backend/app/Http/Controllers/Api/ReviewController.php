<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReviewController extends Controller
{
    public function index($culinary_id)
    {
        $reviews = Review::with('user')
            ->where('culinary_id', $culinary_id)
            ->where('status', 'approved')
            ->latest()
            ->get();
        return response()->json(['success' => true, 'data' => $reviews]);
    }

    public function adminIndex()
    {
        $reviews = Review::with(['user', 'culinary'])->latest()->get();
        return response()->json(['success' => true, 'data' => $reviews]);
    }

    public function store(Request $request)
    {
        // PERBAIKAN VALIDASI: Memberikan pesan detail
        $validator = Validator::make($request->all(), [
            'culinary_id' => 'required|exists:culinaries,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:5',
        ], [
            'culinary_id.exists' => 'ID Kuliner tidak valid atau sudah dihapus.',
            'comment.min' => 'Komentar minimal 5 karakter.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(), // Ambil satu error pertama
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $review = Review::create([
                'user_id' => $request->user()->id,
                'culinary_id' => $request->culinary_id,
                'rating' => $request->rating,
                'comment' => $request->comment,
                'status' => 'pending', 
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Ulasan Terkirim, dalam tinjauan admin.'
            ], 201);
        } catch (\Exception $e) {
            return response()->json(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()], 500);
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $review = Review::findOrFail($id);
        $review->update(['status' => $request->status]);
        return response()->json(['success' => true]);
    }
}