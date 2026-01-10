/**
 * Cloudflare Access authentication utility
 * Shared logic for detecting and handling CF Access authentication failures
 */

export interface CloudflareAccessConfig {
  serviceName: string;
  baseUrl: string;
  isDev?: boolean;
}

export class CloudflareAccessAuth {
  static isLoginRedirect(response: Response): boolean {
    return response.url.includes("cdn-cgi/access/login");
  }

  static handleAuthFailure(config: CloudflareAccessConfig): never {
    const tokenEnvVar = `${config.serviceName.toUpperCase()}_CF_ACCESS_TOKEN`;
    const errorMsg = `Authentication failed: Redirected to Cloudflare Access login. Check your ${tokenEnvVar} is valid.`;

    if (config.isDev) {
      console.error("");
      console.error(`${config.serviceName} authentication failed - token expired or invalid`);
      console.error("");
      console.error("To refresh your token, run:");
      console.error(`  cloudflared access token -app ${config.baseUrl}`);
      console.error("");
    }

    throw new Error(errorMsg);
  }

  static checkResponse(response: Response, config: CloudflareAccessConfig): void {
    if (this.isLoginRedirect(response)) {
      this.handleAuthFailure(config);
    }
  }
}
