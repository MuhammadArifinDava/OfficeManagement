<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Division;
use App\Models\Employee;
use App\Support\ApiResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $totalEmployees = Employee::count();
        $totalDivisions = Division::count();
        
        $employeesPerDivision = Division::withCount('employees')
            ->orderByDesc('employees_count')
            ->get()
            ->map(function ($division) {
                return [
                    'name' => $division->name,
                    'count' => $division->employees_count,
                ];
            });

        $recentActivities = ActivityLog::query()
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'description' => $log->description,
                    'event' => $log->event,
                    'created_at' => $log->created_at->diffForHumans(),
                ];
            });

        return ApiResponse::success('Dashboard data retrieved successfully', [
            'stats' => [
                'total_employees' => $totalEmployees,
                'total_divisions' => $totalDivisions,
            ],
            'chart_data' => $employeesPerDivision,
            'activities' => $recentActivities,
        ]);
    }
}
