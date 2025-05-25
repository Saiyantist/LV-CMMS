<?php

namespace App\Http\Controllers;

use App\Models\AssetMaintenanceHistory;
use Illuminate\Http\Request;
use App\Models\Asset;
use Inertia\Inertia;


class AssetMaintenanceHistoryController extends Controller
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
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($assetId)
{
    $history = AssetMaintenanceHistory::with('workOrder')
        ->where('asset_id', $assetId)
        ->orderByDesc('maintained_at')
        ->get();

    return response()->json($history);
}


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AssetMaintenanceHistory $assetMaintenanceHistory)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AssetMaintenanceHistory $assetMaintenanceHistory)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AssetMaintenanceHistory $assetMaintenanceHistory)
    {
        //
    }
}
