import express from 'express';
import _ from 'lodash';
import Service from '../models/service';
import Snapshot from '../models/snapshot';

const router = express.Router();

/*
 * Compute histories from all snapshots and update services
 */
router.post('/', (req, res) => {
  Snapshot.find().exec()
    .then(snapshots => {
      return new Promise((resolve, reject) => {
        const historiesByService = {};
        snapshots.forEach(snapshot => {
          snapshot.get('data').forEach(serviceData => {
            const ref = serviceData.references.trendyjs;
            const history = {
              date: snapshot.get('created_at'),
              npm: {},
              github: {
                subscribers: serviceData.github.subscribers_count,
                network: serviceData.github.network_count,
                watchers: serviceData.github.watchers_count,
                openIssues: serviceData.github.open_issues_count,
                forks: serviceData.github.forks_count,
                stargazers: serviceData.github.stargazers_count
              },
              stackoverflow: {
                count: serviceData.stackoverflow.count
              }
            };
            if (!historiesByService[ref]) {
              historiesByService[ref] = [];
            }
            historiesByService[ref].push(history);
          });
        });
        resolve(historiesByService);
      });
    })
    .then(historiesByService => {
      const promises = [];
      Service.find().exec().then(services => {
        services.forEach(service => {
          const ref = service.get('ref');
          const history = historiesByService[ref];
          promises.push(Service.findOneAndUpdate({ ref }, { history }).exec());
        });
      });
      return Promise.all(promises);
    })
    .then(services => {
      res.send(services);
    });
});

export default router;
