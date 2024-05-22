const { Schema, model } = require('mongoose');

const UserSchema = new Schema({
  
  name_organization: { type: String, max: 100, required: true},
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  available_points:{ type: [{type: Schema.Types.ObjectId, ref: 'MeasuringPointWaterState'}] },

  access_level: { type: Number, default: '0', required:true },
  is_activated: { type: Boolean, default: false },
  activation_link: { type: String },
  update: { type: String, default: new Date().toLocaleString('de-RU') }

});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

UserSchema
  .virtual('fullName')
  .get(function () {
    if (!(this.name_organization)) return;
    return `${this.name_organization}`;
  });

UserSchema
  .virtual('url')
  .get(function () {
    return `/author?id=${this._id}`;
  });

const user = model('User', UserSchema);
module.exports = user;
