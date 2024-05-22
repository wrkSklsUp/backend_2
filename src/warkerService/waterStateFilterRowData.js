const WaterStateModel = require('../models/WaterState-model');

/* 
Данная ф-ция выполняет запрос в бд и получает все записи для передаваемой в запросе точке измерения
о состоянии воды, далее полученный список записей будет отфильтрован в соотв с условием: "Получить данные за предыдущий месяц" т.к
данна ф-ция отрабатывает в начале нового месяца 

Данный метод вызывается автоматически в начале нового месяца, 
и дата его вызова поступает в качестве 2-го аргумента в данную ф-цию ("1.<Month>.<Year>, 00:00:01") */

module.exports = waterStateWorkerFilter = async (measurement_point, date) => {

    let result = await WaterStateModel.find({measurement_point:measurement_point});

    const preparedArr = [];

    let counter = 0;
    for(let i = 0; i<result.length; i++){

        if(date.split(",")[0].split(".")[1] == "1" && Number(result[i].date.split(",")[0].split(".")[2]) ==  Number(date.split(",")[0].split(".")[2])- 1
        && result[i].date.split(",")[0].split(".")[1] == "12"){

            preparedArr[counter] = result[i];
            counter++;
        }

        else if(Number(result[i].date.split(",")[0].split(".")[2]) ==  Number(date.split(",")[0].split(".")[2]) &&
        Number(result[i].date.split(",")[0].split(".")[1]) == Number(date.split(",")[0].split(".")[1]) - 1){
            
            preparedArr[counter] = result[i];
            counter++;
        }
    }


    return preparedArr;
}