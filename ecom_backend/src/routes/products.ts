import * as express from 'express';
import { ProductsController } from  './../controllers/products';
import * as CategoriesController from  './../controllers/common';
import * as validator from './../validators/validator';
var router = express();
var product = new ProductsController();

router.get('/category', CategoriesController.getAllCategories);
router.get('/:id', product.getProduct);
router.get('/', product.getAllProduct);
router.post('/', validator.ValidateAuthToken, product.createProduct);

export = router;
