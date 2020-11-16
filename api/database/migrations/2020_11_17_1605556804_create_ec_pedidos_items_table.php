<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEcPedidosItemsTable extends Migration
{
	/**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ec_pedidos_items', function (Blueprint $table) {

			$table->increments('identificador');
			$table->integer('id_pedido', 11);
			$table->integer('id_producto', 11);
			$table->double('cantidad', 11, 2);
			$table->integer('precio_venta', 11);
			$table->integer('importe_exento', 11)->nullable()->default('NULL');
			$table->integer('importe_iva5', 11)->nullable()->default('NULL');
			$table->integer('importe_iva10', 11)->nullable()->default('NULL');
			$table->string('activo', 2);
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
        Schema::dropIfExists('ec_pedidos_items');
    }
}