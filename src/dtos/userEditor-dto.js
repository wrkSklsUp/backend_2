module.exports = class UserEditorDto {
    name;
    email;
    id;
    is_activated;
    constructor(model){
      this.name = model.name_organization;
      this.email = model.email;
      this.id = model._id;
      this.is_activated = model.is_activated;
    }
  }
