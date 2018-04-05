import * as userModel from './../models/user';
import * as orderModel from './../models/order';
import * as productModel from './../models/product';
import * as logModel from './../models/level_up_log';
export class orderHelper {
    constructor() {
    }

    createOrder(result) {
        try {
            var data = result.args;
            orderModel.updateOrder({txHash: result.transactionHash}, {orderId: data._orderId, status: "Approved"}).then(response => {
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
        } catch(e) {
            throw new Error(e);
        }
    }
}
