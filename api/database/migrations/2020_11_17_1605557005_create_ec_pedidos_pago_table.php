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

			$table->bigIncrements('identificador');
			$table->unsignedBigInteger('id_pedido');
			$table->integer('referencia');
			$table->string('process_id', 30)->nullable()->default(NULL);
			$table->string('vr_tipo', 5);
			$table->integer('total');
			$table->integer('importe');
			$table->integer('vuelto');
            $table->enum('estado', ['PENDIENTE', 'CANCELADO', 'PAGADO'])->default('PENDIENTE');
			$table->timestamps();
            
            $table->foreign('id_pedido')->references('identificador')->on('ec_pedidos');

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