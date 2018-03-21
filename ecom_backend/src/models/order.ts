import * as mongoose from 'mongoose';
var ObjectId = mongoose.Types.ObjectId; 
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  order_number: { type: String, required:true},
  orderId: { type: String, required:true},
  order_status: { type: String, default: 'new'},
  price: { type: Number, required:true},
  customer_id: { type: Object, required:true},
  productId: { type: Object, required:true},
  created_at: { type: Date },
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

export function updateOrder (condition, data){
  return new Promise((resolve, reject) => {
    orderModel.findOneAndUpdate(condition, data).then(function (doc) {
      resolve(doc);
    });
  });
};

export function getOrders (){
  return new Promise((resolve, reject) => {
    orderModel.aggregate([{
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
        localField: "productId",
        foreignField: "_id",
        as: "productsinfo"
      }
    }
    ]).then(res => {
      resolve(res);
    });
  });
};

export function getOrdersUser(id) {
  return new Promise((resolve, reject) => {
    var da = new ObjectId(id);
    orderModel.aggregate([{$match:{customer_id: da}},{
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
        localField: "productId",
        foreignField: "_id",
        as: "productsinfo"
      }
    }
    ]).then(res => {
      resolve(res);
    });
  });
}

export function getOrder(cond) {
  return new Promise((resolve, reject) => {
    orderModel.find(cond).then(function (doc) {
      resolve(doc);
    });
  });
}
