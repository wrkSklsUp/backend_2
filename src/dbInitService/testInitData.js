// Внесение тестовых данных в Mongo 
module.exports = class CreateTestRecords{

    constructor(
        UserModel, 
        bcrypt, 
        uuid, 
        measuringPointWaterStateModel, 
        WaterStateModel, 
        MeasureDto, 
        filteredData
    ){
        this.UserModel = UserModel;
        this.bcrypt = bcrypt;
        this.uuid = uuid;
        this.measuringPointWaterStateModel = measuringPointWaterStateModel;
        this.WaterStateModel = WaterStateModel;
        this.MeasureDto = MeasureDto;
        this.filteredData = filteredData;
    }

    async createMeasuringPoint(number_point, coordinates, address, description){

        await this.measuringPointWaterStateModel.create({
            number_point, coordinates, address, description
        });
    }

    async createWaterStatistic (
        number_point, 
        temperature, 
        acidity, 
        salt_level, 
        redox_potential, 
        oxygen_level, 
        light_transmittance){

        const mesureObj = await this.measuringPointWaterStateModel.find({number_point});
        const mesObj = new this.MeasureDto(mesureObj[0]).id;
        
        await this.WaterStateModel.create({
          measurement_point:mesObj, 
          temperature,
          acidity, 
          salt_level,
          redox_potential, 
          oxygen_level, 
          light_transmittance
        });
    }

    async createUser(name_organization, email, password, available_points){

        const mesureObj = await this.measuringPointWaterStateModel.find({
        number_point:[available_points[0].number_point, available_points[1].number_point]});
      
      
        const mesObj = [new this.MeasureDto(mesureObj[0]).id, new this.MeasureDto(mesureObj[1]).id];

        const hashPassword = await this.bcrypt.hash(password, 3);
        const activation_link = this.uuid.v4();
      
        await this.UserModel.create({
          name_organization, 
          email, 
          password:hashPassword,
          available_points:mesObj,
          activation_link:activation_link
        })
    }

    async createEditor (name_organization, email, password, access_level){

        const hashPassword = await this.bcrypt.hash(password, 3);
        const activation_link = this.uuid.v4();

        await this.UserModel.create({
            name_organization, 
            email, 
            password:hashPassword, 
            access_level,
            activation_link:activation_link
        });
    }

    async createFilteredRecord(
        number_point, 
        temperature, 
        acidity, 
        salt_level, 
        redox_potential, 
        oxygen_level, 
        light_transmittance){

        const mesureObj = await this.measuringPointWaterStateModel.find({number_point});
        const mesObj = new this.MeasureDto(mesureObj[0]).id;

        await this.filteredData.create({
            measurement_point:mesObj, 
            temperature,
            acidity, 
            salt_level,
            redox_potential, 
            oxygen_level, 
            light_transmittance
        });
    }
}