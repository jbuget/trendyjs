const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  ref: String,
  name: String,
  description: String,
  npmPackage: String,
  githubRepository: String,
  stackoverflowTag: String,
  history: Array
});

module.exports = mongoose.model('Service', schema);