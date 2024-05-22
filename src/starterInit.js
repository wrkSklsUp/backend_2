const mongoose = require('mongoose');
const clearData = require('./dbInitService/dbClear.js');
const initDataDB = require('./dbInitService/dbInitProcess.js');

const path = require('path');

const nodeEnv = process.env.NODE_ENV;
const dev = nodeEnv !== 'production';
require('dotenv').config({ path: path.join(dev ? path.resolve(__dirname, '../.development.env')  :
path.resolve(__dirname, '../.production.env')) });


const startInit = async() => {
    try {
        console.log('Подключенеи к базе данных', process.env.NODE_ENV)

        await mongoose.connect(process.env.DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log('База данных успешно подключена');
        console.log('Предварительная очистка БД')
        await clearData();
        console.log('Внесение тестовых данны')
        await initDataDB(); // Внесение тестовых данны

        mongoose.disconnect();
        console.log('База данных успешно обнавлена');
      } catch (error) {
        console.error('Ошибка подключения к базе данных!!',error);
    }
}

startInit();
