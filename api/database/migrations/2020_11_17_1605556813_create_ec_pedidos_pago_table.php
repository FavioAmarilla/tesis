<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEcPedidosPagoTable extends Migration
{
	/**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ec_pedidos_pago', function (Blueprint $table) {

			$table->increments('identificador');
			$table->integer('id_pedido', 11);
			$table->integer('referencia', 15);
			$table->string('process_id', 30)->nullable()->default('NULL');
			$table->string('vr_tipo', 5);
			$table->integer('total', 11);
			$table->integer('importe', 11);
			$table->integer('vuelto', 11);
			$table->string('estado', 11)->default('PENDIENTE');
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
        Schema::dropIfExists('ec_pedidos_pago');
    }
}