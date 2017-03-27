import express from 'express';
import request from 'request';
import github from '../infrastructure/github-client';
import Service from '../models/service';
import Snapshot from '../models/snapshot';

const router = express.Router();

function _findSnapshotOfToday() {
  return new Promise((resolve, reject) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    Snapshot.findOne({
      created_at: {
        $gte: today,
        $lt: tomorrow
      }
    }).exec()
      .then(resolve)
      .catch(reject);
  });
}

function _fetchAndFeedDataFromReferential() {
  return new Promise((resolve, reject) => {
    const services = [];
    Service.find().exec().then(refObjects => {
      refObjects.forEach(refObject => {
        services.push({
          references: {
            trendyjs: refObject.get('ref'),
            npm: refObject.get('npmPackage'),
            github: refObject.get('githubRepository'),
            stackoverflow: refObject.get('stackoverflowTag')
          }
        });
      });
      resolve(services);
    });
  });
}

function _fetchAndFeedDataFromNpm(services) {
  return new Promise((resolve, reject) => {
    resolve(services);
  });
}

function _fetchAndFeedDataFromGithub(services) {
  return new Promise((resolve, reject) => {
    const servicesByGithubRepo = services.reduce((obj, service) => {
      obj[service.references.github] = service;
      return obj;
    }, {});
    const promises = [];
    services.forEach((service) => {
      const githubRef = service.references.github;
      const repoFullName = githubRef.split('/');
      const owner = repoFullName[0];
      const repo = repoFullName[1];
      const repository = github.repos.get({ owner, repo });
      promises.push(repository);
    });
    Promise.all(promises)
      .then((repositories) => {
        repositories.forEach(repository => {
          servicesByGithubRepo[repository.data.full_name].github = repository.data;
        });
        resolve(services);
      })
      .catch(reject);
  });
}

function _fetchAndFeedDataFromStackoverflow(services) {
  return new Promise((resolve, reject) => {
    const servicesByStackoverflowTags = services.reduce((obj, service) => {
      obj[service.references.stackoverflow] = service;
      return obj;
    }, {});
    const tags = services.map(service => service.references.stackoverflow).join(';');
    const uri = `http://api.stackexchange.com/2.2/tags/${tags}/info?order=desc&sort=popular&site=stackoverflow`;
    const options = { uri, gzip: true };
    request(options, (err, response, body) => {
      if (err) return reject(err);
      const data = JSON.parse(body);
      data.items.forEach(item => {
        servicesByStackoverflowTags[item.name].stackoverflow = item;
      });
      return resolve(services);
    });
  });
}

function _saveSnapshot(services) {
  return new Promise((resolve, reject) => {
    return new Snapshot({
      data: services
    }).save()
      .then(resolve);
  });
}

router.post('/', (req, res) => {
  _findSnapshotOfToday()
    .then(snapshot => {
      if (snapshot) {
        res.send(snapshot)
      } else {
        _fetchAndFeedDataFromReferential()
          .then(_fetchAndFeedDataFromNpm)
          .then(_fetchAndFeedDataFromGithub)
          .then(_fetchAndFeedDataFromStackoverflow)
          .then(_saveSnapshot)
          .then(snapshot => res.send(snapshot))
          .catch(err => res.status(500).send('Oops!'));
      }
    })
    .catch(err => res.status(500).send('Unexpected exception!'));
});

router.get('/', (req, res) => {
  res.send('respond with a resource');
});

router.get('/:date', (req, res) => {
  const queryDate = req.params.date;
  const searchDate = new Date(`${queryDate}T00:00:00.000Z`);
  const nextDate = new Date();
  nextDate.setDate(searchDate.getDate() + 1);
  Snapshot.findOne({
    created_at: {
      $gte: searchDate,
      $lt: nextDate
    }
  }).exec()
    .then(snapshot => {
      res.send(snapshot);
    })
    .catch(err => res.status(500).send('Oops!'));
});


module.exports = router;
