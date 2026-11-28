export type AccessTokenGetter = () => Promise<string | null> | string | null;

export interface ApiClientConfig {
  /** "" for same-origin web requests; an absolute URL for React Native. */
  baseUrl?: string;
  getAccessToken?: AccessTokenGetter;
  /** Sent as X-Client-Version so the backend can identify old app builds. */
  clientVersion?: string;
}

export interface ApiRequestInit extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Attach the configured bearer token when available. */
  auth?: boolean;
}

export interface ApiClient {
  request(path: string, init?: ApiRequestInit): Promise<Response>;
}

export function createApiClient({
  baseUrl = "",
  getAccessToken,
  clientVersion,
}: ApiClientConfig = {}): ApiClient {
  return {
    async request(path, { body, auth = false, headers, ...init } = {}) {
      const finalHeaders = new Headers(headers);

      if (clientVersion) {
        finalHeaders.set("X-Client-Version", clientVersion);
      }

      if (body !== undefined && !finalHeaders.has("Content-Type")) {
        finalHeaders.set("Content-Type", "application/json");
      }

      if (auth) {
        const token = await getAccessToken?.();
        if (token) finalHeaders.set("Authorization", `Bearer ${token}`);
      }

      return fetch(`${baseUrl}${path}`, {
        ...init,
        headers: finalHeaders,
        body:
          body === undefined
            ? undefined
            : typeof body === "string"
              ? body
              : JSON.stringify(body),
      });
    },
  };
}
