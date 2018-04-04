import * as userModel from './../models/user';
import * as orderModel from './../models/order';
import * as productModel from './../models/product';
import * as logModel from './../models/level_up_log';
import { userHelper } from './user_helper';
export class orderHelper {
    private userhelper: userHelper;
    constructor() {
        this.userhelper = new userHelper();
    }

    createOrder(result) {
        try {
            var data = result.args;
            orderModel.getOrder({orderId: parseInt(data._orderId)}).then((order:any) => {
                if(order.length > 0 ){
                    throw new Error("Order already created >.......");
                }else{
                    userModel.getUser({wallet_address: data.buyer}).then((user:any) => {
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
                                        var Lobj = {
                                            dtype: "Buy_Product_Log",
                                            logs: result,
                                            created_at: new Date(),
                                            reference_id: data._orderId,
                                            block_hash: result.blockHash,
                                            transaction_hash: result.transactionHash
                                        }
                                        logModel.createLogs(Lobj).then(function(log) {
                                        }).catch((error) => {
                                            throw new Error(error);
                                        })
                                    }).catch((err) =>{
                                        throw new Error(err);
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
                        throw new Error(err);
                    })
                }
            }).catch((err) => {
                throw new Error(err);
            })
        } catch(e) {
            throw new Error(e);
        }
    }
}
