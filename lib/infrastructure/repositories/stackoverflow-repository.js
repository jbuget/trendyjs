import Repository from './repository';
import request from 'request';

function createMapOfServicesByStackoverflowTags(services) {
  const servicesByStackoverflowTags = {};
  Object.keys(services).forEach(serviceRef => {
    const service = services[serviceRef];
    servicesByStackoverflowTags[service.references.stackoverflowTag] = service;
  });
  return servicesByStackoverflowTags;
}

function getTags(services) {
  const tags = [];
  Object.keys(services).forEach(serviceRef => {
    const service = services[serviceRef];
    tags.push(service.references.stackoverflowTag);
  });
  return tags.join(';');
}

class StackOverflow extends Repository {

  fetchData(services) {
    return new Promise((resolve, reject) => {
      const tags = getTags(services);
      const uri = `http://api.stackexchange.com/2.2/tags/${tags}/info?order=desc&sort=popular&site=stackoverflow`;
      const options = { uri, gzip: true };
      request.get(options, (error, response, body) => {
        const result = Object.assign({}, services);
        const servicesByStackoverflowTags = createMapOfServicesByStackoverflowTags(services);
        const data = JSON.parse(body);
        data.items.forEach(item => {
          const service = servicesByStackoverflowTags[item.name];
          result[service.references.trendyjs].stackoverflow = {
            tag: item.name,
            count: item.count
          };
        });
        return resolve(result);
      });
    });
  }
}

export default new StackOverflow();