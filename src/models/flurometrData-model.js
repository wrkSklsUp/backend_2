// Модель описывающая данные поступающие с Флурометра

const { Schema, model } = require('mongoose');

const FlurometrDataSchema = new Schema({

    flurometr_name: {type: Schema.Types.ObjectId, ref: 'flurometrModel'},
    flurometr_data: [Number],
    date: {type: String}

});

FlurometrDataSchema.set('toObject', { virtuals: true });
FlurometrDataSchema.set('toJSON', { virtuals: true });

const FlurometrData = model('FlurometrDataSchema', FlurometrDataSchema);

module.exports = FlurometrData;