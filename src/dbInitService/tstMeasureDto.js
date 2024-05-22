module.exports = class MeasureDto {
    id;
    number_point;
    coordinates;
    address;
    constructor(model){
      this.id = model._id;
      this.number_point = model.number_point;
      this.coordinates = model.coordinates;
      this.address = model.address;
    }
  }
