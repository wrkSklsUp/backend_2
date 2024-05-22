// Модель данных описывающая flurometr
// ( На этапе согласования!)
const { Schema, model } = require('mongoose');

const FlurometrDataSchema = new Schema({

    flurometr_name: {type: String, unique: true}, 
    flurometr_point: {type: Schema.Types.ObjectId, ref: 'MeasuringPointWaterState'}

});

FlurometrDataSchema.set('toObject', { virtuals: true });
FlurometrDataSchema.set('toJSON', { virtuals: true });

const FlurometrInfo = model('FlurometrData', FlurometrDataSchema);

module.exports = FlurometrInfo;