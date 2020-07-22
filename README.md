# Tesis UniNorte
Aplicacion web y movil de Ecommerce.

El proyecto esta desarrollado con las siguientes tecnologias.
Base de datos: MySql.
Api: Laravel.
Admin: Angular v7.
App: Ionic v4.

## Construcción

### Instalar las dependencias generales
Primero se debe descargar el instalador de nodejs desde su [página oficial](http://nodejs.org/download/)

Luego instalar La interfaz de línea de comando para Angular v7 y Ionic v4
```
$ npm install -g @angular
$ npm install -g ionic
```

### Api
Descargar dependencias y librerias
```
$ composer install
```

### Admin && App
Descargar dependencias y librerias
```
$ npm install
```

## Iniciar proyectos
Para iniciar los proyecto en modo livereload para desarrollo se deben ejecutar los siguiente comandos.

### Api
```
$ php artisan serve
```

### Admin
```
$ ng serve
```

### App
```
$ ionic serve
```