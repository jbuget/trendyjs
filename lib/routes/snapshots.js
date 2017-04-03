import express from 'express';
import Snapshot from '../domain/snapshot';
import snapshots from '../domain/snapshots';

const router = express.Router();

/**
 * GET /snapshots
 */
router.get('/', (req, res) => {
  Snapshot.find().exec()
    .then(snapshots => res.send(snapshots))
    .catch(err => res.status(500).send('Exception'));
});

/**
 * GET /snapshots/2017-04-01
 */
router.get('/:date', (req, res) => {
  Snapshot.findOneByDate(req.params.date).exec()
    .then(snapshot => res.send(snapshot))
    .catch(err => res.status(500).send('Oops!'));
});

/**
 * POST /snapshots
 */
router.post('/', (req, res) => {
  Snapshot.findOneOfToday().exec().then(snapshot => {
    if (snapshot) {
      res.send(snapshot);
    } else {
      snapshots.fetchAndFeedDataFromReferential()
        .then(snapshots.fetchAndFeedDataFromNpm)
        .then(snapshots.fetchAndFeedDataFromGithub)
        .then(snapshots.fetchAndFeedDataFromStackoverflow)
        .then(snapshots.saveSnapshot)
        .then(snapshots.updateServicesData)
        .then(snapshot => res.send(snapshot))
        .catch(err => {
          throw new Error(err)
        });
    }
  })
    .catch(err => res.status(500).send('Unexpected exception!'));
});

export default router;
