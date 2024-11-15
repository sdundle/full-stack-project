<?php

namespace Database\Seeders;

use App\Models\DataSource;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        /* User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]); */

        DataSource::factory()->count(1)->create([
            'api_data_source_name' => 'New York Times',
            'api_data_source_key_url' => env('REACT_APP_NYTIMES_API_KEY'),
        ]);

        DataSource::factory()->count(1)->create([
            'api_data_source_name' => 'News API ORG',
            'api_data_source_key_url' => env('REACT_APP_NEWSAPIORG_API_KEY'),
        ]);

        DataSource::factory()->count(1)->create([
            'api_data_source_name' => 'The Guardian',
            'api_data_source_key_url' => env('REACT_APP_THE_GUARDIAN_API_KEY'),
        ]);
    }
}
