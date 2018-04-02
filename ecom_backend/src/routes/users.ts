import * as express from 'express';
import { userController }from './../controllers/users';
import * as validator from './../validators/validator';
import {Router} from 'express';
var router = express();
var usersController = new userController();

router.get('/publisher',validator.ValidateAuthToken, usersController.getPublisher);
router.get('/loginModal', usersController.signInUser);
router.get('/signUpModal', usersController.signUpModal);
router.post('/transaction', usersController.userTransaction)
router.get('/transaction/:id', validator.ValidateAuthToken, usersController.getUserTransaction)
router.get('/:id/check', usersController.checkPublisher);
router.post('/publisher', validator.ValidateAuthToken, usersController.createPublisher);
router.post('/', usersController.createUser);
router.post('/login', usersController.authenticateUser);
router.get('/', validator.ValidateAuthToken, usersController.getAllUser);
router.get('/:email', validator.ValidateAuthToken, usersController.getUser);
router.put('/:email', validator.ValidateAuthToken, usersController.updateUser);
router.delete('/', validator.ValidateAuthToken, usersController.deleteUser);

export = router;
