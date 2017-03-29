import express from 'express';
import Service from '../models/service';

const router = express.Router();

/*
 * List
 */
router.get('/', (req, res) => {
  Service.find().sort({ name: 'asc' }).exec().then(services => {
    res.render('services', { services });
  });
});

router.get('/json', (req, res) => {
  Service.find().exec().then(services => {
    res.send(services);
  });
});

/*
 * New
 */
router.get('/new', (req, res) => {
  res.render('service-form', { readOnly: true, service: new Service() });
});

/*
 * Edit
 */
router.get('/:ref/edit', (req, res) => {
  Service.findOne({ ref: req.params.ref })
    .exec()
    .then(service => {
      res.render('service-form', { readOnly: false, service });
    });
});

/*
 * Save or update
 */
router.post('/', (req, res) => {
  const query = { 'ref': req.body.ref };
  Service.findOneAndUpdate(query, req.body, { upsert: true }, (err, doc) => {
    if (err) return res.send(500, { error: err });
    res.redirect('/services');
  });
});

/*
 * Get
 */
router.get('/:ref', (req, res) => {
  Service.findOne({ ref: req.params.ref })
    .exec()
    .then(service => {
      res.render('service', { service });
    });
});

module.exports = router;
