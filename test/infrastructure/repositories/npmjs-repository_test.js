import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import npmjsRepository from '../../../lib/infrastructure/repositories/npmjs-repository';
import request from 'request';

describe('Unit | Infrastructure | Repository | NPMJS', function () {

  describe('#fetchData', function () {

    const services = [
      { ref: 'service_A', npmjsPackage: 'dataSource_A' },
      { ref: 'service_B', npmjsPackage: 'dataSource_B' },
      { ref: 'service_C', npmjsPackage: 'dataSource_C' }
    ];

    let getStub;

    beforeEach(function () {
      getStub = stub(request, 'get').callsFake((uri, cb) => {
        cb(null, null, JSON.stringify({}));
      });
    });

    afterEach(function () {
      getStub.restore();
    });

    it('should return a promise', () => {
      return npmjsRepository.fetchData(services);
    });

    it('should return an Object map of service references', () => {
      return npmjsRepository.fetchData(services).then(result => {
        expect(result).to.include.keys('service_A', 'service_B', 'service_C');
      });
    });

    it('should fetch last-day data from NPMJS registry', () => {
      return npmjsRepository.fetchData(services).then(() => {
        expect(getStub).to.have.been.calledWith('https://api.npmjs.org/downloads/point/last-day/dataSource_A,dataSource_B,dataSource_C');
      });
    });

    it('should fetch last-week data from NPMJS registry', () => {
      return npmjsRepository.fetchData(services).then(() => {
        expect(getStub).to.have.been.calledWith('https://api.npmjs.org/downloads/point/last-week/dataSource_A,dataSource_B,dataSource_C');
      });
    });

    it('should fetch last-month data from NPMJS registry', () => {
      return npmjsRepository.fetchData(services).then(() => {
        expect(getStub).to.have.been.calledWith('https://api.npmjs.org/downloads/point/last-month/dataSource_A,dataSource_B,dataSource_C');
      });
    });

    it('should return NPMJS registry last day, week & month data for each given service', () => {
      // given
      const lastDayData = JSON.stringify({
        "dataSource_A": {
          "downloads": 10,
          "package": "dataSource_A",
          "start": "2017-05-07",
          "end": "2017-05-07"
        },
        "dataSource_B": {
          "downloads": 20,
          "package": "dataSource_B",
          "start": "2017-05-07",
          "end": "2017-05-07"
        },
        "dataSource_C": {
          "downloads": 30,
          "package": "dataSource_C",
          "start": "2017-05-07",
          "end": "2017-05-07"
        }
      });
      const lastWeekData = JSON.stringify({
        "dataSource_A": {
          "downloads": 100,
          "package": "dataSource_A",
          "start": "2017-05-01",
          "end": "2017-05-07"
        },
        "dataSource_B": {
          "downloads": 200,
          "package": "dataSource_B",
          "start": "2017-05-01",
          "end": "2017-05-07"
        },
        "dataSource_C": {
          "downloads": 300,
          "package": "dataSource_C",
          "start": "2017-05-01",
          "end": "2017-05-07"
        }
      });
      const lastMonthData = JSON.stringify({
        "dataSource_A": {
          "downloads": 1000,
          "package": "dataSource_A",
          "start": "2017-04-08",
          "end": "2017-05-07"
        },
        "dataSource_B": {
          "downloads": 2000,
          "package": "dataSource_B",
          "start": "2017-04-08",
          "end": "2017-05-07"
        },
        "dataSource_C": {
          "downloads": 3000,
          "package": "dataSource_C",
          "start": "2017-04-08",
          "end": "2017-05-07"
        }
      });
      getStub.onCall(0).callsFake((uri, cb) => {
        cb(null, null, lastDayData);
      });
      getStub.onCall(1).callsFake((uri, cb) => {
        cb(null, null, lastWeekData);
      });
      getStub.onCall(2).callsFake((uri, cb) => {
        cb(null, null, lastMonthData);
      });

      // when
      return npmjsRepository.fetchData(services).then(result => {
        expect(result).to.deep.equal({
          "service_A": {
            "npmjs": {
              "last-day": {
                "downloads": 10,
                "package": "dataSource_A",
                "start": "2017-05-07",
                "end": "2017-05-07"
              },
              "last-week": {
                "downloads": 100,
                "package": "dataSource_A",
                "start": "2017-05-01",
                "end": "2017-05-07"
              },
              "last-month": {
                "downloads": 1000,
                "package": "dataSource_A",
                "start": "2017-04-08",
                "end": "2017-05-07"
              }
            }
          },
          "service_B": {
            "npmjs": {
              "last-day": {
                "downloads": 20,
                "package": "dataSource_B",
                "start": "2017-05-07",
                "end": "2017-05-07"
              },
              "last-week": {
                "downloads": 200,
                "package": "dataSource_B",
                "start": "2017-05-01",
                "end": "2017-05-07"
              },
              "last-month": {
                "downloads": 2000,
                "package": "dataSource_B",
                "start": "2017-04-08",
                "end": "2017-05-07"
              }
            }
          },
          "service_C": {
            "npmjs": {
              "last-day": {
                "downloads": 30,
                "package": "dataSource_C",
                "start": "2017-05-07",
                "end": "2017-05-07"
              },
              "last-week": {
                "downloads": 300,
                "package": "dataSource_C",
                "start": "2017-05-01",
                "end": "2017-05-07"
              },
              "last-month": {
                "downloads": 3000,
                "package": "dataSource_C",
                "start": "2017-04-08",
                "end": "2017-05-07"
              }
            }
          }
        });
      });
    });
  });
});
