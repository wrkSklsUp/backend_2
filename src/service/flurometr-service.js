// Сервис по работе с моделью flurometr 

/**1. Добавить запись о новом Флюрометре
 * 2. Удалить запись о Флюрометре
 * 3. Изменить запись оФлюрометре
 */


module.exports = class FlurometrService{

    constructor(flurometrModel, flurometrDTO, measuringPointModel, ApiError){
        this.flurometrModel = flurometrModel,
        this.flurometrDTO = flurometrDTO;
        this.measuringPointModel = measuringPointModel,
        this.ApiError = ApiError
    }

    async getFlurometrInfo(flurometr_name){

        if(!flurometr_name) throw this.ApiError.BadRequest("Вы не указали имя Флурометра!");

        const flurometrInfo = await this.flurometrModel.findOne({flurometr_name:flurometr_name});

        if(!flurometrInfo) throw this.ApiError.BadRequest("Флуориметр с таким названием отсутствует!");

        return new this.flurometrDTO(flurometrInfo);
    }

    // async deleteFlurometrInfo(){

    // }

    async addFlurometrInfo(number_point, flurometr_name){

        if(!number_point) throw this.ApiError.BadRequest("Вы не указали точку измерения которой принадлежит Флурометр!");

        if(!flurometr_name) throw this.this.ApiError.BadRequest("Вы не указали имя Флурометра!");

        const res = await this.flurometrModel.findOne({flurometr_name:flurometr_name});

        if(res) throw this.ApiError.BadRequest("Флуориметр с таким именем уже зарегистрирован в системе!");

        const measurPointId = await this.measuringPointModel.findOne({number_point:number_point});

        if(!measurPointId) throw this.ApiError.NotFound("Указанной точки измерения не существует!");

        const result = await this.flurometrModel.create(
            {
                flurometr_name: flurometr_name,
                flurometr_point: measurPointId.id
            }
        );

        return new this.flurometrDTO(result);

    }


    // async updateFlurometrInfo(){

    // }
}