import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import stackoverflowRepository from '../../../lib/infrastructure/repositories/stackoverflow-repository';
import request from 'request';

describe('Unit | Infrastructure | Repository | StackOverflow', function () {

  describe('#fetchData', function () {

    const services = [
      { ref: 'service_A', stackoverflowTag: 'tag_A' },
      { ref: 'service_B', stackoverflowTag: 'tag_B' },
      { ref: 'service_C', stackoverflowTag: 'tag_C' }
    ];

    let getStub;

    beforeEach(function () {
      getStub = stub(request, 'get').callsFake((uri, cb) => {
        cb(null, null, JSON.stringify({
          items: [
            {
              count: 10,
              name: "tag_A"
            }, {
              count: 20,
              name: "tag_B"
            }, {
              count: 30,
              name: "tag_C"
            }
          ]
        }));
      });
    });

    afterEach(function () {
      getStub.restore();
    });

    it('should return a promise', () => {
      return stackoverflowRepository.fetchData(services);
    });

    it('should return an Object map of service references', () => {
      return stackoverflowRepository.fetchData(services).then(result => {
        expect(result).to.include.keys('service_A', 'service_B', 'service_C');
      });
    });

    it('should fetch data from StackOverflow', () => {
      return stackoverflowRepository.fetchData(services).then(() => {
        expect(getStub).to.have.been.calledWith({
          gzip: true,
          uri: 'http://api.stackexchange.com/2.2/tags/tag_A;tag_B;tag_C/info?order=desc&sort=popular&site=stackoverflow'
        });
      });
    });

    it('should return StackOverflow data for each given service', () => {
      // given
      const expected = {
        "service_A": {
          "stackoverflow": {
            "tag": 'tag_A',
            "count": 10
          }
        },
        "service_B": {
          "stackoverflow": {
            "tag": 'tag_B',
            "count": 20
          }
        },
        "service_C": {
          "stackoverflow": {
            "tag": 'tag_C',
            "count": 30
          }
        }
      };

      // when
      return stackoverflowRepository.fetchData(services).then((result) => {

        // then
        expect(result).to.deep.equal(expected);
      });
    });
  });
});
