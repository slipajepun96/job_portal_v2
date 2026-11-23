<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->json('ai_summary')->nullable();
            $table->string('ai_summary_status')->nullable(); // processing | done | failed
            $table->string('ai_summary_error', 500)->nullable();
            $table->timestamp('ai_summarized_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn(['ai_summary', 'ai_summary_status', 'ai_summary_error', 'ai_summarized_at']);
        });
    }
};
