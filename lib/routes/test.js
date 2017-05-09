import express from 'express';
import referentialRepository from '../infrastructure/repositories/referential-repository';
import npmjsRepository from '../infrastructure/repositories/npmjs-repository';
import githubRepository from '../infrastructure/repositories/github-repository';
import stackoverflowRepository from '../infrastructure/repositories/stackoverflow-repository';

const router = express.Router();

router.get('/', (req, res, next) => {
  referentialRepository.fetchData()
    .then(services => npmjsRepository.fetchData(services))
    .then(services => githubRepository.fetchData(services))
    .then(services => stackoverflowRepository.fetchData(services))
    .then(data => {
      res.send(data);
    });
});

export default router;
