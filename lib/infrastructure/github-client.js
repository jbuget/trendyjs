const GitHubApi = require('github');

const github = new GitHubApi({
/*  debug: true,*/
  protocol: "https",
  host: "api.github.com",
  timeout: 5000
});

/*
github.authenticate({
  type: 'token',
  token: '17d6********************************c510'
});
*/

export default github;
