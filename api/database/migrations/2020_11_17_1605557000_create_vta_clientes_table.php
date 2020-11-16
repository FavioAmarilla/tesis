<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVtaClientesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vta_clientes', function (Blueprint $table) {

            $table->increments('identificador');
            $table->integer('id_usuario', 11);
            $table->string('razon_social', 240);
            $table->string('numero_documento', 15);
            $table->string('celular', 30);
            $table->string('telefono', 60)->nullable()->default('NULL');
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
        Schema::dropIfExists('vta_clientes');
    }
}