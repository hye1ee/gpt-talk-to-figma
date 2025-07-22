import OpenAI from "openai";
import { ClientMessage, MessageSender, MessageType, ToolMessage } from "../../types";
import { v4 as uuidv4 } from 'uuid';


export const responseToMessage = (response: OpenAI.Responses.ResponseOutputItem, channel: string) => {
  if (response.type === "function_call") {
    return responseToToolMessage(response);
  }
  else if (response.type === "message") {
    return responseToClientMessage(response, channel);
  }
  else {
    throw new Error(`Unknown response type: ${response.type}`);
  }
};

const responseToClientMessage = (response: OpenAI.Responses.ResponseOutputMessage, channel: string): ClientMessage => {
  return {
    id: response.id,
    event: "text",
    channel,
    type: MessageType.CLIENT,
    sender: MessageSender.AGENT,
    message: response.content[0].type === "output_text" ? response.content[0].text : response.content[0].refusal,
  };
};

const responseToToolMessage = (response: OpenAI.Responses.ResponseFunctionToolCall): ToolMessage => {
  return {
    id: uuidv4(),
    type: MessageType.TOOL,
    sender: MessageSender.AGENT,
    command: response.name,
    params: response.arguments,
    message: response.arguments,
  };
};