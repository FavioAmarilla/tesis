<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEcPedidosTable extends Migration
{
	/**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ec_pedidos', function (Blueprint $table) {

			$table->bigIncrements('identificador');
			$table->unsignedBigInteger('id_cupon_descuento');
			$table->unsignedBigInteger('id_usuario');
			$table->unsignedBigInteger('id_sucursal');
			$table->unsignedBigInteger('id_ciudad');
			$table->unsignedBigInteger('id_barrio');
			$table->string('direccion')->nullable()->default(NULL);
			$table->date('fecha');
			$table->text('latitud');
			$table->text('longitud');
			$table->integer('costo_envio');
			$table->integer('total');
			$table->integer('total_exento');
			$table->integer('total_iva5');
			$table->integer('total_iva10');
			$table->text('observacion');
			$table->string('persona');
			$table->string('nro_documento', 15);
			$table->string('telefono', 15);
			$table->string('tipo_envio', 2);
			$table->enum('estado', ['PENDIENTE', 'EN PROCESO', 'LISTO', 'EN CAMINO', 'ENTREGADO', 'CANCELADO', 'DEVUELTO']);
			$table->timestamps();
			
			$table->foreign('id_cupon_descuento')->references('identificador')->on('vta_cupones_descuento');
			$table->foreign('id_usuario')->references('identificador')->on('fnd_usuarios');
			$table->foreign('id_sucursal')->references('identificador')->on('fnd_sucursales');
			$table->foreign('id_ciudad')->references('identificador')->on('geo_ciudades');
			$table->foreign('id_barrio')->references('identificador')->on('geo_barrios');

        });
    }

	/**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ec_pedidos');
    }
}