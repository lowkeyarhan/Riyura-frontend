export type AppEnv = "development" | "production";

export function getAppEnv(): AppEnv {
  const value = process.env.NEXT_PUBLIC_APP_ENV;

  if (value === "development" || value === "production") {
    return value;
  }

  return process.env.NODE_ENV === "production" ? "production" : "development";
}

export function isDevMode(): boolean {
  return getAppEnv() === "development";
}
