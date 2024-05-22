const ApiError = require('../exceptions/api-error');
const tockenService = require('../service/tocken-service');

module.exports = function(req, res, next) {
   
  try {
    const refreshToken  = req.cookies.refreshToken;
     if (!refreshToken) throw ApiError.UnauthorizedError("refreshToken не был получен");

    const validationResult = tockenService.validateRefreshToken(refreshToken);
    if (!validationResult) throw ApiError.UnauthorizedError("Передаваемый refreshToken не валиден");
      
    req.validationResult = validationResult;
    next();

    } catch (error) {
      next(error);
  }
}