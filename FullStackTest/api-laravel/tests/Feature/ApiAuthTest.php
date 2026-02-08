<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_login_success_returns_token_and_admin(): void
    {
        $response = $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'pastibisa',
        ]);

        $response->assertOk();
        $response->assertJsonStructure([
            'status',
            'message',
            'data' => [
                'token',
                'admin' => ['id', 'name', 'username', 'phone', 'email'],
            ],
        ]);
    }

    public function test_login_is_rejected_when_already_authenticated(): void
    {
        $login = $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'pastibisa',
        ]);
        $token = $login->json('data.token');

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/login', [
                'username' => 'admin',
                'password' => 'pastibisa',
            ]);

        $response->assertStatus(403);
        $response->assertJson([
            'status' => 'error',
        ]);
    }

    public function test_divisions_requires_auth(): void
    {
        $this->getJson('/api/divisions')->assertStatus(401);

        $token = $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'pastibisa',
        ])->json('data.token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/divisions')
            ->assertOk()
            ->assertJsonStructure([
                'status',
                'message',
                'data' => ['divisions'],
                'pagination',
            ]);
    }

    public function test_employees_requires_auth(): void
    {
        $this->getJson('/api/employees')->assertStatus(401);

        $token = $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'pastibisa',
        ])->json('data.token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/employees')
            ->assertOk()
            ->assertJsonStructure([
                'status',
                'message',
                'data' => ['employees'],
                'pagination',
            ]);
    }

    public function test_me_can_be_fetched_and_updated(): void
    {
        $token = $this->postJson('/api/login', [
            'username' => 'admin',
            'password' => 'pastibisa',
        ])->json('data.token');

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/me')
            ->assertOk()
            ->assertJsonStructure([
                'status',
                'message',
                'data' => ['user' => ['id', 'name', 'username', 'phone', 'email']],
            ]);

        $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/me', ['name' => 'Admin Updated'])
            ->assertOk()
            ->assertJsonPath('data.user.name', 'Admin Updated');
    }
}

