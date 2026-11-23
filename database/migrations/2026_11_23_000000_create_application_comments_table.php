<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('application_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('application_id')->constrained('applications')->cascadeOnDelete();
            // users.id has no unique key in this schema, so no FK constraint here.
            $table->uuid('user_id')->nullable()->index();
            $table->text('comment');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('application_comments');
    }
};
