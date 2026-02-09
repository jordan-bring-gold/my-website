/**
 * Fetches an image stored as base64 data in a GitHub issue body.
 *
 * @param issueUrl - The GitHub issue URL (e.g., "https://github.com/owner/repo/issues/123")
 * @returns A data URL string that can be used directly in img src attributes
 * @throws Error if the URL is invalid, fetch fails, or no base64 data is found
 */
export async function fetchGitHubIssueImage(issueUrl: string): Promise<string> {
  // Parse the GitHub issue URL to extract owner, repo, and issue number
  const match = issueUrl.match(
    /github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)/,
  );

  if (!match) {
    throw new Error(`Invalid GitHub issue URL: ${issueUrl}`);
  }

  const [, owner, repo, issueNumber] = match;

  // Convert to GitHub API URL
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        // Optionally add auth token for higher rate limits
        // 'Authorization': `token ${process.env.GITHUB_TOKEN}`
      },
      // Cache for production builds
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(
        `GitHub API request failed: ${response.status} ${response.statusText}`,
      );
    }

    const issue = await response.json();
    const body = issue.body || "";

    // Extract base64 data from code block (primary format)
    // Format: ```data:image/jpeg;base64,/9j/4AAQSkZJRg...```
    const codeBlockMatch = body.match(/```\s*(data:image\/[^`]+)\s*```/);
    if (codeBlockMatch?.[1]) {
      return codeBlockMatch[1].trim();
    }

    // Fallback: find any data URL in the body
    const dataUrlMatch = body.match(/(data:image\/[^\s\)]+)/);
    if (dataUrlMatch?.[1]) {
      return dataUrlMatch[1];
    }

    throw new Error(`No base64 image data found in issue ${issueNumber}`);
  } catch (error) {
    console.error(
      `Failed to fetch image from GitHub issue ${issueUrl}:`,
      error,
    );
    throw error;
  }
}

/**
 * Resolves an image URL, fetching from GitHub issue if needed.
 * Falls back to the original URL if it's not a GitHub issue URL.
 *
 * @param imageUrl - Can be a GitHub issue URL, regular image URL, or undefined
 * @param fallbackUrl - Optional fallback URL if imageUrl is undefined
 * @returns A promise that resolves to the image URL (data URL for GitHub issues)
 */
export async function resolveImageUrl(
  imageUrl: string | undefined,
  fallbackUrl?: string,
): Promise<string> {
  if (!imageUrl) {
    return fallbackUrl || "";
  }

  // If it's a GitHub issue URL, fetch the image data
  if (imageUrl.includes("github.com") && imageUrl.includes("/issues/")) {
    try {
      return await fetchGitHubIssueImage(imageUrl);
    } catch (error) {
      console.error(
        "Failed to load GitHub issue image, using fallback:",
        error,
      );
      return fallbackUrl || imageUrl;
    }
  }

  // Otherwise, return the URL as-is
  return imageUrl;
}

/**
 * Checks if a URL is a GitHub issue URL
 */
export function isGitHubIssueUrl(url: string | undefined): boolean {
  if (!url) return false;
  return url.includes("github.com") && url.includes("/issues/");
}
