const GitHubApi = require('github-api');

const github = new GitHubApi({
  /*token: '17d6********************************c510'*/
  token: '17d6e41fc18f81da987e239edeb050a9add1c510'
});

github.getRepoDetails = (user, repo) => {
  return github.getRepo(user, repo).getDetails();
};

export default github;
