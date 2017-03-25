import express from 'express';
import Snapshot from '../models/snapshot';

const router = express.Router();

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.post('/', (req, res) => {
  new Snapshot({
    title: req.body.title,
    author: req.body.author
  }).save().then(snapshot => {
    res.send(snapshot);
  });
});

module.exports = router;
