import * as express from 'express';
import * as userController from './../controllers/users';
import * as validator from './../validators/validator';
import {Router} from 'express';
var router = express();

router.post('/', userController.createUser);
router.post('/login', userController.authenticateUser);
router.post('/logout/:email', userController.logoutUser);
router.get('/', validator.ValidateAuthToken, userController.getAllUser);
router.get('/:email', validator.ValidateAuthToken, userController.getUser);
router.put('/:email', validator.ValidateAuthToken, userController.updateUser);
router.delete('/', validator.ValidateAuthToken, userController.deleteUser);

export = router;