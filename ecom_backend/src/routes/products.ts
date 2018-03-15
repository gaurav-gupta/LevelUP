import * as express from 'express';
import * as ProductsController from  './../controllers/products';
import * as CategoriesController from  './../controllers/common';
import * as validator from './../validators/validator';
var router = express();

router.get('/category', CategoriesController.getAllCategories);
router.get('/:id', ProductsController.getProduct);
router.get('/', ProductsController.getAllProduct);
router.post('/', ProductsController.createProduct);

export = router;