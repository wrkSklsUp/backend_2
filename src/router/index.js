const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const waterStateController = require('../controllers/WaterState-controller');
const measuringPoint = require('../controllers/MeasuringPointWaterState-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const refreshMiddleware = require('../middlewares/refresh.middleware');
const encodeMiddleware = require('../middlewares/parse.middleware.js');
const fluorimetrData = require('../controllers/flurometrData-controller.js');

const flurometr = require('../controllers/flurometr-controller.js');

// User routes
router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 3, max: 32 }),
  userController.registration);

router.post('/registration_editor', body('email').isEmail(), body('password').isLength({ min: 3, max: 32 }),
userController.registrationEditor);

router.post('/login', userController.login);
router.post('/login_editor', userController.loginEditor);
router.post('/set_acc/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/set_acc/refresh', refreshMiddleware, userController.refresh);
router.get('/user', authMiddleware, userController.getUser); // Через query
router.get('/users', authMiddleware, userController.getUsers);
router.post('/user/update', authMiddleware, userController.updateUser);
router.post('/user/delete', authMiddleware, userController.deleteUser);

// WaterState routes
router.post('/add/waterdata', authMiddleware, waterStateController.addWaterStateInfo);
router.post('/delete/waterdata', authMiddleware, waterStateController.deleteWaterStateData);
router.post('/update/waterdata', authMiddleware, waterStateController.updateWaterState);
router.get('/get/all/waterdata/deshboard', authMiddleware, waterStateController.getWaterStateYearInfoForDeshboard); // Через query
router.get('/get/bymonth/waterdata', authMiddleware, waterStateController.getWaterStateInfoByMonth); // Через query

// MeasuringPoint routes
router.post('/add/measuringpoint', authMiddleware, measuringPoint.createMeasuringPoint);
router.get('/get/measuringpoint', authMiddleware, measuringPoint.getMeasuringPoint); // Через query
router.get('/get/all/measuringpoints', authMiddleware, measuringPoint.getAllMeasuringPoints);
router.post('/update/measuringpoint', authMiddleware, measuringPoint.updateMeasuringPoint);
router.post('/delete/measuringpoint', authMiddleware, measuringPoint.deleteMeasuringPoint);

// FluorimetrData routes
router.post('/add/fluorimetr/data',encodeMiddleware, fluorimetrData.addFlurometrData);
router.get('/get/last/fluorimetr/data', fluorimetrData.getLastFlurometrDataById); // Через query
// router.get('/get/fluorimetr/data/onDate', fluorimetrData.getFlurometrDataOnDate);

// Flurometr routes
router.post('/add/new/flurometr',flurometr.addFlurometrInfo);
router.get('/pull/flurometr/info', flurometr.getFlurometrInfo); // Через query

module.exports = router;
