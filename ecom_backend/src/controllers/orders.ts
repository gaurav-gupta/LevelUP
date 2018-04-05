import * as express from 'express';
import * as  orderModel  from './../models/order';
import * as  userModel  from './../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'underscore';
import * as mongoose from 'mongoose';
import * as appConstant from './../../config/config';
import { CodeConstants } from '../interfaces/code_constants';
import { commonHelper  }from '../helpers/common_helper';
var ObjectId = mongoose.Types.ObjectId;
var common = new commonHelper;

export class orderController {
    //create order
    createOrder(req, res, next) {
        try {
            var user = req.user_data[0];
            if (user.wallet_amount >= (req.body.price)) {
                common.buyProduct(req.body, user).then((plog) => {
                    res.send(plog);
                }).catch(e =>{
                    var e = JSON.parse(JSON.stringify(e, Object.getOwnPropertyNames(e))).message;
                    res.status(400).json(e);
                });
            } else {
                res.status(400).json(CodeConstants.SUFFIECIENT_LEVELUP);
            }
        } catch (error) {
            res.status(400).json(error);
        }
    }

    // update order
    updateOrder(req, res, next){
        try{
            req.body.updated_at = new Date();
            orderModel.updateOrder({order_number: req.params.order_number}, req.body).then(response => {
                if(response){
                    res.send(response);
                }
            });
        }catch(error){
            res.status(400).json(error);
        }
    }

    //get orders
    getOrders(req,res,next){
        try {
            orderModel.getOrders({}).then(response =>{
                if(response){
                    res.send(response);
                }
            });
        }catch(error){
            res.status(400).json(error);
        }
    }

    //get orders of user
    getOrdersUser(req,res,next){
        try {
            let id = req.params.id;
            var user_id = new ObjectId(id);
            orderModel.getOrders({customer_id: user_id}).then(response =>{
                res.send(response);
            });
        }catch(error){
            res.status(400).json(error);
        }
    }
}
