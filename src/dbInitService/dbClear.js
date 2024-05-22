const UserModel = require('../models/user-model');
const measuringPointWaterStateModel = require('../models/MeasuringPointWaterState-model');
const WaterStateModel = require('../models/WaterState-model');

const clearDataClass = require('./tstDropDtaDB.js');
const clearDataClassObj = new clearDataClass(UserModel, measuringPointWaterStateModel, WaterStateModel);

const clearData = async() => {
    await clearDataClassObj.clearWaterStateTable();
    await clearDataClassObj.clearMeasuringPointTable();
    await clearDataClassObj.clearUserTable();
} 

module.exports = clearData