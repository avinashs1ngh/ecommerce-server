const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAllCustomers, getCustomerDetails, createCustomer, updateCustomer, deactivateCustomer } = require('../controllers/customerController');
const router = express.Router();
router.use(authMiddleware);
router.use(roleMiddleware(['admin']));


router.get('/', getAllCustomers); 
router.get('/:customerId', getCustomerDetails); 
router.post('/', createCustomer); 
router.put('/:customerId', updateCustomer); 
router.delete('/:customerId', deactivateCustomer); 

module.exports = router;