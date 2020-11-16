<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVtaPuntosEmisionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vta_puntos_emision', function (Blueprint $table) {

            $table->increments('identificador');
            $table->integer('id_sucursal', 11);
            $table->string('nombre', 60);
            $table->string('codigo', 3);
            $table->string('vr_tipo', 2);
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
        Schema::dropIfExists('vta_puntos_emision');
    }
}