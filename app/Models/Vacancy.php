<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;

class Vacancy extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    protected $keyType = 'string'; // Set the key type to UUID
    public $incrementing = false; // Disable auto-incrementing

    public static function booted()
    {
        static::creating(function($model)
        {
            $model->id = Str::uuid();
        });
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'vacancies_title',
        'vacancies_location',
        'vacancies_description',
        'start_date',
        'end_date',
        'ads_link',
        'ads_pdf',
        'ai_summary',
        'ai_summary_status',
        'ai_summary_error',
        'ai_summarized_at',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
            'ai_summary' => 'array',
            'ai_summarized_at' => 'datetime',
        ];
    }

    /**
     * Vacancies that are currently accepting applications.
     */
    public function scopeOpen($query)
    {
        return $query->where('start_date', '<=', now())->where('end_date', '>=', now());
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        // AI summary contains applicant names; only shown on the recruiter page.
        'ai_summary',
        'ai_summary_status',
        'ai_summary_error',
        'ai_summarized_at',
    ];    

    // public function roles(): BelongsToMany
    // {
    //     return $this->belongsToMany(Role::class);
    // }
}
