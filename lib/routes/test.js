import express from 'express';
import npmjs from '../infrastructure/repositories/npmjs';

const router = express.Router();

/* GET /test */
router.get('/', (req, res, next) => {
  const services = [
    { serviceRef: 'react', dataSourceRef: 'react' },
    { serviceRef: 'aurelia', dataSourceRef: 'aurelia' },
    { serviceRef: 'ember', dataSourceRef: 'ember-cli' }
  ];
  npmjs.fetchData(services).then(data => {
    res.send(data);
  });
});

export default router;
