const UNCONFIGURED_MESSAGE =
  "StudySphere AI is not configured yet. Add OPENROUTER_API_KEY, NVIDIA_API_KEY, and/or OPENAI_API_KEY to your environment (local: .env.local, production: Vercel Environment Variables), then restart or redeploy.";

export function getAssistantUnavailableReply(): string {
  return UNCONFIGURED_MESSAGE;
}
