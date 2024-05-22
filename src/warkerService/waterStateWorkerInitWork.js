const waterStatewarkerFilter = require("./waterStateFilterRowData.js");
const waterStateworker = require("./waterStateWorker.js");

const measurementPoinModel = require("../models/MeasuringPointWaterState-model.js");
const filteredWaterStateModel = require("../models/FilterdWaterState-model.js");


/** Данная ф-ция призванна инициировать работу Warker Group, а именно 1-ым отрабатывает waterStatewarkerFilter
 * после отрабатывает waterStateworker и получаемый результат работы (Запись о состоянии воды) сохраняется в БД 
 * в таблицу FilterdWaterState
*/
module.exports = workerInitWork = async () =>{

    let measurementPoints = [1]; // Массив который хранит в себе номера точек измерения (Данный может получать номера точек измерения из отдельного файла)


    while(1){

        let currentTime = new Date().toLocaleString('de-RU'); // Значение Date получаемое из Интерент

        // let currentTime = "1.1.2024, 00:00:01"; // К Тестированию (Закоментировать перед добавкой коммита)

        // Значение Date соотв. "1.<currentTimeMonth>.<currentTimeYear>, 00:00:01"
        let referenceTime = `1.${currentTime.split(",")[0].split(".")[1]}.${currentTime.split(",")[0].split(".")[2]}, 00:00:01`; 

        if(currentTime == referenceTime){

            for(let poitIndex = 0; poitIndex<measurementPoints.length; poitIndex++){

                const measurementPointId = await measurementPoinModel.find({number_point:measurementPoints[poitIndex]});

                let preparerList = await waterStatewarkerFilter(measurementPointId[0].id, referenceTime); // Получить все записи за период referenceTime для конкретной точки измерения

                let monthDataMap = waterStateworker(preparerList); // Рассчитать среднее значение для показателей за период referenceTime с конкретной точки измерения

                
                for(let key of monthDataMap.keys()){
                    await filteredWaterStateModel.create({
                        measurement_point: key, 
                        temperature: monthDataMap.get(key).temperature, 
                        acidity: monthDataMap.get(key).acidity, 
                        salt_level: monthDataMap.get(key).salt_level, 
                        redox_potential: monthDataMap.get(key).redox_potential, 
                        oxygen_level: monthDataMap.get(key).oxygen_level, 
                        light_transmittance: monthDataMap.get(key).light_transmittance})
                }
            }
        } 

        // break; // К тестированию (Закоминтировать перед добавкой коммита)
    }
}
