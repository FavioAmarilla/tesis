export interface Usuario {
    identificador?: number;
    nombre_completo?: string;
    email?: string;
    clave_acceso?: string;
}

export interface Producto {
    identificador?: number;
    id_linea?: number;
    id_tipo_impuesto?: number;
    vr_unidad_medida?: string;
    descripcion?: string;
    codigo_barras?: string;
    costo_unitario?: number;
    precio_venta?: number;
    archivo_img?: string;
    cantidad?: number;
}

export interface Banner {
    identificador?: number;
    titulo?: string;
    descripcion?: string;
    archivo_img?: string;
}

export interface LineaProducto {
    identificador?: number;
    descripcion?: string;
}

export interface Sucursal {
    identificador?: number
    id_empresa?: number
    codigo?: string
    nombre?: string
    telefono?: string
    id_pais?: number
    id_ciudad?: number
    direccion?: string
    ecommerce?: string
}

export interface Pais {
    identificador?: number
    nombre?: string
}

export interface Ciudad {
    identificador?: number
    id_pais?: number
    nombre?: string
}

export interface Barrio {
    identificador?: number
    id_ciudad?: number
    nombre?: string
}