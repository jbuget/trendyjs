const GitHubApi = require('github');

const github = new GitHubApi({
  debug: true,
  protocol: "https",
  host: "api.github.com",
  timeout: 5000
});

export default github;
