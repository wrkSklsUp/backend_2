const flurometrDataModel = require('../models/flurometrData-model.js');
const ApiError = require("../exceptions/api-error.js");
const flurometrDataDTOClass = require("../dtos/flurometrData-dto.js");
const flurometrModel = require('../models/flurometr-model.js');
const flurometrDataServiceClass = require("../service/flurometrData-service.js");
const memcache = require("../memcachConnector.js");

const flurometrDataServiceObj = new flurometrDataServiceClass(
    flurometrDataModel, 
    ApiError, 
    flurometrDataDTOClass, 
    flurometrModel,
    memcache
);

class FlurometrDataController{

    // Получить последние актуальные данные от флуориметра
    async getLastFlurometrDataById(req, res, next){

        const {flurometr_name} = req.query;

        try{

            const result = await flurometrDataServiceObj.getLatestCachedFlurometrData(flurometr_name);
            res.json(result);

        }catch(error){
            next(error);
        }
    }

    // Добавить информацию в таблицу данных от Флюриметра
    async addFlurometrData(req, res, next){

        const{token, data, date} = req.body;

        try{

            const result = await flurometrDataServiceObj.addFlurometrData(token, data, date);
            await flurometrDataServiceObj.chacheLatestFlurometrData(token, req.body);
            res.json(result);

        }catch(error){
            next(error);
        }
    }

    // Получить последние средне-квадратичное значение от флуориметра
    async getLatestAverageValueFlurometrData(req, res, next){
        try{
            // TODO: Cache Call!
        }catch(error){
            next(error);
        }
    }

    // В РАЗРАБОТКЕ!
    async updateFlurometrData(req, res, next){

    }

    // В РАЗРАБОТКЕ!
    async deleteFlurometrData(req, res, next){

    }
}

module.exports = new FlurometrDataController();