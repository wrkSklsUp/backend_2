// Предварительная очистка ДБ
module.exports = class ClearData{

    constructor(
        UserModel, 
        measuringPointWaterStateModel, 
        WaterStateModel
    ){
        this.UserModel = UserModel;
        this.measuringPointWaterStateModel = measuringPointWaterStateModel;
        this.WaterStateModel = WaterStateModel;

    }

    async clearWaterStateTable(){
        const resul = await this.WaterStateModel.find();

        for(let i = 0; i<resul.length; i++){
            await this.WaterStateModel.deleteOne({_id:resul[i]._id});

        }
    }

    async clearMeasuringPointTable(){
        const resul = await this.measuringPointWaterStateModel.find();

        for(let i = 0; i<resul.length; i++){
            await this.measuringPointWaterStateModel.deleteOne({_id:resul[i]._id});

        }
    }

    async clearUserTable(){
        const resul = await this.UserModel.find();

        for(let i = 0; i<resul.length; i++){
            await this.UserModel.deleteOne({_id:resul[i]._id});

        }
    }
}