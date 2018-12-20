const mongoose = require('mongoose');
const articuloModel = require('./articulos.model');

var Schema = mongoose.Schema;

var detalleVentaSchema = new Schema(
    {
        articulo: {
            descripcion: String,
            modelo: String,
            precio: Number
        },
        cantidad: {
            required: [true, "Es necesario agregar la cantidad a la venta."],
            type: Number,
            min: [1, "Es necesario que la cantidad sea mayor a 0."]
        },
        importe: {
            required: [true, "Es necesario agregar el importe."],
            type: Number
        }
    }
);

var ventaSchema = new Schema(
    {
        folio: {
            required: [true, "Es necesario el folio de la venta."],
            type: Number
        },
        cliente: {
            required: [true, "Es necesario la clave del cliente."],
            type: Schema.Types.ObjectId,
            ref: 'clientes'
        },
        fecha: {
            required: [true, "Es necesario agregar la fecha de la  venta."],
            type: Date
        },
        estatus: {
            required: [true, "Es necesario agregar el estatus de la venta."],
            type: String,
            maxlength: 1,
            enum: ['a', 'c'] // a -> activo :: c -> cancelado
        },
        porcentajeEnganche: {
            required: [true, "Es necesario agregar el porcentaje del enganche"],
            type: Number
        },
        enganche: {
            required: [true, "Es necesario agregar el total del enganche"],
            type: Number
        },
        bonificacionEnganche: {
            required: [true, "Es necesario agregar la bonificación del enganche."],
            type: Number
        },
        total: {
            required: [true, "Es necesario agregar el total de la venta"],
            type: Number
        },
        detalleVenta: [detalleVentaSchema],
        abonos: {
            numero: Number,
            abono: Number,
            totalAPagar: Number,
            ahorro: Number,
        }
    }
);

ventaSchema.post('save', function (doc) {
    doc.detalleVenta.forEach(detalle => {
        articuloModel.findArticuloByModel(detalle.articulo.modelo, (err, articulo) => {
            let existencia = articulo.existencia - detalle.cantidad;
            articulo.existencia = existencia;
            
            articuloModel.editArticulos(articulo._id, articulo, (err, editArt) => {
                let edit = editArt;
            });
        });
    });
});

const ventaModel = module.exports = mongoose.model('ventas', ventaSchema);

module.exports.getVentas = (callback) => {
    ventaModel.find(null, null, { sort: { folio: 1 } })
        .populate('cliente').exec(callback);
};

module.exports.addVenta = (ventaNueva, callback) => {
    ventaNueva.save(
        (err, venta) => {
            ventaModel.populate(
                venta,
                {
                    path: 'cliente'
                },
                callback
            )
        }
    );
};