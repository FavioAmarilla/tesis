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

			$table->increments('identificador');
			$table->integer('id_cupon_descuento', 11)->nullable()->default('NULL');
			$table->integer('id_usuario', 11);
			$table->integer('id_sucursal', 11);
			$table->date('fecha');
			$table->integer('id_pais', 11)->nullable()->default('NULL');
			$table->integer('id_ciudad', 11)->nullable()->default('NULL');
			$table->integer('id_barrio', 11)->nullable()->default('NULL');
			$table->string('direccion')->nullable()->default('NULL');
			$table->text('latitud');
			$table->text('longitud');
			$table->integer('costo_envio', 11);
			$table->integer('total', 11);
			$table->integer('total_exento', 11)->nullable()->default('NULL');
			$table->integer('total_iva5', 11)->nullable()->default('NULL');
			$table->integer('total_iva10', 11)->nullable()->default('NULL');
			$table->text('observacion');
			$table->string('persona')->nullable()->default('NULL');
			$table->string('nro_documento', 15)->nullable()->default('NULL');
			$table->string('telefono', 15);
			$table->string('tipo_envio', 2);
			$table->string('estado', 11);
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
        Schema::dropIfExists('ec_pedidos');
    }
}