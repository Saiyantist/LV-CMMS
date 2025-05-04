<?php

namespace App\Http\Controllers;
use App\Models\Location;
use Illuminate\Http\Request;
use Inertia\Inertia;


class LocationController extends Controller
{
    public function index()
{
    $locations = Location::select('id', 'name')->get();

    return Inertia::render('SubmitWorkOrder', [
        'locations' => $locations
    ]);
}

public function create()
{
    $locations = Location::all(); // fetch all locations

    return Inertia::render('SubmitWorkOrder', [
        'locations' => $locations
    ]);
}

}
