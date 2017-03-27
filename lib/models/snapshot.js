const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  data: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Snapshot', schema);