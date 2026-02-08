<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'division_id',
        'image',
        'name',
        'phone',
        'position',
    ];

    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }
}
