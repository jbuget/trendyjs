import Repository from './repository';
import request from 'request';

function fetchNpmData(name, services) {
  return new Promise((resolve, reject) => {
    const packages = services.map(service => service.dataSourceRef).join(',');
    const uri = `https://api.npmjs.org/downloads/point/${name}/${packages}`;
    request.get(uri, (error, response, body) => {
      if (error) reject(error);
      resolve({ name, data: body });
    });
  });
}

class NPMjs extends Repository {

  fetchData(services) {
    return new Promise((resolve, reject) => {
      const promises = [];
      promises.push(fetchNpmData('last-day', services));
      promises.push(fetchNpmData('last-week', services));
      promises.push(fetchNpmData('last-month', services));
      Promise.all(promises)
        .then(npmData => {
          const result = {};
          services.forEach(service => {
            result[service.serviceRef] = {
              "last-day": npmData[0].data[service.dataSourceRef],
              "last-week": npmData[1].data[service.dataSourceRef],
              "last-month": npmData[2].data[service.dataSourceRef]
            };
          });
          resolve(result);
        })
        .catch(err => reject(err));
    });
  }

}

export default new NPMjs();