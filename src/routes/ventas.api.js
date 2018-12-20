const router = require('express').Router();
const ventaModel = require('../models/ventas.model');
const clienteModel = require('../models/clientes.model');
const articuloModel = require('../models/articulos.model');
const configuracionModel = require('../models/configuraciones.model');
const errorHandler = require('../config/error-handler');


// obtener todos las ventas
router.get('/ventas', (req, res, next) => {
    ventaModel.getVentas((err, ventas) => {
        if (err) {
            res.json({ err: 'Error al obtener las ventas.' })
        } else {
            res.json(ventas);
        }
    });
});

// agregar nueva venta
router.post('/venta', (req, res, next) => {
    let newVenta = new ventaModel(req.body);
    ventaModel.addVenta(newVenta, (err, ventaNueva) => {
        if (err) {
            error = errorHandler.getError(err);
            res.json(error);
        } else {
            res.json(ventaNueva);
        }
    });
});

// obtener configuraciones
router.get('/configuraciones', (req, res, next) => {
    configuracionModel.getConfiguraciones((err, configuraciones) => {
        if (err) return res.json({ err: 'Error al obtener los articulos' });

        res.json(configuraciones);
    });
});

// obtener clientes
router.get('/clientes/:cliente', (req, res, next) => {
    clienteModel.getClientes(req.params.cliente, (err, clientes) => {
        if (err) return res.json({ err: 'Error al obtener los clientes' });

        res.json(clientes);
    });
});

// obtener articulos
router.get('/articulos/:articulo', (req, res, next) => {
    articuloModel.getArticulos(req.params.articulo, (err, articulos) => {
        if (err) return res.json({ err: 'Error al obtener los articulos' });

        res.json(articulos);
    });
});

// editar configuraciones
router.put('/configuraciones/:id', (req, res, next) => {
    configuracionModel.editConfiguraciones(req.params.id, req.body, (err, configuracionUp) => {
        if (err) return res.json({ err: 'Error al actualizar configuraciones.' });

        res.json(configuracionUp);
    });
});

module.exports = router;