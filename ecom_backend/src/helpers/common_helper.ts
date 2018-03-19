import * as _ from 'underscore';
import { CodeConstants } from '../interfaces/code_constants';
import * as contract from 'truffle-contract';
import * as Web3 from 'web3';
import * as controller from '../controllers/products';
import * as userController from '../controllers/users';
import * as userModel from './../models/user';
import * as LogModel from './../models/level_up_log';

var web3 = new Web3( new Web3.providers.HttpProvider("http://13.250.35.159:9545"));
var LevelUp = contract(CodeConstants.LevelUp);
LevelUp.setProvider(web3.currentProvider);

export function setupProductEventListner() {
  try {
    let productEvent;
    console.log("fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
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

export function setupUserTokenEventListner() {
  try {
    let tokenEvent;
    console.log("ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
    LevelUp.deployed().then(function(i) {
      tokenEvent = i.BuyerBalance({fromBlock: 0, toBlock: 'latest'});

      tokenEvent.watch(function(err, result) {
        if (err) {
          console.log(err)
          return;
        }
        userController.updateUserToken(result.args);
      });
    }).catch((err) => {
      console.log(err);
    })
  } catch(e) {
    throw new Error(e);
  }
}

export function assignLevelUpToUser(user) {
  try {
    LevelUp.deployed().then(function(i) {
      i.giveLevelUpTokens(user._id.toString(), {from: web3.eth.accounts[2], value: web3.toWei(10 * 0.001), gas: 440000})
      .then(function(f){
        user.wallet_amount = 10;
        userModel.updateUser(user.email, user).then(function(user){
          LogModel.createLogs({dtype: "user", logs: f.logs, receipt: f.receipt}).then(function(log){
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
        i.getBuyerTokens(user._id.toString(), {from: web3.eth.accounts[2], gas: 440000})
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
      console.log("daata >>>>>>>>>>>>>>>>");
      console.log(data);
      LevelUp.deployed().then(function(i) {
        i.buyProduct(user._id.toString(), data.productId, data.price, address.address, address.state, address.city, address.pincode, address.phone_number, {from: web3.eth.accounts[0], gas: 440000})
        .then(function(f){
          console.log("f >>>>>>>>>>>>>>>>>")
          console.log(f)
          LogModel.createLogs({dtype: "order", logs: f.logs, receipt: f.receipt}).then(function(log){
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