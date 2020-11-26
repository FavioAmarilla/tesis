<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateVtaComprobantesTable extends Migration
{
	/**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('vta_comprobantes', function (Blueprint $table) {

			$table->bigIncrements('identificador');
			$table->unsignedBigInteger('id_pedido');
			$table->unsignedBigInteger('id_sucursal');
			$table->unsignedBigInteger('id_timbrado');
			$table->unsignedBigInteger('id_punto_emision');
			$table->unsignedBigInteger('id_cliente');
			$table->string('numero', 20);
			$table->integer('numero_ticket');
			$table->integer('monto_total');
			$table->integer('monto_exento');
			$table->integer('monto_iva5');
			$table->integer('monto_iva10');
			$table->integer('usr_proceso');
			$table->string('usr_anulacion', 15)->nullable()->default(NULL);
			$table->date('fec_anulacion')->nullable()->default(NULL);
			$table->integer('descuento')->nullable()->default(NULL);
			$table->timestamps();

			$table->foreign('id_pedido')->references('identificador')->on('ec_pedidos');
			$table->foreign('id_sucursal')->references('identificador')->on('fnd_sucursales');
			$table->foreign('id_timbrado')->references('identificador')->on('vta_timbrados');
			$table->foreign('id_punto_emision')->references('identificador')->on('vta_puntos_emision');
			$table->foreign('id_cliente')->references('identificador')->on('vta_clientes');

        });
    }

	/**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('vta_comprobantes');
    }
}