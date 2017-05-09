import Repository from './repository';
import GitHubClient from '../clients/github-client';

function fetchGitHubData(services) {
  const promises = [];
  Object.keys(services).forEach((serviceRef) => {
    const service = services[serviceRef];
    const githubRepository = service.references.githubRepository;
    const repoFullName = githubRepository.split('/');
    const user = repoFullName[0];
    const repo = repoFullName[1];
    const repository = GitHubClient.getRepoDetails(user, repo);
    promises.push(repository);
  });
  return Promise.all(promises);
}

function createMapOfServicesByGithubRepo(services) {
  const servicesByGithubRepo = {};
  Object.keys(services).forEach((serviceRef) => {
    const service = services[serviceRef];
    servicesByGithubRepo[service.references.githubRepository] = service;
  });
  return servicesByGithubRepo;
}

class GitHub extends Repository {

  fetchData(services) {
    return new Promise((resolve, reject) => {

      fetchGitHubData(services)
        .then(repositories => {
          const result = Object.assign({}, services);
          const servicesByGithubRepo = createMapOfServicesByGithubRepo(services);
          repositories.forEach(repository => {
            const repoFullName = repository.data['full_name'];
            const service = servicesByGithubRepo[repoFullName];
            result[service.references.trendyjs].github = {
              repository: repository.data['full_name'],
              stars: repository.data['stargazers_count'],
              forks: repository.data['forks_count'],
              openIssues: repository.data['open_issues_count'],
              watchers: repository.data['subscribers_count']
            };
          });
          resolve(result);
        })
        .catch(err => {
          reject(err)
        });
    });
  }
}

export default new GitHub();