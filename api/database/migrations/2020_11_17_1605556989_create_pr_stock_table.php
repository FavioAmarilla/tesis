<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePrStockTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pr_stock', function (Blueprint $table) {

            $table->bigIncrements('identificador');
            $table->unsignedBigInteger('id_sucursal');
            $table->unsignedBigInteger('id_producto');
            $table->decimal('stock', 10, 0)->default('0');
            $table->timestamps();

            $table->foreign('id_sucursal')->references('identificador')->on('fnd_sucursales');
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
        Schema::dropIfExists('pr_stock');
    }
}