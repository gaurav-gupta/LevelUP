import * as express from 'express';
import * as  orderModel  from './../models/order';
import * as  userModel  from './../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'underscore';
import * as appConstant from './../../config/config';
import * as common from '../helpers/common_helper';
import { CodeConstants } from '../interfaces/code_constants';
import * as userController from '../controllers/users';

//create order
export function createOrder (req, res, next){
  try {
    var user = req.user_data[0];
    common.getBuyerTokens(user).then((token:any) => {
      if(parseInt(token) >= req.body.price){
        common.buyProduct(req.body, user).then((plog) => {
          res.send(plog);
        })
      } else {
        res.send({message: "you have not sufficient levelup in your account"});
      }
    })
  } catch(error) {
    res.send({message:error});
  }
}

// update order
export function updateOrder(req, res, next){
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
export function getOrders(req,res,next){
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
export function getOrdersUser(req,res,next){
  try {
    let id = req.params.id;
    orderModel.getOrdersUser(id).then(response =>{
      res.send(response);
    });
  }catch(error){
    res.send({message:error});
  }
}
