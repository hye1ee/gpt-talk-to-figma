/**
 * Message types
 */

export enum MessageType {
  CLIENT = "client", // message between clients
  SYSTEM = "system", // message between client and socket system
  TOOL = "tool", // message for tool calling
}

export enum MessageSender {
  USER = "User", // figma plugin
  AGENT = "Agent", // gpt server
  SYSTEM = "System", // socket system
}

export interface Message {
  id: string;
  type: MessageType;
  sender: MessageSender;
  message: any;
}

export type ClientMessageEvent = "text" | "voicechat-start" | "voicechat-end" | "voicechat-interim" | "voicechat-final";

export interface ClientMessage extends Message {
  type: MessageType.CLIENT;
  event: ClientMessageEvent;
  channel: string;
}

export type SystemMessageEvent = "join" | "leave" | "error" | "info";

export interface SystemMessage extends Message {
  type: MessageType.SYSTEM;
  event: SystemMessageEvent;
}

export interface ToolMessage extends Message {
  type: MessageType.TOOL;
  command: string;
  params: any;
}
