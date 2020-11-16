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

            $table->increments('identificador');
            $table->integer('id_cobro', 11);
            $table->integer('vr_tipo', 11);
            $table->integer('importe', 11);
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
        Schema::dropIfExists('vta_cobro_items');
    }
}