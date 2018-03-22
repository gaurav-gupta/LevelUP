import * as express from 'express';
import { orderController} from  './../controllers/orders';
import * as validator from './../validators/validator';
var router = express();
var order = new orderController();

router.post('/', validator.ValidateAuthToken, order.createOrder);
router.put('/:order_number', validator.ValidateAuthToken, order.updateOrder);
router.get('/', validator.ValidateAuthToken, order.getOrders);
router.get('/:id', validator.ValidateAuthToken,order.getOrdersUser);

export = router;
