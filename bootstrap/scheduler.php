<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('preventive-maintenance:scheduler')->dailyAt('00:05');
