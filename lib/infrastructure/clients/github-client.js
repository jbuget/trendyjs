const GitHubApi = require('github-api');

const github = new GitHubApi({
  token: process.env.GITHUB_TOKEN
});

github.getRepoDetails = (user, repo) => {
  return github.getRepo(user, repo).getDetails();
};

export default github;
