export interface DetalleVenta {
    _id?: string,
    articulo: {
        descripcion: String,
        modelo: String,
        precio: Number
    },
    cantidad: number,
    importe: number
}

export interface Venta {
    _id?: string,
    folio: number,
    cliente: number,
    nombre?: string,
    fecha: Date,
    estatus: string,
    porcentajeEnganche: number,
    enganche: number,
    bonificacionEnganche: number,
    total: number
}

export interface Cliente {
    _id?: string,
    nombreCompleto: {
        apellidoPaterno: string,
        apellidoMaterno: string,
        nombres: string
    },
    rfc: string
}

export interface Configuraciones {
    _id?: string,
    tasaFinanciamiento: number,
    porcientoEnganche: number,
    plazoMax: number,
    folioVenta: number
}

export interface Articulos {
    _id?: string,
    descripcion: string,
    modelo: string,
    precio: number,
    existencia: number
}