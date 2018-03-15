import * as express from 'express';
import * as OrdersController from  './../controllers/orders';
import * as validator from './../validators/validator';
var router = express();

router.post('/',validator.ValidateAuthToken, OrdersController.createOrder);
router.put('/',validator.ValidateAuthToken, OrdersController.updateOrder);
router.get('/',validator.ValidateAuthToken, OrdersController.getOrders);
router.get('/:id',validator.ValidateAuthToken, OrdersController.getOrdersUser);

export = router;