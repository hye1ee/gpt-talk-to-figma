/**
 * Message types
 */

export const MESSAGE_TYPES = [
  "message",
  "broadcast",
  "system",
  "voicechat-start",
  "voicechat-end",
  "voicechat-interim",
  "voicechat-final",
] as const;

export type MessageType = typeof MESSAGE_TYPES[number];

// type guard 
export function isMessageType(value: any): value is MessageType {
  return MESSAGE_TYPES.includes(value);
}