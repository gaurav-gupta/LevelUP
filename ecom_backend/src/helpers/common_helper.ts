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
var web3 = new Web3( new Web3.providers.HttpProvider("http://13.250.35.159:8545"));
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
            return;
          }
          ordersHelper.createOrder(result.args);
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
      var resp = web3.personal.newAccount(pass);
      user.wallet_address = resp;
      userModel.updateUser({
        email: user.email
      }, user).then(function(user) {
        LevelUp.deployed().then(function(i) {
          var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
          if (isUnlock) {
            var assignToken = 1 * CodeConstants.DECIMAL;
            i.transfer(resp, assignToken, {
              from: CodeConstants.OWNER_ADDRESS,
              gas: 440000
            }).then(function(f) {
              var obj = {
                dtype: "Assign_Level_Up_Token_To_User",
                logs: f.logs,
                receipt: f.receipt,
                created_at: new Date(),
                reference_id: f.logs[0].args.buyer,
                block_hash: f.logs[0].blockHash,
                transaction_hash: f.logs[0].transactionHash
              }
              LogModel.createLogs(obj).then(function(log) {
                console.log("user logs >>>>>>>>>>>>>>>>", log);
              }).catch((error) => {
                console.log("create assign level up to user error", error);
              })
            }).catch((e) => {
              console.log(e)
            })
          } else {
            console.log("assignLeveluptoUser account is locked ")
          }
        }).catch((err) => {
          console.log(err);
        })
      }).catch(err => {
        console.log("update user with update user with level up error", err)
        throw new Error(err);  
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  buyProduct(data, user) {
    return new Promise((resolve, reject) => {
      try {
        var address = data.address;
        LevelUp.deployed().then(function(i) {
          var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
          if (isUnlock) {
            i.buyProduct(user.wallet_address, data.productId, data.price, address.address, address.state, address.city, address.pincode, address.phone_number, {
              from: CodeConstants.OWNER_ADDRESS,
              gas: 440000
            }).then(function(f) {
              var obj = {
                dtype: "Buy_Product_Log",
                logs: f.logs,
                receipt: f.receipt,
                created_at: new Date(),
                reference_id: f.logs[0].args._orderId,
                block_hash: f.logs[0].blockHash,
                transaction_hash: f.logs[0].transactionHash
              }
              LogModel.createLogs(obj).then(function(log) {
                return resolve(f);
              }).catch((error) => {
                reject(error);
              })
            }).catch((e) => {
              return reject(e)
            })
          } else {
            return reject("account is locked ............");
          }
        }).catch((err) => {
          throw new Error(err);
        })
      } catch (e) {
        throw new Error(e);
      }
    });
  }

  assignTokenToUserEventListner() {
    try {
      let transferEvent;
      LevelUp.deployed().then(function(i) {
        transferEvent = i.Transfer({ fromBlock: 0, toBlock: 'latest' });
        transferEvent.watch(function(err, result) {
          if (err) {
            return;
          }
          var data = result.args;
          var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
          if (isUnlock) {
            i.balanceOf(data.from, { from: CodeConstants.OWNER_ADDRESS, gas: 44000 }).then((fromUser) => {
              userModel.updateUser({ wallet_address: data.from }, { wallet_amount: fromUser }).then((updateUser) => {})
              i.balanceOf(data.to, { from: CodeConstants.OWNER_ADDRESS, gas: 44000 }).then((toUser) => {
                userModel.updateUser({ wallet_address: data.to }, { wallet_amount: toUser }).then((updateUser) => {});
              }).catch((err) => {
                console.log("to update user token err", err);
              })
            }).catch((err) => {
              console.log("from update user token err", err);
            })
          } else {
            console.log("update user token process is locked")
          }
        });
      }).catch((err) => {
        console.log(err);
      })
    } catch (err) {
      console.log(err);
    }
  }

  addProductToStore(data, user){
    return new Promise((resolve, reject) => {
      try{
        LevelUp.deployed().then(function(i) {
          var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
          if (isUnlock) {
            i.addProductToStore(data.product_name, data.selectName, data.imageLink, data.descLink, (data.Price * CodeConstants.DECIMAL), {
              from: CodeConstants.OWNER_ADDRESS,
              gas: 440000
            }).then(function(f) {
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
                  resolve(response);
                }
              });
            }).catch((error) => {
              reject(error);
            })
          } else {
            reject(new Error("unlock not >>>>>>>>>>>>>>>"));
          }
        }).catch((error) => {
          reject(error);
        });
      }catch(err){
        reject(err);
      }
    });
  }
}