import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var productSchema = new Schema({
  id: { type: String },
  title: { type: String },
});

export var categoryModel = mongoose.model('categories', productSchema);

export function getAllCategories (){
  return new Promise((resolve, reject) => {
    categoryModel.find().then(function (categories) {
      resolve(categories);
    }).catch(e=>{
      reject(e);
    });
  });
};
