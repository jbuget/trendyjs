import Repository from './repository';
import GitHubClient from '../clients/github-client';

function fetchGitHubData(services) {
  const promises = [];
  services.forEach((service) => {
    const githubRepository = service.githubRepository;
    const repoFullName = githubRepository.split('/');
    const user = repoFullName[0];
    const repo = repoFullName[1];
    const repository = GitHubClient.getRepoDetails(user, repo);
    promises.push(repository);
  });
  return Promise.all(promises);
}

function createMapOfServicesByGithubRepo(services) {
  return services.reduce((obj, service) => {
    obj[service.githubRepository] = service;
    return obj;
  }, {});
}

class GitHub extends Repository {

  fetchData(services) {
    return new Promise((resolve, reject) => {

      fetchGitHubData(services)
        .then(repositories => {
          const result = {};
          const servicesByGithubRepo = createMapOfServicesByGithubRepo(services);
          repositories.forEach(repository => {
            const repoFullName = repository.data['full_name'];
            const service = servicesByGithubRepo[repoFullName];
            result[service.ref] = {
              github: {
                repository: repository.data['full_name'],
                stars: repository.data['stargazers_count'],
                forks: repository.data['forks_count'],
                openIssues: repository.data['open_issues_count'],
                watchers: repository.data['subscribers_count']
              }
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