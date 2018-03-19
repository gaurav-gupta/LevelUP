import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var txLogSchema = new Schema({
  id:{ type: String },
  logs: { type: Array }
});

export var productTxLogsModel = mongoose.model('productTxLogs', txLogSchema);

export function createLogs (data) {
  return new Promise((resolve, reject) => {
    var obj = new productTxLogsModel(data);
    obj.save().then(function (doc) {
      resolve(doc);
    });
  });
}