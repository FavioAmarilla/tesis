<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

use Grimzy\LaravelMysqlSpatial\Types\Polygon;
use Grimzy\LaravelMysqlSpatial\Types\Point;

class CreateGeoCiudadCoordTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('geo_ciudad_coord', function (Blueprint $table) {

            $table->bigIncrements('identificador');
            $table->unsignedBigInteger('id_ciudad');
            $table->polygon('poligono')->nullable()->default(NULL);;
            $table->point('marcador')->nullable()->default(NULL);
            $table->timestamps();

            $table->foreign('id_ciudad')->references('identificador')->on('geo_ciudades');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('geo_ciudad_coord');
    }
}