import * as express from 'express';
import { userController }from './../controllers/users';
import * as validator from './../validators/validator';
import {Router} from 'express';
var router = express();
var usersController = new userController();

router.post('/', usersController.createUser);
router.post('/login', usersController.authenticateUser);
router.get('/', validator.ValidateAuthToken, usersController.getAllUser);
router.get('/:email', validator.ValidateAuthToken, usersController.getUser);
router.put('/:email', validator.ValidateAuthToken, usersController.updateUser);
router.delete('/', validator.ValidateAuthToken, usersController.deleteUser);

export = router;
