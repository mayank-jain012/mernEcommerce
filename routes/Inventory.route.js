import express from 'express';
import { deleteInventory, getAllInventory, getInventoryByProductId, getInventoryStatus, getLowStockItems, updateInventory } from '../controller/InventroyController.js';
const router=express.Router();
router.put('/put/:id',updateInventory);
router.get('/get',getAllInventory);
router.delete('/delete/:id',deleteInventory);
router.get('/get/thresHold',getLowStockItems);
router.get('/get/inventoryStatus',getInventoryStatus);
router.get('/get/product/:id',getInventoryByProductId);

export default router;
