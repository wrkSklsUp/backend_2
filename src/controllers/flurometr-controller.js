const flurometrModel = require('../models/flurometr-model.js');
const measuringPointModel = require('../models/MeasuringPointWaterState-model.js');
const ApiError = require('../exceptions/api-error.js');
const fluorimetrDto = require('../dtos/flurometr-dto.js')
const flurometrServiceClass = require('../service/flurometr-service.js');

const flurometrServiceObj = new flurometrServiceClass(flurometrModel,fluorimetrDto, measuringPointModel, ApiError);

class FlurometrController{

    async addFlurometrInfo(req, res, next){

        try{

            const {number_point, flurometr_name} = req.body;

            const result = await flurometrServiceObj.addFlurometrInfo(number_point, flurometr_name);
            return res.json(result);

        }catch(error){
            next(error);
        }
    }


    async getFlurometrInfo(req, res, next){

        try{

            const {flurometr_name} = req.query;

            const result = await flurometrServiceObj.getFlurometrInfo(flurometr_name);
            return res.json(result);

        }catch(error){
            next(error);
        }
    }
}

module.exports = new FlurometrController();