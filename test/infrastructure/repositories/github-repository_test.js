import { describe, it, beforeEach, afterEach } from 'mocha';
import { expect } from 'chai';
import { stub } from 'sinon';

import githubClient from '../../../lib/infrastructure/clients/github-client';
import githubRepository from '../../../lib/infrastructure/repositories/github-repository';

describe('Unit | Infrastructure | Repository | GitHub', function () {

  describe('#fetchData', function () {

    const services = {
      'service_A': { references: { trendyjs: 'service_A', githubRepository: 'user_A/repo_A' } },
      'service_B': { references: { trendyjs: 'service_B', githubRepository: 'user_B/repo_B' } },
      'service_C': { references: { trendyjs: 'service_C', githubRepository: 'user_C/repo_C' } }
    };

    let getRepoDetailsStub;

    beforeEach(function () {
      const serviceData_A = {
        data: {
          id: 1,
          full_name: 'user_A/repo_A',
          stargazers_count: 10, // stars
          forks_count: 100, // forks
          open_issues_count: 1000, // open issues
          subscribers_count: 10000 // watchers
        }
      };
      const serviceData_B = {
        data: {
          id: 2,
          full_name: 'user_B/repo_B',
          stargazers_count: 20,
          forks_count: 200,
          open_issues_count: 2000,
          subscribers_count: 20000
        }
      };
      const serviceData_C = {
        data: {
          id: 3,
          full_name: 'user_C/repo_C',
          stargazers_count: 30,
          forks_count: 300,
          open_issues_count: 3000,
          subscribers_count: 30000
        }
      };

      getRepoDetailsStub = stub(githubClient, 'getRepoDetails');
      getRepoDetailsStub.onCall(0).resolves(serviceData_A);
      getRepoDetailsStub.onCall(1).resolves(serviceData_B);
      getRepoDetailsStub.onCall(2).resolves(serviceData_C);
    });

    afterEach(function () {
      getRepoDetailsStub.restore();
    });

    it('should return a promise', () => {
      return githubRepository.fetchData(services);
    });

    it('should return an Object map of service references', () => {
      return githubRepository.fetchData(services).then(result => {
        expect(result).to.include.keys('service_A', 'service_B', 'service_C');
      });
    });

    it('should call GitHub API client for each service', () => {
      return githubRepository.fetchData(services).then(result => {
        expect(getRepoDetailsStub).to.have.been.calledWith('user_A', 'repo_A');
        expect(getRepoDetailsStub).to.have.been.calledWith('user_B', 'repo_B');
        expect(getRepoDetailsStub).to.have.been.calledWith('user_C', 'repo_C');
      });
    });

    it('should return GitHub registry for each given service', () => {
      return githubRepository.fetchData(services).then(result => {
        expect(result).to.deep.equal({
          "service_A": {
            references: {
              trendyjs: 'service_A',
              githubRepository: 'user_A/repo_A'
            },
            github: {
              "repository": 'user_A/repo_A',
              "stars": 10,
              "forks": 100,
              "openIssues": 1000,
              "watchers": 10000
            }
          },
          "service_B": {
            references: {
              trendyjs: 'service_B',
              githubRepository: 'user_B/repo_B'
            },
            github: {
              "repository": 'user_B/repo_B',
              "stars": 20,
              "forks": 200,
              "openIssues": 2000,
              "watchers": 20000
            }
          },
          "service_C": {
            references: {
              trendyjs: 'service_C',
              githubRepository: 'user_C/repo_C'
            },
            github: {
              "repository": 'user_C/repo_C',
              "stars": 30,
              "forks": 300,
              "openIssues": 3000,
              "watchers": 30000
            }
          },
        });
      });

    });

  });
});
