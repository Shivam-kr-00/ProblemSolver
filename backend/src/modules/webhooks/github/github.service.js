import { markAsPendingContributor, addContributorByGithubMerge, removePendingContributor } from "../../problems/problem.service.js"
import { markTaskCompletedFromWebhook } from "../../tasks/task.service.js";

export const githubWebhookService = async (event, payload) => {

  if (event !== "pull_request") return;

  const action = payload.action;
  const githubUsername = payload.pull_request.user.login;
  const repoUrl = payload.repository.html_url;

  if (action === "opened") {
    await markAsPendingContributor(repoUrl, githubUsername);
  }

  if (action === "closed" && payload.pull_request.merged === true) {
    await addContributorByGithubMerge(repoUrl, githubUsername);
    await markTaskCompletedFromWebhook(payload.pull_request.html_url);
  }

  if (action === "closed" && !payload.pull_request.merged) {
    await removePendingContributor(repoUrl, githubUsername);
  }
};
