const waterStateServiceClass = require('../service/WaterState-service');

const WaterStateModel = require('../models/WaterState-model.js');
const waterstateDeshboard = require('../dtos/WaterStateDashboard-dto'); 
const charBars = require("../dtos/CharBarsObjClass-dto");
const measuringPointWaterStateModel = require('../models/MeasuringPointWaterState-model');
const filteredWaterStateModel = require("../models/FilterdWaterState-model");
const userModel = require('../models/user-model');
const ApiError = require('../exceptions/api-error');

const waterStateService = new waterStateServiceClass(
    WaterStateModel, 
    waterstateDeshboard, 
    charBars, 
    measuringPointWaterStateModel, 
    filteredWaterStateModel, 
    userModel, 
    ApiError
);


class WaterStateController {

    // Добавить запись о состоянии воды (Доступно для Редактор)
    async addWaterStateInfo(req, res, next) {
        const {
            measurement_point,
            temperature,
            acidity,
            salt_level,
            redox_potential,
            oxygen_level,
            light_transmittance} = req.body;
            const access  = req.user.id;
        try{
            const waterState = await waterStateService.postWaterStateData(
                measurement_point,
                temperature,
                acidity,
                salt_level,
                redox_potential,
                oxygen_level,
                light_transmittance,
                access)
                res.json(waterState);

        }catch(error){
            next(error)
        }
    }

    // Удалить запись о состоянии воды (Доступно для Редактор)
    async deleteWaterStateData(req, res, next){
        const {_id} = req.body
        const access  = req.user.id;

        try{
            const result = await waterStateService.deleteWaterStateData(_id, access);
            res.json(result);
        }
        catch(error){
            next(error);
        }

    }

    //Обновить запись о состоянии воды (Доступно для Редактор)
    async updateWaterState(req, res, next){
        const {
            _id,
            measurement_point, 
            temperature, 
            acidity, 
            salt_level, 
            redox_potential,
            oxygen_level, 
            light_transmittance} = req.body;
            const access  = req.user.id;
        try{
            const result = await waterStateService.updateWaterStateData(
                _id,
                measurement_point, 
                temperature, 
                acidity, 
                salt_level, 
                redox_potential,
                oxygen_level, 
                light_transmittance,
                access);

            res.json(result);

        }catch(error){
            next(error);
        }
    }

    getInfoWaterStateOWENCloud(){}

    // Получить информацию об состоянии воды в конкретной точке за определенную дату (Доступно для Пользователь)
    async getWaterStateInfoOnDay(req, res, next){
        const {measurement_point, date} = req.body;

        try{
            const measuringInfo = await waterStateService.
            getWaterStateInfoOnDay(measurement_point, date);
            res.json(measuringInfo);
        }catch(error){
            next(error)
        }
    }

    // Получить информацию о состоянии воды в конкретной точке за все время (Доступно для Пользователь)
    async getWaterStateYearInfoForDeshboard(req, res, next){
        const {measurement_point, year} = req.query;

        try{
            const result = await waterStateService.getWaterStateYearInfoForDeshboard(measurement_point, year);
            res.json(result);

        }catch(error){
            next(error);
        }
    }

    async getWaterStateInfoByMonth(req, res, next){
        const {measurement_point, year} = req.query;
        try{
            const result = await waterStateService.getWaterStateInfoByMonth(measurement_point, year);
            res.json(result);

        }catch(error){
            next(error);
        }
    }
}


module.exports = new WaterStateController;