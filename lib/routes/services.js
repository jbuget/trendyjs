import express from 'express';
import Service from '../domain/service';
import services from '../domain/services';

const router = express.Router();

/**
 * List
 * GET /services
 */
router.get('/', (req, res) => {
  services.getAllServices().then(services => {
    res.render('pages/services', { services });
  });
});

/**
 * List
 * GET /services/json
 */
router.get('/json', (req, res) => {
  services.getAllServices().then(services => {
    res.send(services);
  });
});

/**
 * New
 * GET /services/new
 */
router.get('/new', (req, res) => {
  res.render('pages/service-form', { readOnly: true, service: new Service() });
});

/*
 * Edit
 * GET /services/emberjs/edit
 */
router.get('/:ref/edit', (req, res) => {
  services.getService(req.params.ref).then(service => {
    res.render('pages/service-form', { readOnly: false, service });
  });
});

/*
 * Save or update
 * POST /services
 */
router.post('/', (req, res) => {
  services.saveOrUpdateService(req.body).then(err => {
    if (err) return res.send(500, { error: err });
    res.redirect('/services');
  });
});

/*
 * Get
 * GET /services/emberjs
 */
router.get('/:ref', (req, res) => {
  services.getService(req.params.ref).then(service => {
    res.render('pages/service', { service });
  });
});

/*
 * Get
 * GET /services/emberjs/json
 */
router.get('/:ref/json', (req, res) => {
  services.getService(req.params.ref).then(service => {
    res.send(service);
  });
});

export default router;
