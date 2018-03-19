import * as express from 'express';
import * as  productModel  from './../models/product';
import * as  productTxLogsModel  from './../models/txlogs';
import { CodeConstants } from '../interfaces/code_constants';
import * as contract from 'truffle-contract';
import * as Web3 from 'web3';
var web3 = new Web3( new Web3.providers.HttpProvider("http://13.250.35.159:9545"));
var LevelUp = contract(CodeConstants.LevelUp);
LevelUp.setProvider(web3.currentProvider);


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
export function createProduct(req, res, next){
  try{
    var data = req.body;
    var user = req.user_data[0];
    console.log(typeof(user._id));
    LevelUp.deployed().then(function(i){
      i.addProductToStore(user._id.toString(), data.product_name, data.selectName, data.imageLink, data.descLink, data.Price, {from: web3.eth.accounts[0], gas: 440000})
      .then(function(f){
        console.log(f);
        var obj = {logs: f.logs};
        productTxLogsModel.createLogs(obj).then(response =>{
          if(response){
            res.send(response);
          }
        });
      }).catch((e) =>{
        console.log("e >>>>>>>>>>>>>>>>>>>>>>>>>>>> addProductToStore");
        console.log(e)
      })
    }).catch((e) => {
      console.log("e >>>>>>>>>>>>>>>>>>>>>>>>>>>> addProductToStore 111111111111");
        console.log(e)
    });
  } catch(err){
    console.log(err)
    res.send({message: err});
  }
}

//save product
export function saveProduct(data){
  try{
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
  } catch(err){
    console.log(err)
  }
}