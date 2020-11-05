--CREAR EL ROL ADMINISTRADOR
INSERT INTO `fnd_roles` (`nombre`, `created_at`) 
VALUES
    ('ADMINISTRADOR', NOW()),
    ('CLIENTE', NOW());

-- CREAR UN USUARIO ADMINISTRADOR, PASS: admin123
INSERT INTO `fnd_usuarios` (`nombre_completo`, `email`, `clave_acceso`, `celular`, `telefono`, `fecha_nacimiento`, `imagen`, `activo`, `id_rol`, `created_at`, `updated_at`) 
VALUES ('ADMINISTRADOR', 'admin@admin.com', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', '0000000000', '000000000', NOW(), NULL, 'S', '1', NOW(), NULL);


-- PERMISOS PARA PANEL DE ADMINISTRACION
INSERT INTO `fnd_permisos` (`nombre`, `created_at`, `updated_at`) 
VALUES 
    ('EMPRESA.LISTAR', NOW(), NULL),
    ('EMPRESA.INSERTAR', NOW(), NULL),
    ('EMPRESA.EDITAR', NOW(), NULL),

    ('SUCURSAL.LISTAR', NOW(), NULL),
    ('SUCURSAL.INSERTAR', NOW(), NULL),
    ('SUCURSAL.EDITAR', NOW(), NULL),

    ('BANNER.LISTAR', NOW(), NULL),
    ('BANNER.INSERTAR', NOW(), NULL),
    ('BANNER.EDITAR', NOW(), NULL),
    ('BANNER.ACTIVAR', NOW(), NULL),
    ('BANNER.DESACTIVAR', NOW(), NULL),

    ('PARAMETRO.ECOMMERCE.LISTAR', NOW(), NULL),
    ('PARAMETRO.ECOMMERCE.INSERTAR', NOW(), NULL),
    ('PARAMETRO.ECOMMERCE.EDITAR', NOW(), NULL),

    ('PUNTO-EMISION.LISTAR', NOW(), NULL),
    ('PUNTO-EMISION.INSERTAR', NOW(), NULL),
    ('PUNTO-EMISION.EDITAR', NOW(), NULL),

    ('TIMBRADO.LISTAR', NOW(), NULL),
    ('TIMBRADO.INSERTAR', NOW(), NULL),
    ('TIMBRADO.EDITAR', NOW(), NULL),

    ('CLIENTE.LISTAR', NOW(), NULL),
    ('CLIENTE.INSERTAR', NOW(), NULL),
    ('CLIENTE.EDITAR', NOW(), NULL),

    ('PEDIDO.LISTAR', NOW(), NULL),
    ('PEDIDO.INSERTAR', NOW(), NULL),
    ('PEDIDO.EDITAR', NOW(), NULL),
    ('PEDIDO.ANULAR', NOW(), NULL),

    ('PRODUCTO.LISTAR', NOW(), NULL),
    ('PRODUCTO.INSERTAR', NOW(), NULL),
    ('PRODUCTO.EDITAR', NOW(), NULL),
    ('PRODUCTO.ACTIVAR', NOW(), NULL),
    ('PRODUCTO.DESACTIVAR', NOW(), NULL),

    ('MARCA.LISTAR', NOW(), NULL),
    ('MARCA.INSERTAR', NOW(), NULL),
    ('MARCA.EDITAR', NOW(), NULL),

    ('TIPO-IMPUESTO.LISTAR', NOW(), NULL),
    ('TIPO-IMPUESTO.INSERTAR', NOW(), NULL),
    ('TIPO-IMPUESTO.EDITAR', NOW(), NULL),

    ('LINEA-PRODUCTO.LISTAR', NOW(), NULL),
    ('LINEA-PRODUCTO.INSERTAR', NOW(), NULL),
    ('LINEA-PRODUCTO.EDITAR', NOW(), NULL),

    ('PAIS.LISTAR', NOW(), NULL),
    ('PAIS.INSERTAR', NOW(), NULL),
    ('PAIS.EDITAR', NOW(), NULL),

    ('CIUDAD.LISTAR', NOW(), NULL),
    ('CIUDAD.INSERTAR', NOW(), NULL),
    ('CIUDAD.EDITAR', NOW(), NULL),

    ('BARRIO.LISTAR', NOW(), NULL),
    ('BARRIO.INSERTAR', NOW(), NULL),
    ('BARRIO.EDITAR', NOW(), NULL),
    
    ('USUARIO.LISTAR', NOW(), NULL),
    ('USUARIO.INSERTAR', NOW(), NULL),
    ('USUARIO.EDITAR', NOW(), NULL),
    ('USUARIO.ACTIVAR', NOW(), NULL),
    ('USUARIO.DESACTIVAR', NOW(), NULL),
    
    ('ROL.LISTAR', NOW(), NULL),
    ('ROL.INSERTAR', NOW(), NULL),
    ('ROL.EDITAR', NOW(), NULL),
    ('ROL.ACTIVAR', NOW(), NULL),
    ('ROL.DESACTIVAR', NOW(), NULL),

    ('CUPON-DESCUENTO.LISTAR', NOW(), NULL),
    ('CUPON-DESCUENTO.INSERTAR', NOW(), NULL),
    ('CUPON-DESCUENTO.EDITAR', NOW(), NULL)
    
    ('PREGUNTA.LISTAR', NOW(), NULL),
    ('PREGUNTA.INSERTAR', NOW(), NULL),
    ('PREGUNTA.EDITAR', NOW(), NULL);


--ASIGNAR TODOS LOS PERMISOS AL ROL ADMINISTRADOR
INSERT INTO `fnd_rol_permisos` (`id_rol`, `id_permiso`, `created_at`)
VALUES
    ('1', '1', NOW()), 
    ('1', '2', NOW()), 
    ('1', '3', NOW()), 
    ('1', '4', NOW()), 
    ('1', '5', NOW()), 
    ('1', '6', NOW()), 
    ('1', '7', NOW()), 
    ('1', '8', NOW()), 
    ('1', '9', NOW()), 
    ('1', '10', NOW()), 
    ('1', '11', NOW()), 
    ('1', '12', NOW()), 
    ('1', '13', NOW()), 
    ('1', '14', NOW()), 
    ('1', '15', NOW()), 
    ('1', '16', NOW()), 
    ('1', '17', NOW()), 
    ('1', '18', NOW()), 
    ('1', '19', NOW()), 
    ('1', '20', NOW()), 
    ('1', '21', NOW()), 
    ('1', '22', NOW()), 
    ('1', '23', NOW()), 
    ('1', '24', NOW()), 
    ('1', '25', NOW()), 
    ('1', '26', NOW()), 
    ('1', '27', NOW()), 
    ('1', '28', NOW()), 
    ('1', '29', NOW()), 
    ('1', '30', NOW()), 
    ('1', '31', NOW()), 
    ('1', '32', NOW()), 
    ('1', '33', NOW()), 
    ('1', '34', NOW()), 
    ('1', '35', NOW()), 
    ('1', '36', NOW()), 
    ('1', '37', NOW()), 
    ('1', '38', NOW()), 
    ('1', '39', NOW()), 
    ('1', '40', NOW()), 
    ('1', '41', NOW()), 
    ('1', '42', NOW()), 
    ('1', '43', NOW()), 
    ('1', '44', NOW()), 
    ('1', '45', NOW()), 
    ('1', '46', NOW()), 
    ('1', '47', NOW()), 
    ('1', '48', NOW()), 
    ('1', '49', NOW()), 
    ('1', '50', NOW()), 
    ('1', '51', NOW()), 
    ('1', '52', NOW()), 
    ('1', '53', NOW()), 
    ('1', '54', NOW()), 
    ('1', '55', NOW()), 
    ('1', '56', NOW()), 
    ('1', '57', NOW()), 
    ('1', '58', NOW()), 
    ('1', '59', NOW()), 
    ('1', '60', NOW()), 
    ('1', '61', NOW()), 
    ('1', '62', NOW()), 
    ('1', '63', NOW());