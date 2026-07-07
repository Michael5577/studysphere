export type { AssistantHistoryMessage } from "@/lib/ai/providers/types";
export type { AssistantReplyResult as GenerateAssistantReplyResult } from "@/lib/ai/providers/types";

export {
  generateAssistantReply,
  streamAssistantReply,
  isAssistantLive,
  getPrimaryProviderLabel,
} from "@/lib/ai/providers/router";

export { getAIErrorMessage as getOpenAIErrorMessage } from "@/lib/ai/assistant-config";

// Backward-compatible alias used by older imports
export { streamAssistantReply as streamOpenAIResponses } from "@/lib/ai/providers/router";
