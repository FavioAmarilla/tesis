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

			$table->increments('identificador');
			$table->integer('id_linea', 11)->nullable()->default('NULL');
			$table->integer('id_tipo_impuesto', 11);
			$table->integer('id_marca', 11);
			$table->string('vr_unidad_medida', 2);
			$table->string('descripcion', 120);
			$table->string('slug');
			$table->string('codigo_barras', 15)->nullable()->default('NULL');
			$table->integer('costo_unitario', 11);
			$table->integer('precio_venta', 11)->nullable()->default('NULL');
			$table->string('imagen', 30)->nullable()->default('NULL');
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
        Schema::dropIfExists('pr_productos');
    }
}