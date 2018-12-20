const mongoose = require('mongoose');

var Schema = mongoose.Schema;
var configuracionSchema = new Schema(
    {
        tasaFinanciamiento: Number,
        porcientoEnganche: Number,
        plazoMax: Number,
        folioVenta: Number
    }
);

const configuracionModel = module.exports = mongoose.model('configuraciones', configuracionSchema);

module.exports.getConfiguraciones = (callback) => {
    configuracionModel.findOne(null, null, null, callback);
};

module.exports.editConfiguraciones = (id, configuracion, callback) => {
    configuracionModel.findByIdAndUpdate(
        id,
        {
            $set: configuracion
        },
        {
            new: true,
            runValidators: true
        },
        callback
    );
};