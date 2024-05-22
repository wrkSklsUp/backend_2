const flurometrDataDTO = require('../dtos/flurometrData-dto.js');

module.exports = function(req, res, next) {
    try {

        let newReqBody = new flurometrDataDTO();

        /**
         * Парсинг массива данных из req.body и установка поля data об-та newReqBody
         */
        let dataObj = req.body[Object.keys(req.body)[0]];
        newReqBody.data = (Object.keys(dataObj)[0].split(','));

        // Получить данные date, token представляемые в виде строки / ключа об-та req.body
        let arr = Object.keys(req.body)[0].split("\n");

        /**
         * Парсинг date и token из ключа req.body для об-та newReqBody
         */
        for(let i=1; i<arr.length-1; i++){

            let counter = 3;
            let tempStr = [];
            let startStr = arr[i].replace(/[,]/g, ' ').trim();

            for(let i=0; i<startStr.length; i++){

                if(startStr[i] == ':'){
            
                    while(counter<startStr.length-1){
                        tempStr.push(startStr[counter]);
                        counter++;
                    }
                }

                counter++;
        
            
            }

            // Внесение полученных данных в newReqBody
            let key = arr[i].replace(/[,]/g, ' ').trim().split(':')[0];
            newReqBody[key.substring(1,key.length-2)] = tempStr.join('');
         
        }
        
        req.body = newReqBody;

        next();

    } catch (error) {
        return next(error);
    }
  }