import * as _ from 'underscore';
import { CodeConstants } from '../interfaces/code_constants';
import * as contract from 'truffle-contract';
import * as Web3 from 'web3';
import * as controller from '../controllers/products';
import * as userController from '../controllers/users';
import * as userModel from './../models/user';
import * as orderModel from './../models/order';
import * as productModel from './../models/product';
import * as LogModel from './../models/level_up_log';

var web3 = new Web3( new Web3.providers.HttpProvider("http://13.250.35.159:9545"));
var LevelUp = contract(CodeConstants.LevelUp);
LevelUp.setProvider(web3.currentProvider);

export function setupProductEventListner() {
  try {
    let productEvent;
    LevelUp.deployed().then(function(i) {
      productEvent = i.NewProduct({fromBlock: 0, toBlock: 'latest'});

      productEvent.watch(function(err, result) {
        if (err) {
          console.log(err)
          return;
        }
        controller.saveProduct(result.args);
      });
    }).catch((err) => {
      console.log(err);
    })
  } catch(e) {
    throw new Error(e);
  }
}

export function setupUserBuyProductEventListner() {
  try {
    let orderEvent;
    LevelUp.deployed().then(function(i) {
      orderEvent = i.NewOrder({fromBlock: 0, toBlock: 'latest'});

      orderEvent.watch(function(err, result) {
        if (err) {
          console.log(err)
          return;
        }
        console.log("result.args >?>>>>>>>>>>>>>>>>>>>>>>");
        console.log(result.args);
        createOrder(result.args);
      });
    }).catch((err) => {
      console.log(err);
    })
  } catch(e) {
    throw new Error(e);
  }
}

export function createOrder(data) {
  try {
    orderModel.getOrder({orderId: parseInt(data._orderId)}).then((order:any) => {
      if(order.length > 0 ){
        throw new Error("Order already created >.......");
      }else{
        userModel.getUser({wallet_address: data.buyer}).then((user:any) => {
          console.log(user)
          if(user.length > 0){
            productModel.getProduct({productId: parseInt(data._productId)}).then((product:any) => {
              if(product.length > 0){
                var obj = {
                  order_number: Math.floor(Math.random()*(10000-1000+1))+1000,
                  orderId: parseInt(data._orderId),
                  price: product[0].price,
                  customer_id: user[0]._id,
                  productId: product[0]._id,
                  created_at: new Date(),
                  updated_at: new Date(),
                  address:{
                    address: data.street,
                    state: data.state,
                    city: data.city,
                    pincode: data.pincode,
                    phone_number: data.phone
                  }
                }
                orderModel.createOrder(obj).then(response => {
                   console.log("order created response >>>>>>>>>>>>>>>>");
                   console.log(response);
                   userController.updateUserToken(user[0], user[0].wallet_amount - product[0].price);
                }).catch((err) =>{
                  console.log("err >>>>>>>>>>>>>>>>>")
                  console.log(err)
                });
              }else{
                throw new Error("Product not exists");    
              }
            }).catch(err => {
              throw new Error(err);
            })
          }else{
            throw new Error("User not exists");
          }
        }).catch((err) => {
          console.log(err);
        }) 
      }
    }).catch((err) => {
      console.log(err);
    })
  } catch(e) {
    throw new Error(e);
  }
}

export function setupUserTokenEventListner() {
  try {
    let tokenEvent;
    LevelUp.deployed().then(function(i) {
      tokenEvent = i.BuyerBalance({fromBlock: 0, toBlock: 'latest'});

      tokenEvent.watch(function(err, result) {
        if (err) {
          console.log(err)
          return;
        }
        getUserByWalletAddress(result.args);
      });
    }).catch((err) => {
      console.log(err);
    })
  } catch(e) {
    throw new Error(e);
  }
}

export function getUserByWalletAddress(args) {
  try {
    console.log(args);
    userModel.getUser({wallet_address: args.buyer}).then((user:any) => {
      console.log(user)
      if(user.length > 0){
        userController.updateUserToken(user[0], parseInt(args._balanceTokens));
      }else{
        throw new Error("User not exists");
      }
    }).catch((err) => {
      console.log(err);
    })   
  } catch(e) {
    throw new Error(e);
  }
}

export function assignLevelUpToUser(user, pass) {
  try {
    var resp = web3.personal.newAccount(pass);
    user.wallet_address = resp;
    LevelUp.deployed().then(function(i) {
      i.giveLevelUpTokens(resp, {from: web3.eth.accounts[2], value: web3.toWei(10 * 0.001), gas: 440000})
      .then(function(f){
        user.wallet_amount = 10;
        userModel.updateUser({email: user.email}, user).then(function(user){
          var obj = {
            dtype: "Assign_Level_Up_Token_To_User", 
            logs: f.logs, 
            receipt: f.receipt, 
            created_at: new Date(),
            reference_id: f.logs[0].args.buyer,
            block_hash: f.logs[0].blockHash,
            transaction_hash: f.logs[0].transactionHash
          }
          LogModel.createLogs(obj).then(function(log){
            console.log("user logs >>>>>>>>>>>>>>>>", log);
          }).catch((error) => {
            console.log("create assign level up to user error", error);
          })
        }).catch(err => {
          console.log("update user with update user with level up error", err)
        });
      }).catch((e) =>{
        console.log("e >>>>>>>>>>>>>>>>>>>>>>>>>>>> giveLevelUpTokens");
        console.log(e)
      })
    }).catch((err) => {
      console.log(err);
    })
  } catch(e) {
    throw new Error(e);
  }
}

export function getBuyerTokens(user) {
  return new Promise((resolve, reject) => {
    try {
      LevelUp.deployed().then(function(i) {
        i.getBuyerTokens(user.wallet_address, {from: web3.eth.accounts[0], gas: 440000})
        .then(function(f){
          return resolve(f);
        }).catch((e) =>{
          reject(e)
        })
      })
    } catch(e) {
      throw new Error(e);
    }
  });
}

export function buyProduct(data, user) {
  return new Promise((resolve, reject) => {
    try {
      var address = data.address;
      LevelUp.deployed().then(function(i) {
        i.buyProduct(user.wallet_address, data.productId, data.price, address.address, address.state, address.city, address.pincode, address.phone_number, {from: web3.eth.accounts[0], gas: 440000})
        .then(function(f){
          var obj = {
            dtype: "Buy_Product_Log", 
            logs: f.logs, 
            receipt: f.receipt, 
            created_at: new Date(),
            reference_id: f.logs[0].args._orderId,
            block_hash: f.logs[0].blockHash,
            transaction_hash: f.logs[0].transactionHash
          }
          LogModel.createLogs(obj).then(function(log){
            return resolve(f);
          }).catch((error) => {
            reject(error);  
          })
        }).catch((e) =>{
          console.log("sssssssssssssssssssssssssssssssssss", e);
          return reject(e)
        })
      }).catch((err) => {
        throw new Error(err);  
      })
    }catch(e){
      throw new Error(e);
    }
  });
}