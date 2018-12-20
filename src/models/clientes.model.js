const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var clienteSchema = new Schema(
    {
        nombreCompleto: {
            apellidoPaterno: String,
            apellidoMaterno: String,
            nombres: String
        },
        rfc: String
    }
);

const clienteModel = module.exports = mongoose.model('clientes', clienteSchema);

module.exports.getClientes = (cliente, callback) => {
    clienteModel.find(
        {
            "nombreCompleto.nombres": {
                $regex: new RegExp(cliente, "i") //$regex: `.*${cliente}.*`
            }
        },
        null,
        {
            sort: {
                "nombreCompleto.apellidoPaterno": 1
            }
        }, callback);
};