<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrProductosTable extends Migration
{
	/**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pr_productos', function (Blueprint $table) {

			$table->bigIncrements('identificador');
			$table->unsignedBigInteger('id_linea');
			$table->unsignedBigInteger('id_tipo_impuesto');
			$table->unsignedBigInteger('id_marca');
			$table->string('vr_unidad_medida', 2);
			$table->string('descripcion', 120);
			$table->string('slug');
			$table->string('codigo_barras', 15);
			$table->integer('costo_unitario');
			$table->integer('precio_venta');
			$table->string('imagen', 30)->nullable()->default(NULL);
            $table->timestamps();
            
            $table->foreign('id_linea')->references('identificador')->on('pr_lineas_prod');
            $table->foreign('id_tipo_impuesto')->references('identificador')->on('fnd_tipos_impuesto');
            $table->foreign('id_marca')->references('identificador')->on('pr_marcas');

        });
    }

	/**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pr_productos');
    }
}