const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
  data: Array,
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Snapshot', schema);