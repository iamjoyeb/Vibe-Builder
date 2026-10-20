export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  kind: "message";
  id: string;
  role: ChatRole;
  content: string;
  /** ISO 8601 string so it stays serializable when IndexedDB persistence lands. */
  createdAt: string;
}

/**
 * A system notice shown in the conversation (e.g. "AI integration is not
 * configured yet"). Kept separate from ChatMessage so real assistant replies
 * can never be confused for placeholders.
 */
export interface ChatNotice {
  kind: "notice";
  id: string;
  content: string;
  createdAt: string;
}

export type ChatItem = ChatMessage | ChatNotice;

export interface SuggestedPrompt {
  id: string;
  title: string;
  detail: string;
  prompt: string;
}
