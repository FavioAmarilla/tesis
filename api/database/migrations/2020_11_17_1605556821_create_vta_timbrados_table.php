<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVtaTimbradosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vta_timbrados', function (Blueprint $table) {

            $table->bigIncrements('identificador');
            $table->string('numero', 20);
            $table->integer('numero_desde');
            $table->integer('numero_hasta');
            $table->date('fecha_desde');
            $table->date('fecha_hasta');
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
        Schema::dropIfExists('vta_timbrados');
    }
}