<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FeedSetting extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'api_data_source',
        'api_data_source_url',
        'category',
        'author',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
