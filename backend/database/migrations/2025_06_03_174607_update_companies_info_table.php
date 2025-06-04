<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('companies_info', function (Blueprint $table) {
            // Add company name after user_id
            $table->string('company_name')->nullable()->after('user_id');

            // Convert business_hours from text to a shorter string
            $table->string('business_hours', 100)->nullable()->change();

            // Add social media fields
            $table->string('facebook_url', 255)->nullable()->after('business_hours');
            $table->string('instagram_url', 255)->nullable();
            $table->string('twitter_url', 255)->nullable();
            $table->string('linkedin_url', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('companies_info', function (Blueprint $table) {
            // Drop added columns
            $table->dropColumn([
                'company_name',
                'facebook_url',
                'instagram_url',
                'twitter_url',
                'linkedin_url',
            ]);

            // Revert business_hours back to text
            $table->text('business_hours')->change();
        });
    }
};
