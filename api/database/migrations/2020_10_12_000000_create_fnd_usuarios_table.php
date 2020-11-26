<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateFndUsuariosTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fnd_usuarios', function (Blueprint $table) {
            $table->bigIncrements('identificador');
            $table->unsignedBigInteger('id_rol');
            $table->string('nombre_completo', 60);
            $table->string('email', 50);
            $table->string('clave_acceso', 100);
            $table->string('celular', 30)->nullable()->default(NULL);
            $table->string('telefono', 30)->nullable()->default(NULL);
            $table->date('fecha_nacimiento');
            $table->string('imagen', 45)->nullable()->default(NULL);
            $table->string('activo', 2)->default('S');
            $table->tinyInteger('tiene_tarjetas')->default(0);
            $table->timestamps();

            $table->foreign('id_rol')->references('identificador')->on('fnd_roles');

        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
