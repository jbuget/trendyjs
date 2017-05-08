import Repository from './repository';

class StackOverflow extends Repository {

  fetchData(services) {
    return new Promise((resolve, reject) => {
      const result = {};
      services.forEach(service => {
        result[service.ref] = {};
      });
      resolve(result);
    });
  }

}

export default new StackOverflow();