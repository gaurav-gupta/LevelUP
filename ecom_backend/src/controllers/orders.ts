import * as express from 'express';
import * as  orderModel  from './../models/order';
import * as  userModel  from './../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'underscore';
import * as appConstant from './../../config/config';
import { CodeConstants } from '../interfaces/code_constants';
import { commonHelper  }from '../helpers/common_helper';
var common = new commonHelper;
export class orderController{

  //create order
  createOrder (req, res, next){
    try {
      var user = req.user_data[0];
      console.log(">******************user", user);
      common.getBuyerTokens(user.email).then((token:any) => {
        if(parseInt(token) >= req.body.price){
          common.buyProduct(req.body, user).then((plog) => {
            res.send(plog);
          }).catch(e =>{
            res.send(e);
          })
        } else {
          res.send("you have not sufficient levelup in your account");
        }
      }).catch(e =>{
        res.send(e);
      });
    } catch(error) {
      res.send({message:error});
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
      res.send({message:error});
    }
  }

  //get orders
  getOrders(req,res,next){
    try{
      orderModel.getOrders().then(response =>{
        if(response){
          res.send(response);
        }
      });
    }catch(error){
      res.send({message:error});
    }
  }

  //get orders of user
  getOrdersUser(req,res,next){
    try {
      let id = req.params.id;
      orderModel.getOrdersUser(id).then(response =>{
        res.send(response);
      });
    }catch(error){
      res.send({message:error});
    }
  }
}
