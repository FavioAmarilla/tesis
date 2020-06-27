export interface Usuario {
    sub?: number;
    identificador?: number;
    nombre_completo?: string;
    email?: string;
    clave_acceso?: string;
    telefono?: string;
    celular?: string;
    fecha_nacimiento?: string;
    clave_actual?: string;
    clave_nueva?: string;
    repita?: string;
    ruc?: string;
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
    imagen?: string;
    slug?: string;
    length?: number;
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
    identificador?: number;
    id_empresa?: number;
    codigo?: string;
    nombre?: string;
    telefono?: string;
    id_pais?: number;
    id_ciudad?: number;
    direccion?: string;
    ecommerce?: string;
}

export interface Pais {
    identificador?: number;
    nombre?: string;
}

export interface Ciudad {
    identificador?: number;
    id_pais?: number;
    nombre?: string;
}

export interface Barrio {
    identificador?: number;
    id_ciudad?: number;
    nombre?: string;
}

export interface CuponDescuento {
    identificador?: number;
    descripcion?: number;
    codigo?: string;
    porc_descuento?: number;
    fecha_desde?: string;
    fecha_hasta?: string;
    usado?: string;
    porcentaje?: number;
    length?: number;
}

export interface EcParametro {
    identificador?: number;
    monto_minimo?: number;
    costo_delivery?: number;
    id_pais?: number;
}

export interface EcParamCiudad {
    identificador?: number;
    id_ec_parametro?: number;
    id_ciudad?: number;
    activo?: string;
}

export interface Marca {
    identificador?: number;
    nombre?: string;
}

export interface Pedido {
  identificador?: number;
  id_cupon_descuento?: number;
  id_usuario?: number;
  id_sucursal?: number;
  fecha?: string;
  id_pais?: number;
  id_ciudad?: number;
  id_barrio?: number;
  direccion?: string;
  latitud?: string;
  longitud?: string;
  costo_envio?: number;
  total?: number;
  observacion?: string;
  persona?: any;
  nro_documento?: any;
  tipo_envio?: string;
  estado?: string;
  created_at?: string;
  updated_at?: string;
  sucursal?: Sucursal;
  cupon?: any;
  pais?: Pais;
  ciudad?: Ciudad;
  barrio?: Barrio;
  pagos?: any;
  length?: number;
  productos?: Producto[];
  pago?: any;
}

export interface Cliente {
    identificador: number,
    id_usuario: number,
    razon_social: string,
    numero_documento: string,
    celular: string,
    telefono: string
}