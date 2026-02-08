<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin',
                'username' => 'admin',
                'phone' => '08123456789',
                'email' => 'admin@example.com',
                'password' => Hash::make('pastibisa'),
            ],
        );
    }
}
