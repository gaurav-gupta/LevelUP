import * as mongoose from 'mongoose';
var Schema = mongoose.Schema;

var publisherSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  uuid: { type: String, required: true },
  token: { type: Number, required: true, default: 0 },
  website_url: { type: Number, required: true }
});

export var publisherModel = mongoose.model('publishers', publisherSchema);