const userServiceClass = require('../service/user-service');
const isAdmin = require('../service/userAccess-service');

const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('../service/mail-service.js');
const tockenService = require('../service/tocken-service.js');
const UserDto = require('../dtos/user-dto');
const UserEditorDto = require('../dtos/userEditor-dto');
const ApiError = require('../exceptions/api-error');
const userModel = require('../models/user-model');
const { validationResult } = require('express-validator');

const userService = new userServiceClass(
  bcrypt, 
  uuid, 
  mailService, 
  tockenService, 
  UserDto, 
  UserEditorDto, 
  ApiError, 
  userModel
);

class UserController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) next(ApiError.BadRequest('Ошибка валидации', errors.array()));

      const {name_organization, email, password, available_points} = req.body;
      const userData = await userService.registration(name_organization, email, password, available_points);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 432000,
        httpOnly: true,
        path:'/api/set_acc'
      });

      res.json(userData);
      
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password} = req.body;
      const userData = await userService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 432000,
        httpOnly: true,
        path:'/api/set_acc'
      });
      console.log("USER LOGIN");
      res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  // Вход в учетную запись Админ (Доступно только для Админ) Согласовать добавление ЛОГИРОВАНИЯ
  // (так же при вызове данного метода должна быть отправленна инф-я на (корпоратив. эл. почту)
  // о том что, был выполнен вход в учетную запись Админа, так же данная инф-я логируется)
  async loginEditor(req, res, next){
    
    try {
      const { email, password} = req.body;
      const userData = await userService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 432000,
        httpOnly: true,
        path:'/api/set_acc'
      });

      res.json(userData)
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    const {refreshToken} = req.cookies;
    try {
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');

      res.json(token);
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    
    try {
        const activation_link = req.params.link;

        await userService.activate(activation_link);

        res.redirect(process.env.CLIENT_URL);

    } catch (error) {
      next(error)
    }
  }

  async refresh(req, res, next) {

    try {
      const user  = req.validationResult;

      const userData = await userService.refresh(user);

      // TODO: Запрос очистить куки от старого токена (пользователь)
      res.clearCookie('refreshToken');

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 432000,
        httpOnly: true,
        path:'/api/set_acc'
      });

      res.json(userData)

    } catch (error) {
        next(error);
    }
  }

  // Получить данные о конкретном пользователе (Доступно для Админ)
  async getUser(req, res, next) {

    const {email} = req.query;
    
    try {

      await isAdmin(req.user.id);
      const user = await userService.getUser(email);
      res.json(user);

    } catch (error) {
      next(error)
    }
  }

  async getUsers(req, res, next) {

    try {

      await isAdmin(req.user.id);
      const users = await userService.getAllUsers(access);
      res.json(users)

    } catch (error) {
      next(error);
      // TODO: Добавить редирект на окно перелогина
    }
  }

   // Изменить информацию о пользователе (Доступно для Админ)
  async updateUser(req, res, next) {
    const {name_organization, email, password, available_point, _id } = req.body;
    const access  = req.user.id; 

    try {
      const user = await userService.updateUserProfile(
        access,
        name_organization, 
        email, 
        password, 
        available_point, 
        _id);
      res.json(user);
    } catch (error) {
      next(error)
    }
  }

  // Удалить пользователя (Доступно для Админ)
  async deleteUser(req, res, next){
    const access  = req.user.id; 
    const {_id} = req.body; // ID пользователя который должен быть удален

    try{

      const user = await userService.deleteUser(_id, access);
      res.json(user);
    }catch(error){
      next(error);
    }
  }

  // Регистрация Админ (Доступно для Админ)
  // TODO: См. user-service (registrationEditor)
  async registrationEditor(req, res, next){
    
    try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) next(ApiError.BadRequest('Ошибка валидации', errors.array()));

    const{name_organization, email, password, available_points} = req.body;

    const userEdidorData = await userService.registrationEditor(
      name_organization, 
      email, 
      password, 
      available_points);

      res.cookie('refreshToken', userEdidorData.refreshToken, {
        maxAge: 432000,
        httpOnly: true,
        path:'/api/set_acc'
      });

    res.json(userEdidorData);
    }catch(error){

      next(error);
    }

  }
}

module.exports = new UserController;
