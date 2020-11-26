<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVtaCobroItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vta_cobro_items', function (Blueprint $table) {

            $table->bigIncrements('identificador');
            $table->unsignedBigInteger('id_cobro');
            $table->integer('vr_tipo');
            $table->integer('importe');
            $table->integer('vuelto');
            $table->timestamps();

            $table->foreign('id_cobro')->references('identificador')->on('vta_cobros');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vta_cobro_items');
    }
}