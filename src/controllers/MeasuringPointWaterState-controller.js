const measuringPointClass = require('../service/MeasuringPointWaterState-service');
const isAdmin = require('../service/userAccess-service');

const measuringPointWaterStateModel = require('../models/MeasuringPointWaterState-model.js');
const ApiError = require('../exceptions/api-error');
const MeasuringPointDTO = require('../dtos/MeasuringPoint-dto');

const measuringPointService = new measuringPointClass(measuringPointWaterStateModel, ApiError, MeasuringPointDTO);

class MeasuringPointWaterStateController{

      // Получить информацию о конкретной точке измерения
    async getMeasuringPoint(req, res, next){
        const {number_point} = req.query;
        try{
            const measurmentPoint = await measuringPointService.getMeasuringPoint(number_point);
            res.json(measurmentPoint);
        }catch(error){
            next(error);
        }
    }

    // Получить информацию Список [] Об о всех точках измерения
    async getAllMeasuringPoints(req, res, next){
        try{
            const measurmentPointList = await measuringPointService.getAllMeasuringPoints();
            res.json(measurmentPointList);
        }catch(error){
            next(error);
        }
    }

    // Добавить информацию о новой точке измерения (Доступно для Admin)
    async createMeasuringPoint(req, res, next){
        const{number_point, coordinates, address, description} = req.body;
        const access  = req.user.id;

        try{
            await isAdmin(access);
            const result = await measuringPointService.createMeasuringPoint(
                number_point, 
                coordinates, 
                address,
                description
            );
            res.json(result);
        }catch(error){  
            next(error);      
        }
    }

    // Обновить информацию о точки измерения (Доступно для Admin)
    async updateMeasuringPoint(req, res, next){
        const {_id, number_point, coordinates, address, description} = req.body;
        const access  = req.user.id;
        try
        {
            await isAdmin(access);
            const result = await measuringPointService.updateMeasuringPoint(
                _id, 
                number_point, 
                coordinates, 
                address, 
                description
            );
            res.json(result);
        }catch(error){
            next(error);
        }
   }
   
   // Удалить информацию о точке измерения (Доступно для Admin)
   async deleteMeasuringPoint(req, res, next){
    const {_id} = req.body;
    const access  = req.user.id;

    try{
        await isAdmin(access);
        const result = await measuringPointService.deleteMeasuringPoint(_id);
        res.json(result);
    }catch(error){
        next(error);
    }
   }
}

module.exports = new MeasuringPointWaterStateController