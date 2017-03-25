import express from 'express';
import GitHubApi from 'github';
import Service from '../models/service';

const router = express.Router();

const github = new GitHubApi({
  // optional
  debug: true,
  protocol: "https",
  host: "api.github.com", // should be api.github.com for GitHub
  headers: {
    "user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
  },
  followRedirects: false, // default: true; there's currently an issue with non-get redirects, so allow ability to disable follow-redirects
  timeout: 5000
});

github.authenticate({
  type: "token",
  token: "e380692d215fa30b29578c74605e47266cf4cbb9"
});

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
router.get('/:name', (req, res) => {
  let service;
  Service.findOne({ name: req.params.name })
    .exec()
    .then(fetchedService => {
      service = fetchedService;
      return github.repos.get({ owner: 'jbuget', repo: 'trendyjs' });
    })
    .then(repo => {
      res.render('service', { service, github: repo.data });
    });
});

module.exports = router;
