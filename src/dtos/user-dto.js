module.exports = class UserDto {
  email;
  id;
  is_activated;
  available_points;
  constructor(model){
    this.email = model.email;
    this.id = model.id;
    this.is_activated = model.is_activated;
    this.available_points = model.available_points;
  }
}
