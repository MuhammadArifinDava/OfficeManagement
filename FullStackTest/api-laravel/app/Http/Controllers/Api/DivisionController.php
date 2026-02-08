<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class DivisionController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'name' => ['nullable', 'string'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $divisionsQuery = Division::query()->select(['id', 'name'])->orderBy('name');

        if (! empty($validated['name'])) {
            $divisionsQuery->where('name', 'like', '%'.$validated['name'].'%');
        }

        $paginator = $divisionsQuery->paginate($validated['per_page'] ?? 10);

        return ApiResponse::success('Berhasil mengambil data divisi', [
            'divisions' => $paginator->items(),
        ], 200, ApiResponse::pagination($paginator));
    }

    public function show(Division $division)
    {
        return ApiResponse::success('Berhasil mengambil detail divisi', [
            'division' => [
                'id' => $division->id,
                'name' => $division->name,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $division = Division::query()->create($validated);

        return ApiResponse::success('Berhasil menambahkan divisi', [
            'division' => [
                'id' => $division->id,
                'name' => $division->name,
            ],
        ], 201);
    }

    public function update(Request $request, Division $division)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $division->update($validated);

        return ApiResponse::success('Berhasil memperbarui divisi', [
            'division' => [
                'id' => $division->id,
                'name' => $division->name,
            ],
        ]);
    }

    public function destroy($id)
    {
        $division = Division::find($id);

        if ($division) {
            $division->delete();
        }

        return ApiResponse::success('Berhasil menghapus divisi');
    }
}

