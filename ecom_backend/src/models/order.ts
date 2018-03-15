import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  order_number: { type: String ,required:true},
  order_status: { type: String, default: 'new'},
  price: { type: Number , required:true},
  customer_id: { type: String , required:true},
  product_name:{type: String , required:true},
  date: { type: Date },
  created_at: { type: Date , default: null},
  updated_at: { type: Date },
  address:{
    address:{type: String , required:true},
    state:{ type: String , required:true},
    city:{ type: String , required:true},
    pincode:{ type: String ,required:true },
    phone_number:{ type: String ,required:true}
  }
});

export var orderModel = mongoose.model('orders', orderSchema);

export function createOrder (data){
  var obj = new orderModel(data);
  return new Promise((resolve, reject) => {
    obj.save().then(function (doc) {
      resolve(doc);
    }).catch(e =>{
      reject (e);
    });
  });
};

export function updateOrder (order_number, data){
  return new Promise((resolve, reject) => {
    orderModel.findOneAndUpdate({order_number: order_number},data).then(function (doc) {
      resolve(doc);
    });
  });
};

export function getOrders (){
  return new Promise((resolve, reject) => {
    orderModel.find().then(function (doc) {
      resolve(doc);
    });
  });
};

export function getOrdersUser(id) {
  return new Promise((resolve, reject) => {
    orderModel.find({customer_id:id}).then(function (doc) {
      resolve(doc);
    });
  });
}