module.exports = class ApiError extends Error {
  status;
  errors;

  constructor(status, message, errors = []){
    super(message);
    this.status = status;
    this.errors = errors;
  }

  // Не верная авторизация
  static UnauthorizedError(message, errors){
    return new ApiError(401, message, errors);
  }

  // Клиент не имеет прав доступа 
  static BadRequest(message, errors){
    return new ApiError(400, message, errors);
  }

  // Ошибка Доступа
  static ForbiddenError(message, errors){
    return new ApiError(403, message, errors)
  }

  // Запрашиваемый ресурс не найден
  static NotFound(message, errors){
    return new ApiError(404, message, errors);
  }
}
