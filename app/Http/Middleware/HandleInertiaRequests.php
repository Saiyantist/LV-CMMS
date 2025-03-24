<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */


//     public function share(Request $request): array
//     {
//         return [
//             ...parent::share($request),
//             'auth' => [
//                 'user' => $request->user(),
//             ],
//         ];
//     }
// }

public function share(Request $request): array
{
    return [
        ...parent::share($request),
        'auth' => [
            'user' => $request->user() ? [
                'id' => $request->user()->id,
                'first_name' => $request->user()->first_name,
                'last_name' => $request->user()->last_name,
                'contact_number' => $request->user()->contact_number,
                'birth_date' => $request->user()->birth_date,
                'gender' => $request->user()->gender,
                'staff_type' => $request->user()->staff_type,
                'email' => $request->user()->email,
                'profile_photo_url' => $request->user()->profile_photo_url,
            ] : null,
        ],
    ];
}
}
