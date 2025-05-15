<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('notifications', 'owners_id') && !Schema::hasColumn('notifications', 'owner_id')) {
            DB::statement("ALTER TABLE notifications CHANGE owners_id owner_id BIGINT UNSIGNED NULL");
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('notifications', 'owner_id') && !Schema::hasColumn('notifications', 'owners_id')) {
            DB::statement("ALTER TABLE notifications CHANGE owner_id owners_id BIGINT UNSIGNED NULL");
        }
    }
};
