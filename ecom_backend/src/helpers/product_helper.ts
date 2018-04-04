import * as userModel from './../models/user';
import * as orderModel from './../models/order';
import * as productModel from './../models/product';
import * as logModel from './../models/level_up_log';
export class productHelper {
    constructor() {
    }
    //save product
    saveProduct(result){
        try{
            var data = result.args;
            var obj = {
                productId: data._productId,
                name: data._name,
                category: data._category,
                imageLink: data._imageLink,
                descLink: data._descLink,
                price: data._price
            }
            productModel.updateProduct({txHash: result.transactionHash}, {productId: data._productId, status: "Approved"}).then(response => {
                var lobj = {
                    dtype: "Add_Product_To_Store_Log",
                    logs: result,
                    created_at: new Date(),
                    reference_id: data._productId,
                    block_hash: result.blockHash,
                    transaction_hash: result.transactionHash
                }
                logModel.createLogs(lobj).then(f => {
                    console.log("product created successfully", response);
                }).catch((err) => {
                    throw err;
                })
            }).catch((err) => {
                console.log("updateProduct >>>>>>>>>>>", err);
            })
        } catch(err){
            console.log("saveProduct >>>>>>>>>>>", err);
        }
    }
}
