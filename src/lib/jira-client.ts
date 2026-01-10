import { CloudflareAccessAuth } from "./cf-access-auth";

export type JiraClientConfig = {
  serviceName: string;   // "jira"
  baseUrl: string;       // e.g. https://jira.cfdata.org
  isDev?: boolean;
};

export type JiraEnv = {
  JIRA_CF_ACCESS_TOKEN?: string;                 // dev
  JIRA_CF_ACCESS_CLIENT_ID?: string;             // prod service token
  JIRA_CF_ACCESS_CLIENT_SECRET?: string;         // prod service token
};

export class JiraClient {
  constructor(
    private env: JiraEnv,
    private config: JiraClientConfig,
  ) {}

  private getAuthHeaders(): Record<string, string> {
    // Prod: service tokens
    if (this.env.JIRA_CF_ACCESS_CLIENT_ID && this.env.JIRA_CF_ACCESS_CLIENT_SECRET) {
      return {
        "CF-Access-Client-Id": this.env.JIRA_CF_ACCESS_CLIENT_ID,
        "CF-Access-Client-Secret": this.env.JIRA_CF_ACCESS_CLIENT_SECRET,
      };
    }

    // Dev: cloudflared access token -app <baseUrl>
    if (this.env.JIRA_CF_ACCESS_TOKEN) {
      // Different internal services sometimes expect one or the other.
      // Sending both is harmless and avoids "wrong header" pain.
      return {
        "CF-Access-Jwt-Assertion": this.env.JIRA_CF_ACCESS_TOKEN,
        "CF-Access-Token": this.env.JIRA_CF_ACCESS_TOKEN,
      };
    }

    throw new Error("Missing Jira Cloudflare Access credentials (token or service token).");
  }

  private async getJson<T>(path: string, searchParams?: Record<string, string>): Promise<T> {
    const url = new URL(path, this.config.baseUrl);
    if (searchParams) {
      for (const [k, v] of Object.entries(searchParams)) url.searchParams.set(k, v);
    }

    const res = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
        ...this.getAuthHeaders(),
      },
    });

    CloudflareAccessAuth.checkResponse(res, {
      serviceName: this.config.serviceName,
      baseUrl: this.config.baseUrl,
      isDev: !!this.config.isDev,
    });

    if (!res.ok) {
      throw new Error(`${this.config.serviceName} request failed: ${res.status}`);
    }

    return res.json();
  }

  // Jira endpoints (standard Jira Server/DC/Cloud REST v2)
  async getCurrentUser() {
    return this.getJson("/rest/api/2/myself");
  }

  async searchIssues(jql: string, fields: string[] = ["summary", "status", "assignee"], maxResults = 50) {
    return this.getJson("/rest/api/2/search", {
      jql,
      fields: fields.join(","),
      maxResults: String(maxResults),
    });
  }

  async getMyOpenIssues(maxResults = 50) {
    const jql =
      "assignee = currentUser() AND resolution = Unresolved ORDER BY updated DESC";
    return this.searchIssues(jql, ["summary", "status", "assignee"], maxResults);
  }
}

export function createJiraClient(env: JiraEnv, baseUrl: string, isDev = false) {
  return new JiraClient(env, {
    serviceName: "jira",
    baseUrl,
    isDev,
  });
}
