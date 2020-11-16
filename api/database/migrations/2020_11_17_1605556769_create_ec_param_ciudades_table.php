<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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

            $table->increments('identificador');
            $table->integer('id_ec_parametro', 11);
            $table->integer('id_ciudad', 11);
            $table->string('activo', 2);
            $table->timestamps();

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