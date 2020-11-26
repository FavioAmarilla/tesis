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

			$table->bigIncrements('identificador');
			$table->unsignedBigInteger('id_empresa');
			$table->unsignedBigInteger('id_pais');
			$table->unsignedBigInteger('id_ciudad');
			$table->string('codigo', 5);
			$table->string('nombre', 100);
			$table->string('telefono', 50);
			$table->string('direccion');
			$table->string('ecommerce', 11);
			$table->string('central', 2);
            $table->string('activo', 2)->default('S');
			$table->timestamps();
            
            $table->foreign('id_empresa')->references('identificador')->on('fnd_parm_empresas');
            $table->foreign('id_pais')->references('identificador')->on('geo_paises');
            $table->foreign('id_ciudad')->references('identificador')->on('geo_ciudades');

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