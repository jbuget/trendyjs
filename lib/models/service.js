const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const schema = new Schema({
  name: String,
  ref: String,
  npmPackage: String,
  githubRepository: String,
  stackoverflowTag: String
});

module.exports = mongoose.model('Service', schema);