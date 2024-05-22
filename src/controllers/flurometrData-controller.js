const flurometrDataModel = require('../models/flurometrData-model.js');
const ApiError = require("../exceptions/api-error.js");
const flurometrDataDTOClass = require("../dtos/flurometrData-dto.js");
const flurometrModel = require('../models/flurometr-model.js');
const flurometrDataServiceClass = require("../service/flurometrData-service.js");

const flurometrDataServiceObj = new flurometrDataServiceClass(
    flurometrDataModel, 
    ApiError, 
    flurometrDataDTOClass, 
    flurometrModel
);

class FlurometrDataController{

    // Получить все данные из таблици flurometrDataModel для конкретного Флюриметра
    async getLastFlurometrDataById(req, res, next){

        const {flurometr_name} = req.query;

        try{

            const result = await flurometrDataServiceObj.getLasFlurometrDataByFlurometrId(flurometr_name);
            res.json(result);

        }catch(error){
            next(error);
        }
    }

    // В РАЗРАБОТКЕ!
    async getFlurometrDataOnDate(req, res, next){
        const {id_flurometr, date} = req.body;
        try{
            const result = await flurometrDataServiceObj.getFlurometrDataOnDate(id_flurometr, date);
            // res.json(result);
        }catch(error){
            next(error);
        }
    }

    // Добавить информацию в таблицу данных от Флюриметра
    async addFlurometrData(req, res, next){

        const{token, data, date} = req.body;

        try{

            const result = await flurometrDataServiceObj.addFlurometrData(token, data, date);
            res.json(result);

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