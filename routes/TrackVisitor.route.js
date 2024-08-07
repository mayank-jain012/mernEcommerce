import express from 'express';
import { getBounceRate, getPageViews, getUniqueVisits, getVists,getNewUsers,getTraffic } from '../controller/trackVistorController.js';
import { trackVisit } from '../middlewares/trackVisit.middleware.js';
const router=express.Router();
router.use(trackVisit);
router.get('/getVisits',getVists);
router.get('/getUniqueVisits',getUniqueVisits);
router.get('/getPageViews',getPageViews);
router.get('/getBounceRate',getBounceRate);
router.get('/getNewUsers',getNewUsers);
router.get('/getTraffic',getTraffic);
export default router;
