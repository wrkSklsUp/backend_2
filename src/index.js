const path = require('path');
const nodeEnv = process.env.NODE_ENV;
const dev = nodeEnv !== 'production';
require('dotenv').config({ path: path.join(__dirname, dev ? '../.dev.env' : '../.production.env') });

const clearData = require('./dbInitService/dbClear.js');
const initDataDB = require('./dbInitService/dbInitProcess.js');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const router = require('./router/index');
const errorMiddleware = require('./middlewares/error-middleware');
const compression = require('compression');
const helmet = require('helmet');
const bodyParser = require("body-parser");

const PORT = process.env.LOCAL_PORT || process.env.COMPOSE_LOCAL_PORT;
const app = express();

app.use(bodyParser.json({limit: '5mb'}));
app.use(bodyParser.urlencoded({limit: '5mb',extended: true }));

app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  credentials: true,
  origin: true,
}));

app.use('/api', router);
app.use(errorMiddleware);


module.exports = app;

const start = async () => {
  try {

    const dbUrl = process.env.DB_URL || process.env.COMPOSE_DB_URL;

    await mongoose.connect(dbUrl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });

    app.listen(PORT);
    console.log('Предварительная очистка БД')
    await clearData();
    console.log('Внесение тестовых данны')
    await initDataDB(); // Внесение тестовых данны
    console.log('Запуск сервера');
    console.log(`Server started \nport: ${PORT}`);
  } catch (error) {
    console.error(error);
  }
}

start();
