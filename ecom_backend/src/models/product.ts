import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var productSchema = new Schema({
    id:{ type: String },
    productId:{ type: String },
    name: { type: String },
    category: { type: String },
    imageLink: { type: String },
    descLink: { type: String },
    price: { type: Number },
    txHash: { type: String },
    status: { type: String, default: 'Pending' }
});

export var productModel = mongoose.model('products', productSchema);

export function getProduct (cond){
    return new Promise((resolve, reject) => {
        productModel.find(cond).then(function (doc) {
            resolve(doc);
        }).catch(e=>{
            reject(e);
        });
    });
};

export function getAllProduct (){
    return new Promise((resolve, reject) => {
        productModel.find().then(function (doc) {
            resolve(doc);
        }).catch(e=>{
            reject(e);
        });
    });
};

export function createProduct (data) {
    var obj = new productModel(data);
    return new Promise((resolve, reject) => {
        obj.save().then(function (doc) {
            resolve(doc);
        }).catch(e=>{
            reject(e);
        });
    });
}

export function updateProduct(condition, data: any ){
    return new Promise((resolve, reject) => {
        productModel.findOneAndUpdate(condition, data).then(function (doc) {
            resolve(doc);
        }).catch(e=>{
            reject(e);
        });
    });
};
