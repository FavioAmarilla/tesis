<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFndParmEmpresasTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('fnd_parm_empresas', function (Blueprint $table) {

            $table->increments('identificador');
            $table->string('codigo', 5);
            $table->string('nombre', 60);
            $table->string('numero_documento', 20)->nullable()->default('NULL');
            $table->string('imagen', 100)->nullable()->default('NULL');
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
        Schema::dropIfExists('fnd_parm_empresas');
    }
}