<?php

namespace App\Observers;

use App\Models\ActivityLog;
use App\Models\Employee;

class EmployeeObserver
{
    /**
     * Handle the Employee "created" event.
     */
    public function created(Employee $employee): void
    {
        ActivityLog::create([
            'description' => "New employee {$employee->name} joined",
            'event' => 'created',
            'subject_type' => Employee::class,
            'subject_id' => $employee->id,
        ]);
    }

    /**
     * Handle the Employee "updated" event.
     */
    public function updated(Employee $employee): void
    {
        ActivityLog::create([
            'description' => "Employee {$employee->name} details updated",
            'event' => 'updated',
            'subject_type' => Employee::class,
            'subject_id' => $employee->id,
        ]);
    }

    /**
     * Handle the Employee "deleted" event.
     */
    public function deleted(Employee $employee): void
    {
        ActivityLog::create([
            'description' => "Employee {$employee->name} was removed",
            'event' => 'deleted',
            'subject_type' => Employee::class,
            'subject_id' => $employee->id,
        ]);
    }
}
