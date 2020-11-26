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

            $table->bigIncrements('identificador');
            $table->unsignedBigInteger('id_sucursal');
            $table->string('nombre', 60);
            $table->string('codigo', 3);
            $table->string('vr_tipo', 2);
            $table->timestamps();

            $table->foreign('id_sucursal')->references('identificador')->on('fnd_sucursales');

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