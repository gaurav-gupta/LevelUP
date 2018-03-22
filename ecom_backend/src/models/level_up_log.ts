import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var txLogSchema = new Schema({
  id:{ type: String },
  receipt: {type: Object},
  logs: { type: Array },
  dtype: {type: String},
  created_at: {type: Date},
  reference_id: {type: String},
  block_hash: {type: String},
  transaction_hash: {type: String}
});

export var LogsModel = mongoose.model('levelUpLogs', txLogSchema);

export function createLogs (data) {
  return new Promise((resolve, reject) => {
    var obj = new LogsModel(data);
    obj.save().then(function (doc) {
      resolve(doc);
    }).catch(e =>{
      reject(e);
    });
  });
}
