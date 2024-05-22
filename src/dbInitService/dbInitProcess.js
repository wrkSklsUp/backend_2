const UserModel = require('../models/user-model.js');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const measuringPointWaterStateModel = require('../models/MeasuringPointWaterState-model.js');
const WaterStateModel = require('../models/WaterState-model.js');
const MeasureDto = require('./tstMeasureDto.js');
const filteredData = require('../models/FilterdWaterState-model.js');
const createTestRecordsClass = require('./testInitData.js');
const path = require('path');

// Чтение данных из файла testDataMongo.json и представление их в виде объекта parsedData
const fs = require("fs");
const data = fs.readFileSync(path.resolve(__dirname, './testDataMongo.json'));
const parsedData = JSON.parse(data);

const createTestRecords = new createTestRecordsClass(
  UserModel,
  bcrypt,
  uuid,
  measuringPointWaterStateModel,
  WaterStateModel,
  MeasureDto,
  filteredData
);

const initDataDB = async () => {
  await createTestRecords.createMeasuringPoint( // Создание записи в бд о 1-й точке измерения.
    parsedData.measuringPoint[0].number_point,
    parsedData.measuringPoint[0].coordinates,
    parsedData.measuringPoint[0].address,
    parsedData.measuringPoint[0].description,
    console.log("1-я Точка измерения созданна")
  );

  for (let i = 0; i < 4; i++) {
    await createTestRecords.createWaterStatistic( // Создание записи в БД о состоянии воды, инф-я получ. с 2-й точки измерения
      parsedData.measuringPoint[0].number_point,
      parsedData.waterState[i].temperature,
      parsedData.waterState[i].acidity,
      parsedData.waterState[i].salt_level,
      parsedData.waterState[i].redox_potential,
      parsedData.waterState[i].oxygen_level,
      parsedData.waterState[i].light_transmittance);

    console.log(parsedData.waterState[i].date);
  }

  for (let l = 0; l < 4; l++) {
    await createTestRecords.createFilteredRecord(
      parsedData.measuringPoint[0].number_point,
      parsedData.waterState[l].temperature,
      parsedData.waterState[l].acidity,
      parsedData.waterState[l].salt_level,
      parsedData.waterState[l].redox_potential,
      parsedData.waterState[l].oxygen_level,
      parsedData.waterState[l].light_transmittance);
  }

  await createTestRecords.createEditor( // Создание пользователя с правами Admin
    parsedData.users[1].name_organization,
    parsedData.users[1].email,
    parsedData.users[1].password,
    parsedData.users[1].access_level,
    console.log("2-й User")
  );
}

module.exports = initDataDB;


