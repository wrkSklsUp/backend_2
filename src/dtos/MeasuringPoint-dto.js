module.exports = class MeasuringPointDTO {
  id;
  address;
  number_point;
  description;
  coordinates;
  constructor(model){
    this.id = model._id;
    this.number_point = model.number_point;
    this.address = model.address;
    this.description = model.description;
    this.coordinates = model.coordinates;
  }
}