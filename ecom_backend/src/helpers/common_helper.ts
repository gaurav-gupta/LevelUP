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
          console.log("isUnlock >>>>>>>>>>>>>>>>>", isUnlock);
          console.log("isUnlock >>>>>>>>>>>>>>>>>", typeof(isUnlock));
          if (isUnlock) {
            console.log(":sssssssss >>>>>>>>>>>>>>>>>>>>>");
            var assignToken = 1 * CodeConstants.DECIMAL;
            i.transfer(resp, assignToken, {
              from: CodeConstants.OWNER_ADDRESS,
              gas: 440000
            }).then(function(f) {
              console.log("fffffffffffffffffffffffff >>>>>>>>>>>>>>>>>>>>>", f);
              console.log(f)
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
              console.log("e >>>>>>>>>>>>>>>>>>>>>>>>>>>> giveLevelUpTokens");
              console.log(e)
            })
          } else {
            console.log("ssssssssssaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa else ")
          }
        }).catch((err) => {
          console.log(err);
        })
      }).catch(err => {
        console.log("update user with update user with level up error", err)
      });
    } catch (e) {
      throw new Error(e);
    }
  }

  buyProduct(data, user) {
    return new Promise((resolve, reject) => {
      try {
        var address = data.address;
        console.log("address >?>>>>>>>>>>>>>>>>>>>>>")
        console.log(address)
        LevelUp.deployed().then(function(i) {
          console.log("levelup >>>>>>>>>>>>>>>>>")
          var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
          console.log("levelup >>>>>>>>>>>>>>>>>", isUnlock)
          if (isUnlock) {
            i.buyProduct(user.wallet_address, data.productId, data.price, address.address, address.state, address.city, address.pincode, address.phone_number, {
              from: CodeConstants.OWNER_ADDRESS,
              gas: 440000
            }).then(function(f) {
              console.log("levelup >>>>>>>>>>>>>>>>>", f)
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
              console.log("sssssssssssssssssssssssssssssssssss", e);
              return reject(e)
            })
          } else {
            console.log("account is locked ............");
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
        transferEvent = i.Transfer({
          fromBlock: 0,
          toBlock: 'latest'
        });
        transferEvent.watch(function(err, result) {
          if (err) {
            console.log(err)
            return;
          }
          console.log("result.args >?>>>>>>>>>>>>>>>>>>>>>>");
          console.log(result.args);
          updateUserTokens(result.args);
        });
      }).catch((err) => {
        console.log(err);
      })
    } catch (err) {
      console.log(err);
    }
  }

  updateUserTokens(data) {
    try {
      LevelUp.deployed().then(function(i) {
        var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
        if (isUnlock) {
          i.balanceOf(data.from, {
            from: CodeConstants.OWNER_ADDRESS,
            gas: 44000
          }).then((fromUser) => {
            userModel.updateUser({
              wallet_address: data.from
            }, {
              wallet_amount: fromUser
            }).then((updateUser) => {})
            i.balanceOf(data.to, {
              from: CodeConstants.OWNER_ADDRESS,
              gas: 44000
            }).then((toUser) => {
              userModel.updateUser({
                wallet_address: data.to
              }, {
                wallet_amount: toUser
              }).then((updateUser) => {});
            }).catch((err) => {
              console.log("to update user token err");
              console.log(err);
            })
          }).catch((err) => {
            console.log("from update user token err");
            console.log(err);
          })
        } else {
          console.log("update user token process is locked")
        }
      }).catch((err) => {
        console.log("err >>>>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log(err)
      });
    } catch (err) {
      console.log("errrrrrrrrrrrrrrrrrrr", err)
    }
  }
}
