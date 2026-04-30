export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  state?: "streaming" | "done" | "danger";
  resourceSlug?: string;
  callbackConfirmed?: boolean;
  callCta?: boolean;
};

export type StreamEvent =
  | { type: "text"; delta: string }
  | { type: "danger"; reason: string }
  | { type: "resource"; slug: string }
  | { type: "callback"; confirmed: true }
  | { type: "escalate" }
  | { type: "call_cta" }
  | { type: "done" }
  | { type: "error"; message: string };
