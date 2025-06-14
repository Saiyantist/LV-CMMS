<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    public function destroy($id)
    {
        try {
            $attachment = Attachment::findOrFail($id);
            
            // Delete the file from storage
            if (Storage::exists($attachment->path)) {
                Storage::delete($attachment->path);
            }
            
            // Delete the attachment record
            $attachment->delete();
            
            return response()->json(['message' => 'Attachment deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete attachment'], 500);
        }
    }
} 