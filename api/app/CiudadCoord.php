<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Grimzy\LaravelMysqlSpatial\Eloquent\SpatialTrait;

/**
 * @property \Grimzy\LaravelMysqlSpatial\Types\Polygon $poligono
 */

class CiudadCoord extends Model
{
    use SpatialTrait;
    
    protected $primaryKey = 'identificador';
    protected $table = 'geo_ciudad_coord';

    protected $fillable = [
        'id_ciudad'
    ];

    protected $spatialFields = [
        'poligono'
    ];
}
