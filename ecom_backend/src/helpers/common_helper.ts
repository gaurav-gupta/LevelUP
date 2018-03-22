import * as _ from 'underscore';
import { CodeConstants } from '../interfaces/code_constants';
import * as contract from 'truffle-contract';
import * as Web3 from 'web3';
import { ProductsController }from '../controllers/products';
import * as userModel from './../models/user';
import * as orderModel from './../models/order';
import * as productModel from './../models/product';
import * as LogModel from './../models/level_up_log';
import  { orderHelper }  from './order_helper';
import  { userHelper }  from './user_helper';
import  { productHelper }  from './product_helper';
var web3 = new Web3( new Web3.providers.HttpProvider("http://13.250.35.159:9545"));
var LevelUp = contract(CodeConstants.LevelUp);
LevelUp.setProvider(web3.currentProvider);
var ordersHelper = new orderHelper();
var usersHelper = new userHelper();
var productsHelper = new productHelper();


export class commonHelper {
  constructor() {
  }

  setupProductEventListner() {
    try {
      let productEvent;
      LevelUp.deployed().then(function(i) {
        productEvent = i.NewProduct({fromBlock: 0, toBlock: 'latest'});
        productEvent.watch(function(err, result) {
          if (err) {
            console.log(err)
            return;
          }
          productsHelper.saveProduct(result.args);
        });
      }).catch((err) => {
        console.log(err);
      })
    } catch(e) {
      throw new Error(e);
    }
  }

  setupUserBuyProductEventListner() {
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
          ordersHelper.createOrder(result.args);
        });
      }).catch((err) => {
        console.log(err);
      })
    } catch(e) {
      throw new Error(e);
    }
  }

  setupUserTokenEventListner() {
    try {
      let tokenEvent;
      LevelUp.deployed().then(function(i) {
        tokenEvent = i.BuyerBalance({fromBlock: 0, toBlock: 'latest'});

        tokenEvent.watch(function(err, result) {
          if (err) {
            console.log(err)
            return;
          }
          usersHelper.getUserByWalletAddress(result.args);
        });
      }).catch((err) => {
        console.log(err);
      })
    } catch(e) {
      throw new Error(e);
    }
  }

  assignLevelUpToUser(user, pass) {
    try {
      console.log('>>>>>>>>>>this is error ???????????/in comon ????????????')
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

  getBuyerTokens(user) {
    console.log('>>>>>>>>>>>>this is get buyrs token >>>>>>>>>>>>')
    return new Promise((resolve, reject) => {
      try {
        LevelUp.deployed().then(function(i) {
          i.getBuyerTokens(user.wallet_address, {from: web3.eth.accounts[0], gas: 440000})
          .then(function(f){
            return resolve(f);
          }).catch((e) =>{
            reject(e)
          });
        });
      } catch(e) {
        throw new Error(e);
      }
    });
  }

  buyProduct(data, user) {
    console.log('>>>>>>>>>>>>.in buy product>>>>>>>>>>>>>>')
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
          console.log("ssssssssssssssss33333333333333333ssssssssssssss", err);
          throw new Error(err);
        })
      }catch(e){
          console.log("4444444444444444444443333333333ssssssssssssss", e);
        throw new Error(e);
      }
    });
  }
}
