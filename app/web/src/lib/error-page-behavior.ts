import { isDevMode } from "@/src/lib/app-env";

export function shouldRedirectErrorPage(): boolean {
  return !isDevMode();
}

