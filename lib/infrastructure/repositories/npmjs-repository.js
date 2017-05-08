import Repository from './repository';
import request from 'request';

function fetchNpmData(name, services) {
  return new Promise((resolve, reject) => {
    const packages = services.map(service => service.npmjsPackage).join(',');
    const uri = `https://api.npmjs.org/downloads/point/${name}/${packages}`;
    request.get(uri, (error, response, body) => {
      if (error) reject(error);
      resolve({ name, data: JSON.parse(body) });
    });
  });
}

function fetchNpmDataForLastDayWeekAndMonth(services) {
  const promises = [];
  promises.push(fetchNpmData('last-day', services));
  promises.push(fetchNpmData('last-week', services));
  promises.push(fetchNpmData('last-month', services));
  return Promise.all(promises);
}

class NPMJS extends Repository {

  fetchData(services) {
    return new Promise((resolve, reject) => {
      fetchNpmDataForLastDayWeekAndMonth(services)
        .then(npmData => {
          const result = {};
          services.forEach(service => {
            result[service.ref] = {
              "npmjs": {
                "last-day": npmData[0].data[service.npmjsPackage],
                "last-week": npmData[1].data[service.npmjsPackage],
                "last-month": npmData[2].data[service.npmjsPackage]
              }
            };
          });
          resolve(result);
        })
        .catch(err => reject(err));
    });
  }
}

export default new NPMJS();