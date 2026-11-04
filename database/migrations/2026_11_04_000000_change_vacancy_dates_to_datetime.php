<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Existing rows only have a date; open them at the start of the first day
        // and keep them open until the end of the last day.
        DB::table('vacancies')->whereRaw('LENGTH(start_date) = 10')
            ->update(['start_date' => DB::raw("CONCAT(start_date, ' 00:00:00')")]);
        DB::table('vacancies')->whereRaw('LENGTH(end_date) = 10')
            ->update(['end_date' => DB::raw("CONCAT(end_date, ' 23:59:59')")]);

        Schema::table('vacancies', function (Blueprint $table) {
            $table->dateTime('start_date')->change();
            $table->dateTime('end_date')->change();
        });
    }

    public function down(): void
    {
        Schema::table('vacancies', function (Blueprint $table) {
            $table->string('start_date')->change();
            $table->string('end_date')->change();
        });
    }
};
