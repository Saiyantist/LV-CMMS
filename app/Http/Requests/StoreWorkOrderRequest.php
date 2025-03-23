<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWorkOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->can('request work orders');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'report_description' => 'required|string|max:1000',
            'location_id' => 'required|exists:locations,id',
            'images' => 'nullable|array', // Accept multiple images
            'images.*' => 'image|mimes:jpg,jpeg,png|max:1024', // Validate each image
        ];
    }
}
