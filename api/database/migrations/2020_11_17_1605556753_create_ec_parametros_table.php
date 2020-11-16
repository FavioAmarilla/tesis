<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEcParametrosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('ec_parametros', function (Blueprint $table) {

            $table->increments('identificador');
            $table->integer('monto_minimo', 11);
            $table->integer('costo_delivery', 11);
            $table->integer('id_pais', 11);
            $table->datetime('created_at')->nullable()->default('NULL');
            $table->datetime('updated_at');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('ec_parametros');
    }
}