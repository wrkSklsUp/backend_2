/* 
Данная ф-ция принимает массив отфильрованных данных от warkerFilter за период 1-ин месяц
рассчитывает среднее значение для всех параметров и 
сохраняет итоговый объект в бд в таблицу filteredWaterStateModel */

module.exports = worker = function waterStateWorker(arr){

    const measuringPointsMap = new Map();

    for(let i = 0; i<arr.length; i++){

        let measureObj = {
            "temperature":[0,0],
            "acidity":[0,0], 
            "salt_level":[0,0], 
            "redox_potential":[0,0], 
            "oxygen_level":[0,0], 
            "light_transmittance":[0,0]

        }

        measuringPointsMap.set(`${arr[i].measurement_point}`, measureObj);
        
    }

    const indicators = [        
        "temperature",
        "acidity", 
        "salt_level", 
        "redox_potential", 
        "oxygen_level", 
        "light_transmittance",
    ]


    for(let b = 0; b<arr.length; b++){
        for(let ib = 0; ib<indicators.length; ib++){

            measuringPointsMap.get(`${arr[b].measurement_point}`)[indicators[ib]][0] += arr[b][indicators[ib]];

            if(arr[b][indicators[ib]] != NaN && arr[b][indicators[ib]] != 0){
                measuringPointsMap.get(`${arr[b].measurement_point}`)[indicators[ib]][1] += 1;
            }

        }
   
    }


    for(let key of measuringPointsMap.keys()){
        for(let counter = 0; counter<indicators.length; counter++){

            if(measuringPointsMap.get(key)[indicators[counter]][1] != 0 ){

                measuringPointsMap.get(key)[indicators[counter]] = 
                (measuringPointsMap.get(key)[indicators[counter]][0]/measuringPointsMap.get(key)[indicators[counter]][1]);
            }
            

        }
    }

    return measuringPointsMap;

}