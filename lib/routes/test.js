import express from 'express';
import npmjsRepository from '../infrastructure/repositories/npmjs-repository';
import githubRepository from '../infrastructure/repositories/github-repository';

const router = express.Router();

/* GET /test */
router.get('/npmjs', (req, res, next) => {
  const services = [
    { ref: 'react', npmjsPackage: 'react' },
    { ref: 'aurelia', npmjsPackage: 'aurelia' },
    { ref: 'ember', npmjsPackage: 'ember-cli' }
  ];
  npmjsRepository.fetchData(services).then(data => {
    res.send(data);
  });
});

router.get('/github', (req, res, next) => {
  const services = [
    { ref: 'react', githubRepository: 'facebook/react' },
    { ref: 'aurelia', githubRepository: 'aurelia/aurelia' },
    { ref: 'ember', githubRepository: 'emberjs/ember.js' }
  ];
  githubRepository.fetchData(services).then(data => {
    res.send(data);
  });
});

export default router;
