<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePgSlidesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pg_slides', function (Blueprint $table) {

            $table->bigIncrements('identificador');
            $table->string('titulo', 100);
            $table->string('descripcion');
            $table->string('imagen', 100);
            $table->string('activo', 2)->default('S');
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
        Schema::dropIfExists('pg_slides');
    }
}