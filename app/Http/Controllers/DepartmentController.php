<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;

class DepartmentController extends Controller
{
    public function index(Request $request)
    {
        $type = $request->query('type'); // 'internal' or 'external'
        $query = Department::query();

        if ($type) {
            $query->where('type', $type);
        }

        return response()->json($query->orderBy('name')->pluck('name'));
    }

    public function show($type)
    {
        $internal = [
            "Basic Ed - Primary",
            "Basic Ed - Intermediate",
            "Basic Ed - Homeschool",
            "Basic Ed - Junior High School",
            "Basic Ed - English Department",
            "Basic Ed - AP Department",
            "Basic Ed - Math Department",
            "Basic Ed - MAPEH Department",
            "Basic Ed - Social Science Department",
            "Basic Ed - Senior High School - ABM",
            "Basic Ed - Senior High School - STEM",
            "Basic Ed - Senior High School - GAS",
            "Basic Ed - Senior High School - ICT",
            "Basic Ed - Senior High School - Culinary",
            "Academics, GMRC",
            "Higher Ed - BS in Information Systems",
            "Higher Ed - Associate in Computer Technology",
            "Higher Ed - BS in Accountancy",
            "Higher Ed - BS in Accounting Information Systems",
            "Higher Ed - BS in Social Work",
            "Organization - Association of ICT Majors (AIM)",
            "Organization - Junior Philippine Institute of Accountants (JPIA)",
            "Organization - Junior Social Workers' Association of the Philippines (JSWAP)",
            "Organization - Broadcasting Students Society (BSS)",
            "Organization - Supreme Student Government (SSG)",
            "Organization - LV Dance Troupe",
            "Registrar Office",
            "Communications Office",
            "Human Resource Department (HR)",
            "Guidance Office",
            "Prefect Student Affairs and Services (PSAS)",
            "General Services Department (GSD) - Safety & Security",
            "Data Privacy Office (DPO)",
            "Student Publication Office",
            "Others:",
        ];

        $external = [
            "MCGI Music Ministry",
            "MCGI Teatro Kristiano",
            "MCGI Orchestra",
            "MMC Events Committee",
            "Disaster Response and Rescue Team (DRRT)",
            "Others",
        ];

        if ($type === 'internal') {
            return response()->json($internal);
        } elseif ($type === 'external') {
            return response()->json($external);
        } else {
            return response()->json([]);
        }
    }
}
