import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect, use } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import sinonChai from 'sinon-chai';
import sinonMongoose from 'sinon-mongoose';
import dates from '../../lib/infrastructure/dates';
import Snapshot from '../../lib/domain/snapshot';
import Service  from '../../lib/domain/service';
import snapshots from '../../lib/domain/snapshots';
require('chai').use(sinonChai);

describe.skip('Services | snapshots', function () {

  describe('#fetchAndFeedDataFromReferential', function () {

    beforeEach(function() {
        sinon.stub(Service, 'find');
    });

    afterEach(function() {
        Service.find.restore();
    });

    it('should return a promise resolving with an array of services object initiated from referential data', function (done) {
      // given
      const refObjects = [
        new Service({
          ref: 'trendyjs_serviceA',
          npmPackage: 'npmPackage_serviceA',
          githubRepository: 'githubRepository_serviceA',
          stackoverflowTag: 'stackoverflowTag_serviceA'
        }),
        new Service({
          ref: 'trendyjs_serviceB',
          npmPackage: 'npmPackage_serviceB',
          githubRepository: 'githubRepository_serviceB',
          stackoverflowTag: 'stackoverflowTag_serviceB'
        }),
        new Service({
          ref: 'trendyjs_serviceC',
          npmPackage: 'npmPackage_serviceC',
          githubRepository: 'githubRepository_serviceC',
          stackoverflowTag: 'stackoverflowTag_serviceC'
        })
      ];
      ServiceMock.returns({
        exec: () => Promise.resolve(refObjects)
      });

      // when
      snapshots.fetchAndFeedDataFromReferential().then((services) => {

        // then
        const expectedServices = [{
          references: {
            trendyjs: 'trendyjs_serviceA',
            npmjs: 'npmPackage_serviceA',
            github: 'githubRepository_serviceA',
            stackoverflow: 'stackoverflowTag_serviceA'
          }
        }, {
          references: {
            trendyjs: 'trendyjs_serviceB',
            npmjs: 'npmPackage_serviceB',
            github: 'githubRepository_serviceB',
            stackoverflow: 'stackoverflowTag_serviceB'
          }
        }, {
          references: {
            trendyjs: 'trendyjs_serviceC',
            npmjs: 'npmPackage_serviceC',
            github: 'githubRepository_serviceC',
            stackoverflow: 'stackoverflowTag_serviceC'
          }
        }];
        expect(services).to.deep.equal(expectedServices);
        done();
      });
    });

  });
});