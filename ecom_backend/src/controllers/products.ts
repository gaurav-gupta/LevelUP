import * as express from 'express';
import * as  productModel  from './../models/product';
import * as  productTxLogsModel  from './../models/txlogs';
import { CodeConstants } from '../interfaces/code_constants';

//get product
export function getProduct (req, res, next){
  try{
    let id = req.params.id;
    productModel.getProduct({_id: id}).then(response => {
      if(response){
        res.send(response);
      }
    });
  } catch(error) {
    res.send({message:error});
  }
}

//get products
export function getAllProduct(req,res,next){
  try{
    productModel.getAllProduct().then(response =>{
      if(response){
        res.send(response);
      }
    });
  }catch(e){
    res.send({message:e});
  }
}

//create product
export function createProduct(data){
  var obj = {
    productId: data._productId,
    name: data._name,
    category: data._category,
    imageLink: data._imageLink,
    descLink: data._descLink,
    price: data._price
  }
  productModel.getProduct({productId: parseInt(obj.productId)}).then((response:any) => {
    if(response.length == 0){
      productModel.createProduct(obj).then(response =>{
        console.log("product created successfully", response);
      })
    } 
  });
}

//create product tx logs
export function createProductTxLogs(req,res,next){
  try{
    var obj = {logs: req.body};
    productTxLogsModel.createLogs(obj).then(response =>{
      if(response){
        res.send(response);
      }
    });
  }catch(e){
    res.send({message:e});
  }
}