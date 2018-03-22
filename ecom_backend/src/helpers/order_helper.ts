import * as userModel from './../models/user';
import * as orderModel from './../models/order';
import * as productModel from './../models/product';
import { userHelper } from './user_helper';

export class orderHelper {
  private userhelper: userHelper;
  constructor() {
    this.userhelper = new userHelper();
  }
  createOrder(data) {
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
                     this.userhelper.updateUserToken(user[0], user[0].wallet_amount - product[0].price);
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

}
