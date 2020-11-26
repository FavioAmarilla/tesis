<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVtaAsignacionCompTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vta_asignacion_comp', function (Blueprint $table) {

            $table->bigIncrements('identificador');
            $table->unsignedBigInteger('id_timbrado');
            $table->unsignedBigInteger('id_punto_emision');
            $table->integer('ult_usado');
            $table->timestamps();

            $table->foreign('id_timbrado')->references('identificador')->on('vta_timbrados');
            $table->foreign('id_punto_emision')->references('identificador')->on('vta_puntos_emision');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vta_asignacion_comp');
    }
}