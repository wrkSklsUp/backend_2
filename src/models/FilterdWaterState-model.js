// const { Schema, model } = require('mongoose');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const FilterdWaterStateSchema = new Schema({

    measurement_point: {type: Schema.Types.ObjectId, ref: 'MeasuringPointWaterState'},
    temperature: {type: Number, default: 0},
    acidity: {type: Number, default: 0},
    salt_level: {type: Number, default: 0},
    redox_potential: {type: Number, default: 0},
    oxygen_level: {type: Number, default: 0},
    light_transmittance: {type: Number, default: 0},
    date: {type: String, default: new Date().toLocaleString('de-RU')}

});

FilterdWaterStateSchema.set('toObject', { virtuals: true });
FilterdWaterStateSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('FilterdWaterStateSchema', FilterdWaterStateSchema);