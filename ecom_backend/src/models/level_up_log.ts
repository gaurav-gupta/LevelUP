import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var txLogSchema = new Schema({
    id:{ type: String },
    logs: { type: Object },
    dtype: {type: String},
    created_at: {type: Date},
    reference_id: {type: String},
    block_hash: {type: String},
    transaction_hash: {type: String},
    from: {type: String, default: null},
    to: {type: String, default: null},
    tokens: {type: Number, default: 0}
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

export function findLogs (condition) {
    return new Promise((resolve, reject) => {
        LogsModel.find(condition).then(function (doc) {
            resolve(doc);
        }).catch(e =>{
            reject(e);
        });
    });
}

export function getUserTransaction (data) {
    return new Promise((resolve, reject) => {
        LogsModel.aggregate([{$match: {'dtype': "Transfer_Token", $or: [{'to': data[0].wallet_address}, {'from': data[0].wallet_address}]}},
        {
            $lookup: {
                from: "users",
                localField: "from",
                foreignField: "wallet_address",
                as: "usersInfoFrom"
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "to",
                foreignField: "wallet_address",
                as: "usersInfoTo"
            }
        }]).then(res => {
            resolve(res);
        }).catch(e=>{
            reject(e);
        });
    });
}
