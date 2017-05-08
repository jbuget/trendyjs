import Repository from './repository';
import request from 'request';

class StackOverflow extends Repository {

  fetchData(services) {
    return new Promise((resolve, reject) => {
      const tags = services.map(service => service.stackoverflowTag).join(';');
      const uri = `http://api.stackexchange.com/2.2/tags/${tags}/info?order=desc&sort=popular&site=stackoverflow`;
      const options = { uri, gzip: true };
      request.get(options, (error, response, body) => {
        const result = {};

        const servicesByStackoverflowTags = services.reduce((obj, service) => {
          obj[service.stackoverflowTag] = service;
          return obj;
        }, {});

        const data = JSON.parse(body);
        data.items.forEach(item => {
          const service = servicesByStackoverflowTags[item.name];
          result[service.ref] = {
            stackoverflow: {
              tag: item.name,
              count: item.count
            }
          };
        });
        return resolve(result);
      });
    });
  }
}

export default new StackOverflow();