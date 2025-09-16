// Shared, framework-agnostic utilities/types can live here

export type ID = string | number;

export interface ApiResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
}

export function safeParseJSON<T = unknown>(input: string): ApiResult<T> {
  try {
    return { ok: true, data: JSON.parse(input) as T };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Unknown error" };
  }
}

// Example domain constant
export const APP_NAME = "StaticFruit";