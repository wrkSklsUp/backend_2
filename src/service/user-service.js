
module.exports = class UserService {
  constructor(
    bcrypt, 
    uuid, 
    mailService, 
    tockenService, 
    UserDto, 
    UserEditorDto, 
    ApiError, 
    userModel
  )
    {
      this.bcrypt = bcrypt;
      this.uuid = uuid;
      this.mailService = mailService;
      this.tockenService = tockenService;
      this.UserDto = UserDto;
      this.UserEditorDto = UserEditorDto;
      this.ApiError = ApiError;
      this.userModel = userModel;
    }


  // Регистрация пользователя
  async registration(name_organization, email, password, available_points) {

    const candidate = await this.userModel.findOne({email});
    if (candidate) throw this.ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);

    const hashPassword = await this.bcrypt.hash(password, 3);
    const activation_link = this.uuid.v4();

    const user = await this.userModel.create({
      name_organization,
      email,
      password: hashPassword,
      available_points,
      activation_link: activation_link,
    });

    await this.mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activation_link}`);
    const userDto = new this.UserDto(user);

    const tocens = this.tockenService.generateTokens({ ...userDto });

    await this.tockenService.saveToken(userDto.id, tocens.refreshToken);

    return { ...tocens, user: userDto }
  }

  async activate(activation_link) {

    const user = await this.userModel.findOne({ activation_link });
    if (!user) throw this.ApiError.BadRequest('Неккоректная ссылка активации');

    user.is_activated = true;
    await user.save();
  }

  async login(email, password) {

    const user = await this.userModel.findOne({ email });
    if (!user) throw this.ApiError.BadRequest('Пользователь с таким email небыл найден');

    const isPassEquals = await this.bcrypt.compare(password, user.password);
    if (!isPassEquals) throw this.ApiError.BadRequest('Неверный пароль');

    const userDto = new this.UserDto(user);

    const tokens = await this.tockenService.generateTokens({ ...userDto });

    await this.tockenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    if (!refreshToken) throw this.ApiError.UnauthorizedError("refreshToken не был получен");
    const token = this.tockenService.removeToken(refreshToken);
    return token;
  }

  async refresh(user) {

    const userDto = new this.UserDto(user);

    // Удалить старый refreshToken 
    const refToken = await this.tockenService.findRefreshTokenByUserId(userDto.id);
    if(!refToken) throw this.ApiError.BadRequest("Для данного пользователя нет refreshToken!");
    await this.tockenService.removeToken(refToken.refreshToken);

    // Создание нового refreshToken
    const tokens = await this.tockenService.generateTokens({ ...userDto });

    // Сохранение refreshToken
    await this.tockenService.saveToken(userDto.id, tokens.refreshToken);
    return { ...tokens, user: userDto };
  }

  async getAllUsers(access) {

    const tokenHolder = await this.userModel.findOne({_id:access});
    if(!tokenHolder) throw this.ApiError.BadRequest("Данный пользователь не зарегистрирован, зарегистрируйтесь");
    
    if(tokenHolder.access_level != 1) throw this.ApiError.BadRequest('В доступе отказанно!');

    const users = await this.userModel.find();

    const usersDtos = [];
    for(let i = 0; i<users.length; i++){
      usersDtos[i] = new this.UserDto(users[i]);
    }
    return usersDtos;
  }

  async getUser(user_email){
    
    if (!user_email) throw this.ApiError.BadRequest('Укажите email пользователя');

    const user = await this.userModel.findOne({email: user_email});

    if(!user) throw this.ApiError.BadRequest("Пользователь с таким email небыл найден");

    return new this.UserDto(user);
  }

  async updateUserProfile(access, name_organization, email, password, available_point, id) {

    const tokenHolder = await this.userModel.findOne({_id:access});
    if(!tokenHolder) throw this.ApiError.BadRequest("Данный пользователь не зарегистрирован, зарегистрируйтесь");
    
    if(tokenHolder.access_level != 1) throw this.ApiError.BadRequest('В доступе отказанно!');

    if (!id) throw this.ApiError.BadRequest('Укажите id нужной записи');
    const hashPassword = await this.bcrypt.hash(password, 3);

    const user = await this.userModel.findByIdAndUpdate(id, {
      $set: {
        name_organization,
        email,
        password:hashPassword,
        available_point,
        update: new Date().toLocaleString('de-RU'),
      }
    },
      {
        new: true,
        useFindAndModify: false
      });
      if(!user) throw this.ApiError.BadRequest("Пользователь с таким Id небыл найден");

    return new this.UserDto(user);
  }

  async deleteUser(id, access){

    const tokenHolder = await this.userModel.findOne({_id:access});
    if(!tokenHolder) throw this.ApiError.BadRequest("Данный пользователь не зарегистрирован, зарегистрируйтесь");
    
    if(tokenHolder.access_level != 1) throw this.ApiError.BadRequest('В доступе отказанно!');

    if(id == access) throw this.ApiError.BadRequest("Администратор не может удалить свою запись!");

    if (!id) throw this.ApiError.BadRequest('Укажите id нужной записи');

    const result = await this.userModel.deleteOne({_id:id});
    if(result.deletedCount == 0) throw this.ApiError.BadRequest("Запись по указанному id не была найдена");

    return result;

  }

  // Когда на данный api приходит запрос должна отправляться информация на (корпоратив. эл. почту)
  // о том что кто-то пытается зарегистрироваться от имени админа, и дать разрешение на продолжение
  // данной операции может только владелец этого ящика
  async registrationEditor(name_organization, email, password){
      const candidate = await this.userModel.findOne({email, name_organization});

      if (candidate) throw this.ApiError.BadRequest(`Пользователь Редактор с почтовым адресом ${email} уже существует`);

      const hashPassword = await this.bcrypt.hash(password, 3);
      const activation_link = this.uuid.v4();
      const userEditor = await this.userModel.create({
        name_organization,
        email,
        password: hashPassword,
        access_level:1,
        activation_link: activation_link,
      });

      await this.mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activation_link}`);
      const userEditorDto = new this.UserEditorDto(userEditor);

      const tocens = this.tockenService.generateTokens({ ...userEditorDto });

      await this.tockenService.saveToken(userEditorDto.id, tocens.refreshToken);

      return { ...tocens, userEditor: userEditorDto }
  }
}
