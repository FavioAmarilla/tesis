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

			$table->bigIncrements('identificador');
			$table->unsignedBigInteger('id_pedido');
			$table->unsignedBigInteger('id_producto');
			$table->double('cantidad', 11, 2);
			$table->integer('precio_venta');
			$table->integer('importe_exento');
			$table->integer('importe_iva5');
			$table->integer('importe_iva10');
            $table->string('activo', 2);
			$table->timestamps();
            
            $table->foreign('id_pedido')->references('identificador')->on('ec_pedidos');
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
        Schema::dropIfExists('ec_pedidos_items');
    }
}