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

			$table->increments('identificador');
			$table->integer('id_pedido', 11);
			$table->integer('id_sucursal', 11);
			$table->integer('id_timbrado', 11);
			$table->integer('id_punto_emision', 11);
			$table->integer('id_cliente', 11);
			$table->string('numero', 20);
			$table->integer('numero_ticket', 11);
			$table->integer('monto_total', 11)->nullable()->default('NULL');
			$table->integer('monto_exento', 11)->nullable()->default('NULL');
			$table->integer('monto_iva5', 11)->nullable()->default('NULL');
			$table->integer('monto_iva10', 11)->nullable()->default('NULL');
			$table->integer('usr_proceso', 11);
			$table->string('usr_anulacion', 15)->nullable()->default('NULL');
			$table->date('fec_anulacion')->nullable()->default('NULL');
			$table->integer('descuento', 11)->nullable()->default('NULL');
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
        Schema::dropIfExists('vta_comprobantes');
    }
}