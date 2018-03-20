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
  try{
    req.body.order_number = Math.floor(Math.random()*(10000-1000+1))+1000;
    req.body.created_at = new Date();
    req.body.date = new Date();
    req.body.updated_at = new Date();
    userModel.getUser(req.user_data[0].email).then(user =>{
      req.body.customer_id = user[0]._id;
      common.getBuyerTokens(user[0]).then((token:any) => {
        console.log("getBuyerTokens res >>>>>>>>>>>>>>>>");
        console.log(parseInt(token));
        if(parseInt(token) >= req.body.price){
          common.buyProduct(req.body, user[0]).then((border) => {
            console.log("common >>>>>>>>>>>>>>>>>>")
            console.log(border);
            console.log(req.body);
            orderModel.createOrder(req.body).then(response => {
              if(response){
                userController.updateUserToken(user[0], parseInt(token)-req.body.price);
                res.send(response);
              }
            }).catch((err) =>{
              console.log("err >>>>>>>>>>>>>>>>>")
              console.log(err)
              res.send({message: err});
            });
          })
        } else {
          res.send({message: "you have not sufficient levelup in your account"});
        }
      })
    });
  } catch(error) {
    res.send({message:error});
  }
}

// update order
export function  updateOrder(req, res, next){
  try{
    req.body.updated_at = new Date();
    orderModel.updateOrder(req.params.order_number, req.body).then(response => {
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
