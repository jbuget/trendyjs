import express from 'express';
import Service from '../models/service';

const router = express.Router();

router.get('/', (req, res, next) => {
  Service.find().exec().then(services => {
    res.render('services', { services });
  });
});

router.post('/', (req, res) => {
  new Service({
    name: req.body.name
  }).save().then(service => {
    res.send(service);
  });
});

module.exports = router;
