<?php

namespace App\Support;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    public static function success(string $message, array $data = [], int $statusCode = 200, ?array $pagination = null): JsonResponse
    {
        $payload = [
            'status' => 'success',
            'message' => $message,
            'data' => $data,
        ];

        if (! is_null($pagination)) {
            $payload['pagination'] = $pagination;
        }

        return response()->json($payload, $statusCode);
    }

    public static function error(string $message, int $statusCode = 400, array $errors = []): JsonResponse
    {
        $payload = [
            'status' => 'error',
            'message' => $message,
        ];

        if (! empty($errors)) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $statusCode);
    }

    public static function pagination(LengthAwarePaginator $paginator): array
    {
        return [
            'total' => $paginator->total(),
            'per_page' => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ];
    }
}

