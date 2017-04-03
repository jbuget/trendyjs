import dates from '../infrastructure/dates';
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const schema = new Schema({
  data: Array,
  created_at: { type: Date, default: Date.now }
});

schema.statics.findOneOfToday = (cb) => {
  return this.findOne({
    created_at: {
      $gte: dates.today(),
      $lt: dates.tomorrow()
    }
  }, cb);
};

schema.statics.findOneByDate = (date, cb) => {
  const completeDate = new Date(`${date}T00:00:00.000Z`);
  const nextDate = new Date();
  nextDate.setDate(completeDate.getDate() + 1);
  return this.findOne({
    created_at: {
      $gte: completeDate,
      $lt: nextDate
    }
  }, cb);
};

export default mongoose.model('Snapshot', schema);