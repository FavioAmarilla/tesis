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

			$table->bigIncrements('identificador');
			$table->unsignedBigInteger('id_comprobante');
			$table->unsignedBigInteger('id_producto');
			$table->integer('precio_venta');
			$table->integer('costo_unitario');
			$table->integer('porc_impuesto');
			$table->integer('total');
			$table->integer('cantidad');
			$table->integer('total_exento');
			$table->integer('total_iva5');
			$table->integer('total_iva10');
            $table->timestamps();
            
            $table->foreign('id_comprobante')->references('identificador')->on('vta_comprobantes');
            $table->foreign('id_producto')->references('identificador')->on('pr_productos');

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