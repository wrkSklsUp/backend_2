/** Поля класса MeasuringPointWaterStateService принимаю значение НЕ ОБЪЕКТОВ, а классов:
 * - MeasuringPointWaterStateSchema из MeasuringPointWaterState-model.js
 * - ApiError из api-error.js
 * - MeasuringPointDTO из MeasuringPoint-dto.js
 */


module.exports = class MeasuringPointWaterStateService{

    constructor(measuringPointWaterStateModel, ApiError, MeasuringPointDTO){
        this.measuringPointWaterStateModel = measuringPointWaterStateModel;
        this.ApiError = ApiError;
        this.MeasuringPointDTO = MeasuringPointDTO;
    }

    async getMeasuringPoint(number_point){

        if(!number_point) throw this.ApiError.BadRequest("Укажите id необходимой точки измерения");

        const measurmentPoint = await this.measuringPointWaterStateModel.findOne({number_point:number_point});

        if(!measurmentPoint) throw this.ApiError.BadRequest("Запись с указанным id не была найдена"); 

        return new this.MeasuringPointDTO(measurmentPoint);
    }


    // Получить записи об о всех точках измерения
    async getAllMeasuringPoints(){
        const measurmentPointList = await this.measuringPointWaterStateModel.find({}); 
        const wrappMeasuringPointList = [];

        for(let i = 0; i<measurmentPointList.length; i++){
            wrappMeasuringPointList[i] = new this.MeasuringPointDTO(measurmentPointList[i]);
        }

        return wrappMeasuringPointList;
    }


    // Создать запись о точке измерения
    async createMeasuringPoint(number_point, coordinates, address, description){

        if(!number_point) throw this.ApiError.BadRequest('Вы не указали номер точки измерения');

        if(coordinates.length != 2) throw this.ApiError.BadRequest('Не верно указанно значение координат');

        if(!address) throw this.ApiError.BadRequest('Вы не указали адрес точки измерения');

        if(!description) throw this.ApiError.BadRequest('Вы не указали доп. инф-ю о точке измерения');

        const measurmentPoint = await this.measuringPointWaterStateModel.create({
            number_point, coordinates, address, description
        });
  
        const warppCreatedMPoint = new this.MeasuringPointDTO(measurmentPoint);

        return warppCreatedMPoint;        
    }


    // Обновить запись представляющую точку измерения
    async updateMeasuringPoint(id, number_point, coordinates, address, description){

        if(!id) throw this.ApiError.BadRequest("Укажите id нужной записи");

        if(!number_point) throw this.ApiError.BadRequest('Вы не указали номер точки измерения');

        if(coordinates.length != 2) throw this.ApiError.BadRequest('Не верно указанно значение координат');

        if(!address) throw this.ApiError.BadRequest('Вы не указали адрес точки измерения');

        if(!description) throw this.ApiError.BadRequest('Вы не указали доп. инф-ю о точке измерения');
        
        const result = await this.measuringPointWaterStateModel.findByIdAndUpdate(id, { 
            number_point, coordinates, address, description});

        if(!result) throw this.ApiError.BadRequest("Запись по указанному id не была найдена"); 

        const warppCreatedMPoint = new this.MeasuringPointDTO(result);

        return warppCreatedMPoint;
    }


    async deleteMeasuringPoint(id){
        if(!id) throw this.ApiError.BadRequest("Укажите id нужной записи");

        const result = await this.measuringPointWaterStateModel.deleteOne({_id:id}); 
        if(result.deletedCount == 0) throw this.ApiError.BadRequest("Запись по указанному id не была найдена"); 

        return result;
    }
}