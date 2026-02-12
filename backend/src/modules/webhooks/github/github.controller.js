import { githubWebhookService } from "./github.service.js";

export const handleGithubWebhook = async (req, res, next) => {
  try {
    const payload = req.body;
    const event = req.headers["x-github-event"];

    await githubWebhookService(event, payload);

    res.status(200).json({ received: true });
  } catch (error) {
    next(error);
  }
};
