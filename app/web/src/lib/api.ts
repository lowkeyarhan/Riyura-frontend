import { createApiClient } from "@riyura/api/client";
import { getSupabaseSession } from "./auth/getSession";

export const api = createApiClient({
  getAccessToken: async () =>
    (await getSupabaseSession())?.access_token ?? null,
});
