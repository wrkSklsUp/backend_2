const ApiError = require('../exceptions/api-error');
const tockenService = require('../service/tocken-service');

module.exports = function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if(!authorizationHeader) throw ApiError.UnauthorizedError("Данные авторизации не указанны в запросе");

    const accessToken = authorizationHeader.split(' ')[1];
    if(!accessToken) throw ApiError.UnauthorizedError("Не авторизованный запрос, accsessToken не получен");

    const userData = tockenService.validateAccessToken(accessToken);
    if(!userData) throw ApiError.UnauthorizedError("Пользователь не авторизован, не валидный accessToken");
    
    req.user = userData;
    next();

  } catch (error) {
    return next(error);
  }
}

