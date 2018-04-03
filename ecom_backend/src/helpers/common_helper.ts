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
                    productsHelper.saveProduct(result);
                });
            }).catch((err) => {
                throw new Error(err);
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
                    ordersHelper.createOrder(result);
                    console.log("setupUserBuyProductEventListner result")
                    console.log(result)
                });
            }).catch((err) => {
                console.log(err);
            })
        } catch(e) {
            throw new Error(e);
        }
    }

    createUserWalletAddress(user, pass) {
        return new Promise((resolve, reject) => {
            try {
                var resp = web3.personal.newAccount(pass);
                user.wallet_address = resp;
                userModel.updateUser({ email: user.email }, user).then(function(user) {
                    resolve(user);
                }).catch(err => {
                    console.log("update user with update user with level up error", err)
                    reject(err);
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    buyProduct(data, user) {
        return new Promise((resolve, reject) => {
            try {
                var address = data.address;
                LevelUp.deployed().then(function(i) {
                    var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
                    if (isUnlock) {
                        i.buyProduct(user.wallet_address, data.productId, data.price, address.address, address.state, address.city, address.pincode, address.phone_number, { from: CodeConstants.OWNER_ADDRESS, gas: 440000 }).then(function(f) {
                            return resolve(f);
                        }).catch((e) => {
                            return reject(e)
                        })
                    }
                }).catch((err) => {
                    return reject(err)
                })
            } catch (e) {
                return reject(e)
            }
        });
    }

    assignTokenToUserEventListner() {
        return new Promise((resolve, reject) => {
            try {
                let transferEvent;
                LevelUp.deployed().then(function(i) {
                    transferEvent = i.Transfer({ fromBlock: 0, toBlock: 'latest' });
                    transferEvent.watch(function(err, result) {
                        if (err) {
                            return;
                        }
                        console.log('result tranfer>>>>>>>>>>>>>>>', result);
                        var data = result.args;
                        LogModel.findLogs({transaction_hash: result.transactionHash}).then((res1: any) => {
                            if(res1.length <= 0 ){
                                var obj = {
                                    dtype: "Transfer_Token",
                                    logs: result,
                                    created_at: new Date(),
                                    reference_id: null,
                                    block_hash: result.blockHash,
                                    transaction_hash: result.transactionHash,
                                    from: data.from,
                                    to: data.to,
                                    tokens: data.tokens
                                }
                                LogModel.createLogs(obj).then(response => {
                                    if (response) {
                                        console.log('response>>>>>>>>>>>>......',response);
                                        var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
                                        if (isUnlock) {
                                            i.balanceOf(data.from, { from: CodeConstants.OWNER_ADDRESS, gas: 44000 }).then((fromUser) => {
                                                userModel.updateUser({ wallet_address: data.from }, { wallet_amount: fromUser }).then((updateUser) => {})
                                                i.balanceOf(data.to, { from: CodeConstants.OWNER_ADDRESS, gas: 44000 }).then((toUser) => {
                                                    userModel.updateUser({ wallet_address: data.to }, { wallet_amount: toUser }).then((updateUser) => {});
                                                }).catch((err) => {
                                                    return reject(err)
                                                })
                                            }).catch((err) => {
                                                return reject(err)
                                            })
                                        }
                                    }
                                }).catch((err) => {
                                    return reject(err)
                                });
                            } else {
                                console.log("Trasaction already created ............")
                            }
                        }).catch((err) => {
                            return reject(err);
                        });
                    })
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    addProductToStore(data, user){
        return new Promise((resolve, reject) => {
            try{
                LevelUp.deployed().then(function(i) {
                    var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
                    if (isUnlock) {
                        i.addProductToStore(data.product_name, data.selectName, data.imageLink, data.descLink, (data.Price * CodeConstants.DECIMAL), { from: CodeConstants.OWNER_ADDRESS, gas: 440000 }).then(function(f) {
                            if (f) {
                                resolve(f);
                            }
                        }).catch((error) => {
                            reject(error);
                        })
                    }
                }).catch((error) => {
                    reject(error);
                });
            }catch(err){
                reject(err);
            }
        });
    }

    assignLevelUpToPublisher(publisher, password, token) {
        try {
            var resp = web3.personal.newAccount(password);
            publisher.wallet_address = resp;
            userModel.updateUser({ email: publisher.email }, publisher).then(function(user) {
                LevelUp.deployed().then(function(i) {
                    var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
                    if (isUnlock) {
                        var assignToken = token * CodeConstants.DECIMAL;
                        i.transfer(resp, assignToken, { from: CodeConstants.OWNER_ADDRESS, gas: 440000 }).then(function(f) {
                            i.contractOwnerApproveSelf(resp, assignToken, {from: CodeConstants.OWNER_ADDRESS, gas: 440000 }).then((approvalLog) => {
                                console.log("approvalLog >>>>>>>>>>>>>>>>>>>>");
                                console.log(approvalLog);
                            }).catch((err) => {
                                console.log("approval error >>>>>>>>>>>>>>", err);
                            })
                        }).catch((e) => {
                            console.log("create assign level up to user error", e);
                        })
                    } else {
                        console.log("account is locked ................")
                    }
                });
            }).catch((err) => {
                console.log("update user validation err >>>>>>>>>>", err);
            });
        } catch (err) {
            return err;
        }
    }

    updateUserToken(publisher, gamer){
        return new Promise((resolve, reject) => {
            try{
                LevelUp.deployed().then(function(i) {
                    var isUnlock = web3.personal.unlockAccount(CodeConstants.OWNER_ADDRESS, CodeConstants.OWNER_PASSWORD, 500)
                    if (isUnlock) {
                        var assignToken = 1 * CodeConstants.DECIMAL;
                        i.transferFrom(publisher.wallet_address, gamer.wallet_address, assignToken, { from: CodeConstants.OWNER_ADDRESS, gas: 440000 }).then(function(f) {
                            resolve(f);
                        }).catch((err) => {
                            reject(err);
                        })
                    }else{
                        console.log("owner account is locked ................")
                    }
                }).catch((err) => {
                    reject(err);
                })
            } catch (err) {
                reject(err)
            }
        });
    }
}
