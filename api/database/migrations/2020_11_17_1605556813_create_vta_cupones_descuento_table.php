<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVtaCuponesDescuentoTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vta_cupones_descuento', function (Blueprint $table) {

            $table->bigIncrements('identificador');
            $table->text('descripcion');
            $table->text('codigo');
            $table->decimal('porc_desc', 10, 0);
            $table->datetime('fecha_desde');
            $table->datetime('fecha_hasta');
            $table->string('usado', 2)->default('S');
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
        Schema::dropIfExists('vta_cupones_descuento');
    }
}