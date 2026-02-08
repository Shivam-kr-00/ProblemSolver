export const handleGithubWebhook = async (req, res, next) => {
    try {
        const payload = req.body;
        const event = req.headers['x-github-event'];

        if (event === 'pull_request' && payload.action === 'opened') {
            const githubUsername = payload.pull_request.user.login;
            const repoUrl = payload.repository.html_url;

            await markAsPendingContributor(repoUrl, githubUsername);
            
            logger.info(`Instant Update: ${githubUsername} is now a pending contributor for ${repoUrl}`);
        }

        // 2. Logic for "Final Reward": When the PR is merged by the Admin
        if (
            event === 'pull_request' && 
            payload.action === 'closed' && 
            payload.pull_request.merged === true
        ) {
            const githubUsername = payload.pull_request.user.login;
            const repoUrl = payload.repository.html_url;

            // This service should move the user from 'pendingContributors' to 'contributors'
            await addContributorByGithubMerge(repoUrl, githubUsername);
            
            logger.info(`Final Merge: ${githubUsername} officially added to repo ${repoUrl}`);
        }

        // 3. Logic for "Cleanup": If the PR is closed WITHOUT merging (Admin rejected it)
        if (event === 'pull_request' && payload.action === 'closed' && !payload.pull_request.merged) {
             const githubUsername = payload.pull_request.user.login;
             const repoUrl = payload.repository.html_url;
             
             await removePendingContributor(repoUrl, githubUsername);
             logger.info(`Cleanup: PR rejected, removed ${githubUsername} from pending list`);
        }

        // GitHub expects a 200 OK within a few seconds
        res.status(200).json({ received: true });
    } catch (err) {
        next(err);
    }
};