const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TockenService {

  generateTokens(payload){
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '120s'});
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '120s'});
    return {
      accessToken,
      refreshToken,
    }
  }

  validateAccessToken(token){
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token){
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      return userData;
    } catch (error) {
      return null
    }
  }

  async saveToken(userId, refreshToken){
    const tokenData = await tokenModel.findOne({user: userId});
    if(tokenData){
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    await tokenModel.create({user: userId, refreshToken});
  }

  async removeToken(refreshToken){
    const tokenData = await tokenModel.deleteOne({refreshToken});
    return tokenData;
  }

  async findTokenAccessToken(accessToken){
    const tokenData = await tokenModel.findOne({accessToken:accessToken});
    return tokenData;
  }

  async findTokenRefreshToken(refreshToken){
    const tokenData = await tokenModel.findOne({refreshToken:refreshToken});
    return tokenData;
  }

  async findRefreshTokenByUserId(userId){
    const refToken = await tokenModel.findOne({user:userId});
    return refToken;
  }

}

module.exports = new TockenService;
