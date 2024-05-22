
/** Поля класса WaterStateService принимаю значение НЕ ОБЪЕКТОВ, а классов:
 * - WaterStateModel из WaterState-model.js
 * - waterstateDeshboard из WaterStateDashboard-dto.js
 * - charBars из CharBarsObjClass-dto.js
 * - measuringPointWaterStateModel из MeasuringPointWaterState-model.js
 * - filteredWaterStateModel из FilterdWaterState-model.js
 * - userModel из user-model.js
 * - ApiError из api-error.js
 */

module.exports = class WaterStateService {

    constructor(
        WaterStateModel, 
        waterstateDeshboard, 
        charBars,
        measuringPointWaterStateModel, 
        filteredWaterStateModel, 
        userModel, 
        ApiError
    ){
        this.WaterStateModel = WaterStateModel;
        this.waterstateDeshboard = waterstateDeshboard;
        this.charBars = charBars;
        this.measuringPointWaterStateModel = measuringPointWaterStateModel;
        this.filteredWaterStateModel = filteredWaterStateModel;
        this.userModel = userModel;
        this.ApiError = ApiError;
    }

    async getReqOWENCloudToWaterState(){
        /*
            Realization!
        */
    }

    /* Получить информацию за год (по месяцам) с конкретной точки измерения

    (Предпологается наличие worker который рассчитывает среднее значение за конкретный мeсяц,
    и сохраняет его в базу в таблицу filteredWaterStateModel, данный метод взаимодействует 
    с таблицей filteredWaterStateModel,данная таблица содержит в себе следующие поля:
    
    measurement_point (ObjectId)
    temperature
    acidity
    salt_level
    redox_potential
    oxygen_level
    light_transmittance
    date
                            Метод работает с Уже отфильтрованными данными

    данный метод формирует массив данных в котором есть от 1 до 12 записей соотв-щие каждому месяцу года,
    в качестве аргументов он принимает id точки измерения, в качестве 2-го аргумента данная ф-ция принимает 
    Дату, а именно важен год, это тот период за который будет браться значение от 1-го до 12-го месяца)
    */
    async getWaterStateInfoByMonth(measurement_point, year){

        if(!measurement_point) throw this.ApiError.BadRequest("Укажите номер нужной точки измерения");

        const measuring_id = await this.measuringPointWaterStateModel.findOne({number_point:measurement_point});

        if(!measuring_id) throw this.ApiError.BadRequest("Точки измерения с таким номером не существует");

        const result_list = await this.filteredWaterStateModel.find({measurement_point:measuring_id.id});

        if(!result_list[0]) throw this.ApiError.BadRequest("Для указанной точки информация не была найдена");


        const indicators = [        
            "temperature",
            "acidity", 
            "salt_level", 
            "redox_potential", 
            "oxygen_level", 
            "light_transmittance",
        ]

        const months = new Map(
            [["1","Январь"], 
            ["2","Февраль"], 
            ["3","Март"], 
            ["4","Апрель"], 
            ["5","Май"], 
            ["6","Июнь"], 
            ["7","Июль"], 
            ["8","Август"], 
            ["9","Сентябрь"], 
            ["10","Октябрь"], 
            ["11","Ноябрь"], 
            ["12","Декабрь"]]
        );
        
        let finalObgList = [];
        let firstMonth;
        let lastMonth;
        let monthCounter = 0;

        for(let i = 0; i<indicators.length; i++){
            let finalObj = new this.charBars(indicators[i]);

            for(let index = 0; index<result_list.length; index++){
                if(result_list[index].date.split(",")[0].split(".")[2] == year){

                    if(monthCounter==0){
                        firstMonth = months.get(result_list[index].date.split(",")[0].split(".")[1]);
                        monthCounter++;
                    }

                    lastMonth = months.get(result_list[index].date.split(",")[0].split(".")[1]);


                    let chartObj = {
                        ch:result_list[index][indicators[i]],
                        month:months.get(result_list[index].date.split(",")[0].split(".")[1])
                    }
    
                    finalObj.chart[index] = chartObj;

                    if(index==result_list.length-1){
                        let interval = `${firstMonth}-${lastMonth} ${year}`
                        finalObj.interval = interval;

                    }

                }
            }
    
            finalObgList[i] = finalObj;
        }

        return finalObgList;
    }


    /** Данная ф-ция Рассчитывает по полученным Отфильтрованным данным среднегодовое значение и возвращает его 
    * в виде {name: "Indicator", value: Number}, в качестве аргументов принимает id точки измерения и Год за 
    * который нужно получить данные
    */
    async getWaterStateYearInfoForDeshboard(measurement_point, year){

        if(!measurement_point) throw this.ApiError.BadRequest("Укажите номер нужной точки измерения");

        if(!year) throw this.ApiError.BadRequest("Укажите год за который нужно получить информацию");

        const measuring_id = await this.measuringPointWaterStateModel.findOne({number_point: measurement_point});

        if(!measuring_id) throw this.ApiError.BadRequest("Точки измерения с таким номером не существует");

        const arr = await this.filteredWaterStateModel.find({measurement_point: measuring_id.id});

        if(!arr[0]) throw this.ApiError.BadRequest("Для указанной точки информация не была найдена");

        const indicators = new Map(        
            [["temperature",[0,0]],
            ["acidity", [0,0]],
            ["salt_level", [0,0]], 
            ["redox_potential", [0,0]],
            ["oxygen_level", [0,0]],
            ["light_transmittance",[0,0]]]
        );
    
        let finalDashboardList = [];
        let finalDashIndex = 0;

        for(let key of indicators.keys()){
            for(let index = 0; index<arr.length; index++){
                if(arr[index].date.split(",")[0].split(".")[2] == year){
    
                    indicators.get(key)[0] += arr[index][key];
    
                    if(arr[index][key] != NaN && arr[index][key] != 0){
                        indicators.get(key)[1] += 1;
                    }
                
                }
            }
    
            let name = key;
            let value = indicators.get(key)[0]/indicators.get(key)[1];
    
            let finalObj = new this.waterstateDeshboard(name, value.toFixed(1));
            finalDashboardList[finalDashIndex] = finalObj;
    
            finalDashIndex++;
        }
        
        return finalDashboardList;
    }

    // Добавить запись о состоянии воды 
    async postWaterStateData(
        measurement_point, 
        temperature, 
        acidity, 
        salt_level, 
        redox_potential,
        oxygen_level, 
        light_transmittance, 
        access){

        if(!measurement_point) throw this.ApiError.BadRequest("Id точки измерения не указан");

        const checkMeasurePoint = await this.measuringPointWaterStateModel.find({_id:measurement_point});
        if(!checkMeasurePoint[0]) throw this.ApiError.BadRequest("По указанному id не было найдено точки измерения");
        
        const tokenHolder = await this.userModel.findOne({_id:access});
        if(!tokenHolder) throw this.ApiError.BadRequest("Данный пользователь не зарегистрирован, зарегистрируйтесь");
            
        if(tokenHolder.access_level != 1) throw this.ApiError.ForbiddenError('В доступе отказанно!');

        const waterState = await this.WaterStateModel.create({
            measurement_point, 
            temperature, 
            acidity, 
            salt_level, 
            redox_potential,
            oxygen_level, 
            light_transmittance
        });

        return waterState;
    }

    // Обновить данные о состоянии воды
    async updateWaterStateData( 
        id,
        measurement_point, 
        temperature, 
        acidity, 
        salt_level, 
        redox_potential,
        oxygen_level, 
        light_transmittance, 
        access){

        if(!id) throw this.ApiError.BadRequest("Укажите id записи");
        if(!measurement_point) throw this.ApiError.BadRequest("Id точки измерения не указан");

        const checkId = await this.WaterStateModel.find({_id:id});
        console.log(checkId);
        
        if(!checkId[0]) throw this.ApiError.BadRequest("По указанному id не было найдено записи состояния воды");

        const checkMeasurePoint = await this.measuringPointWaterStateModel.find({_id:measurement_point});
        if(!checkMeasurePoint[0]) throw this.ApiError.BadRequest("По указанному id не было найдено точки измерения");
            

        const tokenHolder = await this.userModel.findOne({_id:access});
        if(!tokenHolder) throw this.ApiError.BadRequest("Данный пользователь не зарегистрирован, зарегистрируйтесь");
                
        if(tokenHolder.access_level != 1) throw this.ApiError.ForbiddenError('В доступе отказанно!');
        
        const result = await this.WaterStateModel.findOneAndUpdate(id,{
            measurement_point, 
            temperature, 
            acidity, 
            salt_level, 
            redox_potential,
            oxygen_level, 
            light_transmittance
        });

        return result;
        
    }

    async deleteWaterStateData(id, access){ 

        if(!id) throw this.ApiError.BadRequest("Укажите id записи");

        const checkId = await this.WaterStateModel.find({_id:id});
        if(!checkId[0]) throw this.ApiError.BadRequest("По указанному id не было найдено записи состояния воды");

        const tokenHolder = await this.userModel.findOne({_id:access});
        if(!tokenHolder) throw this.ApiError.BadRequest("Данный пользователь не зарегистрирован, зарегистрируйтесь");
            
        if(tokenHolder.access_level != 1) throw this.ApiError.ForbiddenError('В доступе отказанно!');

        const result = await this.WaterStateModel.deleteOne({_id:id});

        return result;
    }

}