<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVtaItemsComprobTable extends Migration
{
	/**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vta_items_comprob', function (Blueprint $table) {

			$table->increments('identificador');
			$table->integer('id_comprobante', 11);
			$table->integer('id_producto', 11)->nullable()->default('NULL');
			$table->integer('precio_venta', 11);
			$table->integer('costo_unitario', 11)->nullable()->default('NULL');
			$table->integer('porc_impuesto', 11)->nullable()->default('NULL');
			$table->integer('total', 11)->nullable()->default('NULL');
			$table->integer('cantidad', 11)->nullable()->default('NULL');
			$table->integer('total_exento', 11)->nullable()->default('NULL');
			$table->integer('total_iva5', 11)->nullable()->default('NULL');
			$table->integer('total_iva10', 11)->nullable()->default('NULL');
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
        Schema::dropIfExists('vta_items_comprob');
    }
}