<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFndSucursalesTable extends Migration
{
	/**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fnd_sucursales', function (Blueprint $table) {

			$table->increments('identificador');
			$table->integer('id_empresa', 11);
			$table->string('codigo', 5);
			$table->string('nombre', 100);
			$table->string('telefono', 50);
			$table->integer('id_pais', 11);
			$table->integer('id_ciudad', 11);
			$table->string('direccion');
			$table->string('ecommerce', 11);
			$table->string('central', 2);
			$table->string('activo', 2)->default('S');
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
        Schema::dropIfExists('fnd_sucursales');
    }
}