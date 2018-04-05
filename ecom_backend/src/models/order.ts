import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    order_number: { type: String, required: true},
    orderId: { type: String },
    order_status: { type: String, default: 'new'},
    price: { type: Number, required: true},
    customer_id: { type: Object, required: true},
    product_id: { type: Object, required: true},
    created_at: { type: Date, default: new Date() },
    updated_at: { type: Date, default: new Date() },
    address:{
        address:{type: String , required: true},
        state:{ type: String , required: true},
        city:{ type: String , required: true},
        pincode:{ type: String ,required: true},
        phone_number:{ type: String ,required: true}
    },
    txHash: { type: String },
    status: { type: String, default: 'Pending' }
});

export var orderModel = mongoose.model('orders', orderSchema);

export function createOrder (data){
    return new Promise((resolve, reject) => {
        var obj = new orderModel(data);
        obj.save().then((doc) => {
            resolve(doc);
        }).catch(e =>{
            reject(e);
        });
    });
};

export function updateOrder (condition, data){
    return new Promise((resolve, reject) => {
        orderModel.findOneAndUpdate(condition, data).then((doc) => {
            resolve(doc);
        }).catch(e =>{
            reject (e);
        });
    });
};

export function getOrders(condition) {
    return new Promise((resolve, reject) => {
        orderModel.aggregate([{$match: condition }, {
            $lookup: {
                from: "users",
                localField: "customer_id",
                foreignField: "_id",
                as: "usersinfo"
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "product_id",
                foreignField: "_id",
                as: "productsinfo"
            }
        }
    ]).then(res => {
        resolve(res);
    }).catch(e => {
        reject(e);
    });
});
}
