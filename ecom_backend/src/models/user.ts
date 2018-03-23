import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var userSchema = new Schema({
  id:{type: String},
  first_name: { type: String ,required:true},
  last_name: { type: String , required: true},
  password: { type: String ,required:true},
  email: { type: String ,required:true},
  roles: { type: String , required:true, default: "user"},
  wallet_address: { type: String , default: '' },
  wallet_amount: {type: Number, default: 0},
  uuid: { type: String, required: false },
  website_url: { type: String, required: false }
});

export var userModel = mongoose.model('users', userSchema);

export async function createUser(data){
  var obj = new userModel(data);
  return new Promise((resolve, reject) => {
    obj.save().then(function (doc) {
      resolve(doc);
    }).catch(e=>{
      reject(e);
    });
  });
};

export function getUser(condition) {
  return new Promise((resolve, reject) => {
    userModel.find(condition).then(function (doc) {
      resolve(doc);
    }).catch(e=>{
      reject(e);
    });
  });
};

export function getAllUser() {
  return new Promise((resolve, reject) => {
    userModel.find().then(function (doc) {
      resolve(doc);
    }).catch(e=>{
      reject(e);
    });
  });
};

export function updateUser(condition, data: any ){
  return new Promise((resolve, reject) => {
    userModel.findOneAndUpdate(condition, data).then(function (doc) {
      resolve(doc);
    }).catch(e=>{
      reject(e);
    });
  });
};

export function deleteUser (condition){
  return new Promise((resolve, reject) => {
    userModel.findOneAndRemove(condition).then(function (doc) {
      resolve(doc);
    }).catch(e=>{
      reject(e);
    });
  });
};

export async function createPublisher(data){
  var obj = new userModel(data);
  return new Promise((resolve, reject) => {
    obj.save().then(function (doc) {
      resolve(doc);
    }).catch(e=>{
      reject(e);
    });
  });
};

export function getPublisher(data) {
  return new Promise((resolve, reject) => {
    userModel.find(data).then(function (doc) {
      resolve(doc);
    }).catch(e=>{
      reject(e);
    });
  });
};
