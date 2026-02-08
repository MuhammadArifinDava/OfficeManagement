<?php

namespace Database\Factories;

use App\Models\Division;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = \Faker\Factory::create('id_ID');
        $gender = $faker->randomElement(['men', 'women']);
        $id = $faker->numberBetween(1, 99);
        
        $division = Division::inRandomOrder()->first();
        
        $positions = [
            'Mobile Development' => ['Mobile Developer', 'iOS Developer', 'Android Developer', 'Lead Mobile Engineer', 'Flutter Engineer'],
            'Quality Assurance' => ['QA Engineer', 'Automation Tester', 'QA Lead', 'Manual Tester', 'Software Tester'],
            'Backend Engineering' => ['Backend Developer', 'Software Engineer', 'Senior Backend Engineer', 'Go Developer', 'PHP Developer', 'Java Developer'],
            'Frontend Engineering' => ['Frontend Developer', 'React Developer', 'Vue Developer', 'Senior Frontend Engineer', 'Web Developer'],
            'UI/UX Design' => ['UI/UX Designer', 'Product Designer', 'Visual Designer', 'UX Researcher', 'Interaction Designer'],
            'Product Management' => ['Product Manager', 'Associate Product Manager', 'Product Owner', 'Technical Product Manager'],
            'Human Resources' => ['HR Specialist', 'Recruiter', 'HR Manager', 'Talent Acquisition', 'People Operations'],
            'DevOps Infrastructure' => ['DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer', 'System Administrator', 'Platform Engineer'],
        ];

        $position = isset($positions[$division->name]) 
            ? $faker->randomElement($positions[$division->name])
            : $faker->jobTitle();

        return [
            'division_id' => $division?->id,
            'image' => "https://randomuser.me/api/portraits/{$gender}/{$id}.jpg",
            'name' => $faker->name(),
            'phone' => $faker->phoneNumber(),
            'position' => $position,
        ];
    }
}
