const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var articuloSchema = new Schema(
    {
        descripcion: String,
        modelo: String,
        precio: Number,
        existencia: Number
    }
);

const articuloModel = module.exports = mongoose.model('articulos', articuloSchema);

module.exports.getArticulos = (articulo, callback) => {
    articuloModel.find(
        {
            descripcion: {
                $regex: new RegExp(articulo, "i")
            }
        },
        null,
        {
            sort: {
                descripcion: 1
            }
        }, callback);
};

module.exports.findArticuloByModel = (model, callback) => {
    articuloModel.findOne({ modelo: model }, callback);
};

module.exports.editArticulos = (id, articulo, callback) => {
    articuloModel.findByIdAndUpdate(id, { $set: articulo }, { new: true, runValidators: true }, callback);
};