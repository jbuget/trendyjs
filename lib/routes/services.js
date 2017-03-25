import express from 'express';
import Service from '../models/service';

const router = express.Router();

/*
 * List
 */
router.get('/', (req, res, next) => {
  Service.find().sort({ name: 'asc' }).exec().then(services => {
    res.render('services', { services });
  });
});

router.get('/json', (req, res, next) => {
  Service.find().exec().then(services => {
    res.send(services);
  });
});

/*
 * Save
 */
router.post('/', (req, res) => {
  const service = new Service({
    name: req.body.serviceName,
    ref: req.body.serviceRef,
    npmPackage: req.body.npmPackage,
    githubRepository: req.body.githubRepository,
    stackoverflowTag: req.body.stackoverflowTag
  });
  service.save().then(() => res.redirect('/services'));
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
