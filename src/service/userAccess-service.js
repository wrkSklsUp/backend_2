const userModel = require('../models/user-model');
const ApiError = require('../exceptions/api-error');

let isAdmin = async (access) => {
    const tokenHolder = await userModel.findOne({_id:access});
    if(!tokenHolder) throw ApiError.BadRequest("Данный пользователь не зарегистрирован, зарегистрируйтесь");
        
    if(tokenHolder.access_level != 1) throw ApiError.ForbiddenError('В доступе отказанно!');
}


module.exports = isAdmin;