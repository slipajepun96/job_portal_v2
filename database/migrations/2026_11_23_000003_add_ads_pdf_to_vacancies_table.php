<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->string('ads_pdf')->nullable();
            // A vacancy now needs either a link or an uploaded PDF.
            $table->string('ads_link')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->dropColumn('ads_pdf');
            $table->string('ads_link')->nullable(false)->change();
        });
    }
};
