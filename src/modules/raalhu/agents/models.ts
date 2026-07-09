/**
 * Model selection for the agent team, centralized so a future migration
 * touches one file. Defaults are env-overridable.
 */
export const DEFAULT_MODEL =
  process.env.RAALHU_DEFAULT_MODEL || "claude-sonnet-5";
export const FAST_MODEL = process.env.RAALHU_FAST_MODEL || "claude-haiku-4-5";

export const MAX_AGENT_DEPTH = Number(process.env.RAALHU_MAX_AGENT_DEPTH || 2);
export const MAX_ITERATIONS = 8;
export const MAX_OUTPUT_TOKENS = 8192;

/**
 * `output_config.effort` is only accepted by effort-capable models
 * (Sonnet 4.6+/5, Opus 4.5+, Fable) — sending it to e.g. Haiku 4.5 is a 400.
 */
export function effortFor(model: string): "low" | "medium" | "high" | undefined {
  if (/sonnet-(4-6|5)|opus-4-[5-9]|fable|mythos/.test(model)) {
    return "medium";
  }
  return undefined;
}
