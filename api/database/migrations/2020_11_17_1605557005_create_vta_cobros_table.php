<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVtaCobrosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vta_cobros', function (Blueprint $table) {

            $table->increments('identificador');
            $table->integer('id_comprobante', 11);
            $table->integer('monto_total', 11);
            $table->integer('monto_pagado', 11);
            $table->integer('vuelto', 11);
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
        Schema::dropIfExists('vta_cobros');
    }
}