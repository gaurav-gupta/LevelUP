import * as express from 'express';
import * as  productModel  from './../models/product';
import * as  LogModel  from './../models/level_up_log';
import { CodeConstants } from '../interfaces/code_constants';
import * as contract from 'truffle-contract';
import * as Web3 from 'web3';
var web3 = new Web3( new Web3.providers.HttpProvider("http://13.250.35.159:8545"));
var LevelUp = contract(CodeConstants.LevelUp);
LevelUp.setProvider(web3.currentProvider);

export class ProductsController{
  //get product
  getProduct (req, res, next){
    try{
      let id = req.params.id;
      productModel.getProduct({_id: id}).then(response => {
        if(response){
          res.send(response);
        }
      });
    } catch(error) {
      res.status(400).json(error);
    }
  }

  //get products
  getAllProduct(req,res,next){
    try{
      productModel.getAllProduct().then(response =>{
        if(response){
          res.send(response);
        }
      });
    }catch(e){
      res.status(400).json(e);
    }
  }

  //create product
  createProduct(req, res, next) {
    try {
      var data = req.body;
      var user = req.user_data[0];
      console.log("user >>>>>>>>>>>>>>>>>>>>>>>>>>")
      console.log(user)
      LevelUp.deployed().then(function(i) {
        console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii", i)
        var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
        if (isUnlock) {
          console.log("isUnlock >>>>>>>>>>>>>>>>>>>>>>>>")
          console.log(isUnlock)
          i.addProductToStore(data.product_name, data.selectName, data.imageLink, data.descLink, (data.Price * CodeConstants.DECIMAL), {
            from: CodeConstants.OWNER_ADDRESS,
            gas: 440000
          }).then(function(f) {
            console.log("createProduct logs ", f)
            var obj = {
              dtype: "Add_Product_To_Store_Log",
              logs: f.logs,
              receipt: f.receipt,
              created_at: new Date(),
              reference_id: f.logs[0].args._productId,
              block_hash: f.logs[0].blockHash,
              transaction_hash: f.logs[0].transactionHash
            }
            LogModel.createLogs(obj).then(response => {
              if (response) {
                res.send(response);
              }
            });
          }).catch((error) => {
            res.send({
              message: error
            });
          })
        } else {
          console.log("unlock not >>>>>>>>>>>>>>>")
        }
      }).catch((error) => {
        res.send({
          message: error
        });
      });
    } catch (err) {
      res.send({
        message: err
      });
    }
  }
}
