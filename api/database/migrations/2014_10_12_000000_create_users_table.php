<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fnd_usuarios', function (Blueprint $table) {
            $table->increments('identificador');
            $table->string('nombre_completo', 60);
            $table->string('email', 50);
            $table->string('clave_acceso', 100)->nullable()->default('NULL');
            $table->string('celular', 30)->nullable()->default('NULL');
            $table->string('telefono', 30)->nullable()->default('NULL');
            $table->date('fecha_nacimiento');
            $table->string('imagen', 45)->nullable()->default('NULL');
            $table->string('activo', 2)->default('S');
            $table->integer('id_rol', 11)->nullable()->default('NULL');
            $table->tinyInteger('tiene_tarjetas',1)->default('0');
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
        Schema::dropIfExists('users');
    }
}
