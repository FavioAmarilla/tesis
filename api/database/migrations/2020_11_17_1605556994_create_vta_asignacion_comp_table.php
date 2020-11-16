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

            $table->increments('identificador');
            $table->integer('id_timbrado', 11);
            $table->integer('id_punto_emision', 11);
            $table->integer('ult_usado', 11);
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
        Schema::dropIfExists('vta_asignacion_comp');
    }
}