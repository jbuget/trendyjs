const GitHubApi = require('github');

const github = new GitHubApi({
/*  debug: true,*/
  protocol: "https",
  host: "api.github.com",
  timeout: 5000
});

github.authenticate({
  type: 'token',
  /*token: '17d6********************************c510'*/
  token: '17d6e41fc18f81da987e239edeb050a9add1c510'
});

export default github;
