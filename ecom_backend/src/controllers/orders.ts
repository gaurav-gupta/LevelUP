import * as express from 'express';
import * as  orderModel  from './../models/order';
import * as  userModel  from './../models/user';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as _ from 'underscore';
import * as appConstant from './../../config/config';
import { CodeConstants } from '../interfaces/code_constants';

//create order
export function createOrder (req, res, next){
  try{
    req.body.order_number = Math.floor(Math.random()*(10000-1000+1))+1000;
    req.body.created_at = new Date();
    req.body.date = new Date();
    req.body.updated_at = new Date();
    userModel.getUser(req.user_data[0].email).then(user =>{
      req.body.customer_id = user[0]._id;
      orderModel.createOrder(req.body).then(response => {
        if(response){
          res.send(response);
        }
      });
    });
  } catch(error) {
    res.send({message:error});
  }
}

// update order
export function  updateOrder(req, res, next){
  try{
    req.body.updated_at = new Date();
    orderModel.updateOrder(req.body.order_number, req.body).then(response => {
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