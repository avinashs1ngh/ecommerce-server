const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const orderController =require('../controllers/orderController')
const router = express.Router();
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));



router.get('/', orderController.getAllOrders); 
router.get('/:id', orderController.getOrderDetails); 
router.post('/', orderController.createOrder); 
router.put('/:id', orderController.updateOrder); 
router.delete('/:id', orderController.cancelOrder); 

module.exports = router;