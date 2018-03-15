import * as express from 'express';
import * as  productModel  from './../models/product';
import { CodeConstants } from '../interfaces/code_constants';
const ipfsAPI = require('ipfs-api');
const ipfs = ipfsAPI({host: 'ipfs.infura.io', port: '5001', protocol: 'http'})

//get product
export function getProduct (req, res, next){
  try{
    let id = req.params.id;
    productModel.getProduct(id).then(response => {
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
export function createProduct(req, res, next){
  try{
    productModel.createProduct().then(response =>{
      if(response){
        res.send(response);
      }
    });
  }catch(e){
    res.send({message:e});
  }
}
