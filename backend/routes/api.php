<?php

use App\Http\Controllers\Api\SeoSettingController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// rest routes

Route::get("role",function(Request $request){
   $pricr = 100;
   return [
     "price" => $pricr,
   ];
});

;
    