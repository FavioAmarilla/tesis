<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEcParamCiudadesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ec_param_ciudades', function (Blueprint $table) {

            $table->bigIncrements('identificador');
            $table->unsignedBigInteger('id_ec_parametro');
            $table->unsignedBigInteger('id_ciudad');
            $table->string('activo', 2);
            $table->timestamps();
            
            $table->foreign('id_ec_parametro')->references('identificador')->on('ec_parametros');
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
        Schema::dropIfExists('ec_param_ciudades');
    }
}