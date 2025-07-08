const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const typeController =require('../controllers/typeController')
const router = express.Router();


router.use(authMiddleware);
router.use(roleMiddleware(['admin']));



router.get('/', typeController.getAllTypes); 
router.get('/:id', typeController.getTypeById); 
router.post('/', typeController.createType); 
router.put('/:id', typeController.updateType); 
router.delete('/:id', typeController.deleteType); 
module.exports = router;