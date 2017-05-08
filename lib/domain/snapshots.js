import request from 'request';
import github from '../infrastructure/clients/github-client';
import Service from '../domain/service';
import Snapshot from '../domain/snapshot';

function fetchNpmData(name, packages) {
  return new Promise((resolve, reject) => {
    const uri = `https://api.npmjs.org/downloads/point/${name}/${packages}`;
    request.get(uri, (error, response, body) => {
      if (error) reject(error);
      resolve({ name, data: JSON.parse(body) });
    });
  });
}

const snapshots = {};

snapshots.fetchAndFeedDataFromReferential = () => {
  return new Promise((resolve, reject) => {
    Service.find().exec().then(refObjects => {
      const services = refObjects.map(refObject => {
        return {
          references: {
            trendyjs: refObject.get('ref'),
            npmjs: refObject.get('npmPackage'),
            github: refObject.get('githubRepository'),
            stackoverflow: refObject.get('stackoverflowTag')
          }
        };
      });
      resolve(services);
    });
  });
};

snapshots.fetchAndFeedDataFromNpm = (services) => {
  return new Promise((resolve, reject) => {
    const packages = services.map(service => service.references.npmjs).join(',');
    const promises = [];
    promises.push(fetchNpmData('last-day', packages));
    promises.push(fetchNpmData('last-week', packages));
    promises.push(fetchNpmData('last-month', packages));
    Promise.all(promises)
      .then((results) => {
        const data = results.reduce((obj, curr) => {
          obj[curr.name] = curr.data;
          return obj;
        }, {});

        services.forEach((service) => {
          const npmPackage = service.references.npmjs;
          service.npmjs = {
            lastDay: data['last-day'][npmPackage],
            lastWeek: data['last-week'][npmPackage],
            lastMonth: data['last-month'][npmPackage]
          };
        });
        resolve(services);
      })
      .catch(err => reject(err));
  });
};

snapshots.fetchAndFeedDataFromGithub = (services) => {
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
};

snapshots.fetchAndFeedDataFromStackoverflow = (services) => {
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
};

snapshots.saveSnapshot = (services) => {
  return new Promise((resolve, reject) => {
    return new Snapshot({
      data: services
    }).save()
      .then(resolve);
  });
};

snapshots.updateServicesData = (snapshot) => {
  return new Promise((resolve, reject) => {
    const promises = [];
    snapshot.get('data').forEach(serviceData => {
      const data = {
        npmjs: {},
        github: {
          url: serviceData.github.html_url,
          lastPush: serviceData.github.pushed_at,
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
      const history = Object.assign({}, data);
      history.date = snapshot.get('created_at');

      promises.push(Service.findOneAndUpdate({ ref: serviceData.references.trendyjs }, {
        data,
        $push: { history }
      }).exec());
    });
    Promise.all(promises).then(() => {
      resolve(snapshot);
    });
  });
};

export default snapshots;