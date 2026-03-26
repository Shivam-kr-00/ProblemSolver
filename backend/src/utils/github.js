import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

/**
 * Extracts owner and PR number from GitHub PR URL
 * @param {string} prUrl - GitHub PR URL (e.g., https://github.com/owner/repo/pull/123)
 * @returns {Object} - { owner, repo, pullNumber }
 */
export const parsePRUrl = (prUrl) => {
    try {
        const url = new URL(prUrl);
        const parts = url.pathname.split('/').filter(p => p);

        if (parts.length < 4 || parts[2] !== 'pull') {
            throw new Error('Invalid PR URL format');
        }

        return {
            owner: parts[0],
            repo: parts[1],
            pullNumber: parseInt(parts[3], 10)
        };
    } catch (error) {
        throw new Error('Invalid PR URL: ' + error.message);
    }
};

/**
 * Validates that a PR exists in GitHub and is actually merged
 * @param {string} prUrl - GitHub PR URL
 * @returns {Promise<Object>} - { exists: boolean, isMerged: boolean, prData: object }
 */
export const validatePRExists = async (prUrl) => {
    try {
        const { owner, repo, pullNumber } = parsePRUrl(prUrl);

        const response = await octokit.rest.pulls.get({
            owner,
            repo,
            pull_number: pullNumber
        });

        return {
            exists: true,
            isMerged: response.data.merged === true,
            prData: {
                number: response.data.number,
                title: response.data.title,
                merged: response.data.merged,
                mergedAt: response.data.merged_at,
                state: response.data.state,
                author: response.data.user.login
            }
        };
    } catch (error) {
        if (error.status === 404) {
            return {
                exists: false,
                isMerged: false,
                prData: null
            };
        }
        throw new Error('Failed to validate PR: ' + error.message);
    }
};

/**
 * Creates a new GitHub repository under the authenticated user/organization.
 * @param {string} repoName The name of the repository to create.
 * @param {string} description A short description of the repository.
 * @returns {Promise<string>} The HTML URL of the created repository.
 */
export const createGithubRepository = async (repoName, description) => {
    try {
        const response = await octokit.rest.repos.createForAuthenticatedUser({
            name: repoName,
            description: description,
            private: false, // Make it public so contributors can easily fork
            auto_init: true, // Initialize with a README
        });

        return response.data.html_url;
    } catch (error) {
        console.error('Failed to create GitHub repository:', error.message);
        throw new Error('Could not create GitHub repository: ' + error.message);
    }
};
