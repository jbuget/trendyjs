const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  ref: String,
  name: String,
  description: String,
  npmPackage: String,
  githubRepository: String,
  stackoverflowTag: String,
  history: Array,
  data: Schema.Types.Mixed
});

export default mongoose.model('Service', schema);