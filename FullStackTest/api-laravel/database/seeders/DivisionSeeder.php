<?php

namespace Database\Seeders;

use App\Models\Division;
use Illuminate\Database\Seeder;

class DivisionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $divisions = [
            'Mobile Development',
            'Quality Assurance',
            'Backend Engineering',
            'Frontend Engineering',
            'UI/UX Design',
            'Product Management',
            'Human Resources',
            'DevOps Infrastructure',
        ];

        foreach ($divisions as $name) {
            Division::query()->updateOrCreate(
                ['name' => $name],
                ['name' => $name],
            );
        }
    }
}
