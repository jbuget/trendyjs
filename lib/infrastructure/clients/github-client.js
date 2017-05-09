const GitHubApi = require('github-api');

const github = new GitHubApi({
  /*token: '17d6********************************c510'*/
  token: '3ab486829fe5ad361450196f708b8e4ac41c3caf'
});

github.getRepoDetails = (user, repo) => {
  return github.getRepo(user, repo).getDetails();
};

export default github;
