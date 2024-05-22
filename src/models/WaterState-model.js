const { Schema, model } = require('mongoose');

const WaterStateSchema = new Schema({

    measurement_point: {type: Schema.Types.ObjectId, ref: 'MeasuringPointWaterState'},
    temperature: {type: Number, default: 0},
    acidity: {type: Number, default: 0},
    salt_level: {type: Number, default: 0},
    redox_potential: {type: Number, default: 0},
    oxygen_level: {type: Number, default: 0},
    light_transmittance: {type: Number, default: 0},
    date: {type: String, default: new Date().toLocaleString('de-RU')}
    // date: {type: String, default: "1.12.2023, 10:12:12"}
});

WaterStateSchema.set('toObject', { virtuals: true });
WaterStateSchema.set('toJSON', { virtuals: true });

const waterSchema = model('WaterStateSchema', WaterStateSchema);

module.exports = waterSchema;