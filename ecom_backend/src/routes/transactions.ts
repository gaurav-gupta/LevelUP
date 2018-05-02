import * as express from 'express';
import { transactionLogController }from './../controllers/transactionlogs';
import * as validator from './../validators/validator';
import {Router} from 'express';
var router = express();
var logsController = new transactionLogController();

router.get('/', logsController.getTransactions);
router.get('/my', validator.ValidateAuthToken, logsController.getUserTransactions);

export = router;
