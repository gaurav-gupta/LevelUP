import * as express from 'express';
import * as OrdersController from  './../controllers/orders';
import * as validator from './../validators/validator';
var router = express();

router.post('/',validator.ValidateAuthToken, OrdersController.createOrder);
router.put('/:order_number',validator.ValidateAuthToken, OrdersController.updateOrder);
router.get('/', validator.ValidateAuthToken, OrdersController.getOrders);
router.get('/:id', OrdersController.getOrdersUser);

export = router;
