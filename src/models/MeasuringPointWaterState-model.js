const { Schema, model } = require('mongoose');

const MeasuringPointWaterStateSchema = new Schema({

    number_point :{type: Number, unique: true, require: true},
    coordinates: {type: [Number], require: true},
    address: {type: String, require: true},
    description: {type: String, require: true}
});

MeasuringPointWaterStateSchema.set('toObject', { virtuals: true });
MeasuringPointWaterStateSchema.set('toJSON', { virtuals: true });


const MeasuringPoint = model('MeasuringPointWaterStateSchema', MeasuringPointWaterStateSchema);

module.exports = MeasuringPoint;
 