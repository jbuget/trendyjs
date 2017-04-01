import { describe, it } from 'mocha';
import { expect } from 'chai';

/*
 function _findSnapshotOfToday() {
 return new Promise((resolve, reject) => {
 const today = new Date();
 today.setHours(0, 0, 0, 0);
 const tomorrow = new Date();
 tomorrow.setDate(today.getDate() + 1);
 tomorrow.setHours(0, 0, 0, 0);

 Snapshot.findOne({
 created_at: {
 $gte: today,
 $lt: tomorrow
 }
 }).exec()
 .then(resolve)
 .catch(reject);
 });
 }
 */

describe('Services | snapshots', function () {

  describe('#findSnapshotOfToday()', function () {

    // TODO

  });
});