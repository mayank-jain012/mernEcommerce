import express from 'express';
const router=express.Router();
import { createVariant, deleteVariant, getVariant, updateVariant } from '../controller/VariantController.js';
import { validateUpdateVariant, validateVariant } from '../middlewares/validator.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';
router.post('/create',upload.array('images',4),validateVariant,createVariant);
router.get('/get',getVariant);
router.put('/update/:id',upload.array("images",4),validateUpdateVariant,updateVariant)
router.delete('/delete/:id',deleteVariant);
router.get('/get/:id');
export default router;