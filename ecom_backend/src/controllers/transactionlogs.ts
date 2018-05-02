import * as express from 'express';
import * as randomstring from 'randomstring';
import * as logModel from './../models/level_up_log';
import * as appConstant from './../../config/config';
import { CodeConstants } from '../interfaces/code_constants';

export class transactionLogController {
    
    //Fetch logs
    getTransactions(req, res, next){
        try{
            logModel.getAllTransaction({}).then((response: any) => {
                res.status(200).json(response);
            }); 
        }catch(e){
            res.status(400).json(e);
        }
    }

    //Fetch logs
    getUserTransactions(req, res, next){
        try{
            var user = req.user_data;
            logModel.getUserTransaction(user).then((response: any) => {
                res.status(200).json(response);
            }); 
        }catch(e){
            res.status(400).json(e);
        }
    }
}
