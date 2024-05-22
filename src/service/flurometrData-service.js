// Сервис для работы с Данными поступающими от Флюрометра

/** 1. Добавить запись с данными от Флюрометра
 *  2. Удалить запись с данными от Флюрометра
 *  3. Изменить запись с данными от Флюрометра
 */

module.exports = class FlurometrDataService{

    constructor(flurometrDataModel, ApiError, flurometrDataDTO, flurometrModel){

        this.flurometrDataModel = flurometrDataModel,
        this.ApiError = ApiError,
        this.flurometrDataDTO = flurometrDataDTO,
        this.flurometrModel = flurometrModel
    }

    // Получить Последние данные для конкретного Флуориметра 
    async getLasFlurometrDataByFlurometrId(flurometr_name){

        if(!flurometr_name) throw this.ApiError.BadRequest("Вы неуказали имя Флуориметра");

        const flur_inf = await this.flurometrModel.findOne({flurometr_name:flurometr_name});

        if(!flur_inf) throw this.ApiError.BadRequest("Флуориметр с таким именем не зарегистрирован в системе!")
         
        const result = await this.flurometrDataModel.find({flurometr_name:flur_inf.id});
        
        if(!result[0]) throw this.ApiError.NotFound("Запрашиваемые данные не были найденны");

        return new this.flurometrDataDTO(
            result[result.length - 1].date, 
            result[result.length - 1].flurometr_name, 
            result[result.length - 1].flurometr_data
        );
    }

    // В РАЗРАБОТКЕ!
    // Получение данных для конкретного Флуориметра определенный период
    async getFlurometrDataOnDate(id_flurometr, date){

    }
    
    // В РАЗРАБОТКЕ!
    // Получить Последние данные для конкретного Флуориметра
    async getLastFluorimetrData(id_flurometr){

    }

    
    async addFlurometrData(flurometr_name, flurometr_data, date){

        if(!flurometr_name) throw this.ApiError.BadRequest("Вы не указали имя Флуориметра");
         
        const id_flurometr = await this.flurometrModel.findOne({flurometr_name: flurometr_name});
        
        if(!id_flurometr) throw this.ApiError.NotFound("Флуориметр с таким именем не зарегистрирован в системе!");

        if(!flurometr_data) throw this.ApiError.BadRequest("Вы не указали Данные от Флуориметра!");

        if(!date) throw this.ApiError.BadRequest("Вы не указали Дату сбора данных!");


        const result = await this.flurometrDataModel.create(

            {   
                flurometr_name: id_flurometr.id, 
                flurometr_data: flurometr_data,
                date: date
            }
        );

        if(!result) throw ApiError.BadRequest("Данные от флурометра не були успешно сохранены");

        return new this.flurometrDataDTO(result.date, result.flurometr_name, result.flurometr_data);
    }

    // В РАЗРАБОТКЕ!
    async updateFlurometrData(id_flurometr, Fv_Fm, date){

    }

    // В РАЗРАБОТКЕ!
    // Удалить запись с данными полученными от Флюрометра за конкретную дату
    async deleteFlurometrData(id_flurometr, date){
        /**
         * 1. Выполнить поиск в FlurometrDataModel записи по id_flurometr, и date
         * 2. Поверить результат поиска (Если запись не найдена -> Exception, в ином случае 
         *    удалить найденую запись)
        */
    }
}