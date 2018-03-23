import * as userModel from './../models/user';
import * as orderModel from './../models/order';
import * as productModel from './../models/product';
export class productHelper {
  //save product
   saveProduct(data){
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
          productModel.createProduct(obj).then(response => {
            console.log("product created successfully", response);
          })
        }else{
          console.log("product already created ............")
        }
      });
    } catch(err){
      // console.log("saveProduct >>>>>>>>>>>", err);
        throw new Error(err);
    }
  }
}
