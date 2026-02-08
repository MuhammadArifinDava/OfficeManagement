<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Support\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string'],
            'division_id' => ['nullable', 'uuid'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $employeesQuery = Employee::query()
            ->with(['division:id,name'])
            ->orderByDesc('created_at');

        if (! empty($validated['name'])) {
            $employeesQuery->where('name', 'like', '%'.$validated['name'].'%');
        }

        if (! empty($validated['division_id'])) {
            $employeesQuery->where('division_id', $validated['division_id']);
        }

        $paginator = $employeesQuery->paginate($validated['per_page'] ?? 10);

        $employees = collect($paginator->items())->map(function (Employee $employee) {
            return [
                'id' => $employee->id,
                'image' => $employee->image && str_starts_with($employee->image, 'http') 
                    ? $employee->image 
                    : ($employee->image ? url(Storage::disk('public')->url($employee->image)) : null),
                'name' => $employee->name,
                'phone' => $employee->phone,
                'division' => $employee->division
                    ? ['id' => $employee->division->id, 'name' => $employee->division->name]
                    : null,
                'position' => $employee->position,
            ];
        })->values();

        return ApiResponse::success('Berhasil mengambil data karyawan', [
            'employees' => $employees,
        ], 200, ApiResponse::pagination($paginator));
    }

    public function show(Employee $employee)
    {
        $employee->loadMissing(['division:id,name']);

        return ApiResponse::success('Berhasil mengambil detail karyawan', [
            'employee' => [
                'id' => $employee->id,
                'image' => $employee->image && str_starts_with($employee->image, 'http') 
                    ? $employee->image 
                    : ($employee->image ? url(Storage::disk('public')->url($employee->image)) : null),
                'name' => $employee->name,
                'phone' => $employee->phone,
                'division' => $employee->division
                    ? ['id' => $employee->division->id, 'name' => $employee->division->name]
                    : null,
                'position' => $employee->position,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'image' => ['required', 'file', 'image', 'max:5120'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'division' => ['required', 'uuid', 'exists:divisions,id'],
            'position' => ['required', 'string', 'max:255'],
        ]);

        $imagePath = $request->file('image')->store('employees', 'public');

        Employee::query()->create([
            'division_id' => $validated['division'],
            'image' => $imagePath,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'position' => $validated['position'],
        ]);

        return ApiResponse::success('Berhasil menambahkan karyawan', [], 201);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'image' => ['nullable', 'file', 'image', 'max:5120'],
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:30'],
            'division' => ['required', 'uuid', 'exists:divisions,id'],
            'position' => ['required', 'string', 'max:255'],
        ]);

        if ($request->hasFile('image')) {
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }

            $employee->image = $request->file('image')->store('employees', 'public');
        }

        $employee->fill([
            'division_id' => $validated['division'],
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'position' => $validated['position'],
        ]);
        $employee->save();

        return ApiResponse::success('Berhasil memperbarui karyawan');
    }

    public function destroy($id)
    {
        $employee = Employee::find($id);

        if ($employee) {
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }
            $employee->delete();
        }

        return ApiResponse::success('Berhasil menghapus karyawan');
    }

    public function export()
    {
        $employees = Employee::with(['division:id,name'])->orderByDesc('created_at')->get();

        $csvHeader = ['ID', 'Name', 'Division', 'Position', 'Phone', 'Image URL'];
        $csvData = $employees->map(function ($employee) {
            return [
                $employee->id,
                $employee->name,
                $employee->division ? $employee->division->name : '-',
                $employee->position,
                $employee->phone,
                $employee->image ? url(Storage::disk('public')->url($employee->image)) : '-',
            ];
        });

        $callback = function () use ($csvHeader, $csvData) {
            $file = fopen('php://output', 'w');
            fputcsv($file, $csvHeader);
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="employees_export_'.date('Y-m-d_H-i-s').'.csv"',
        ]);
    }

    public function bulkDestroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['uuid', 'exists:employees,id'],
        ]);

        $employees = Employee::whereIn('id', $validated['ids'])->get();
        $count = 0;

        foreach ($employees as $employee) {
            if ($employee->image) {
                Storage::disk('public')->delete($employee->image);
            }
            $employee->delete();
            $count++;
        }

        return ApiResponse::success("Berhasil menghapus $count karyawan");
    }
}

