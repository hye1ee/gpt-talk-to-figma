import WebSocket from "ws";
import { startStreaming, stopStreaming } from './streaming';
import Agent from './agent';
import { ClientMessage, ClientMessageEvent, MessageSender, MessageType } from "../types";
import { v4 as uuidv4 } from 'uuid';
import { responseToMessage } from "./utils/utils";

// Logging utility
const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  debug: (msg: string) => console.debug(`[DEBUG] ${msg}`),
};

export class SocketClientAgent {
  private static instance: SocketClientAgent;
  private ws: WebSocket | null = null;
  private currentChannel: string | null = null;
  private channelArg: string = "llm";
  private socketServerUrl: string;

  private constructor(socketServerUrl: string) {
    this.socketServerUrl = socketServerUrl;
    // Parse --channel argument from process.argv
    process.argv.forEach((arg) => {
      if (arg.startsWith("--channel=")) {
        this.channelArg = arg.split("=")[1] || "llm";
      }
    });
    this.connectToSocketServer();
  }

  public static init(socketServerUrl: string) {
    if (!SocketClientAgent.instance) {
      SocketClientAgent.instance = new SocketClientAgent(socketServerUrl);
    }
    return SocketClientAgent.instance;
  }

  private connectToSocketServer() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      logger.info("Already connected to socket server");
      return;
    }
    this.ws = new WebSocket(this.socketServerUrl);

    this.ws.on("open", () => {
      logger.info("Connected to socket server");
      this.joinChannel(this.channelArg);
    });

    this.ws.on("message", async (data) => {
      await this.handleMessage(data);
    });

    this.ws.on("close", () => {
      logger.info("Disconnected from socket server");
      this.ws = null;
      setTimeout(() => this.connectToSocketServer(), 2000);
    });

    this.ws.on("error", (err) => {
      logger.error(`WebSocket error: ${err}`);
    });
  }

  private async handleMessage(data: WebSocket.Data) {
    if (!this.ws) return;
    const msg = JSON.parse(data.toString()) as ClientMessage;
    logger.info(`Received message: ${JSON.stringify(msg)}`);

    switch (msg.type) {
      case MessageType.CLIENT:
        switch (msg.event) {
          case "text":
            if (msg.message && msg.sender === MessageSender.USER) {
              // Send to GPT and return answer

              try {
                (await Agent.getInstance().getResponsesWithTools(msg.message)).forEach((response) => {
                  if (this.ws && this.currentChannel)
                    this.ws.send(JSON.stringify(responseToMessage(response, this.currentChannel)));
                });

              } catch (gptErr) {
                logger.error(`Error from OpenAI API: ${gptErr}`);
              }

            }
            break;
          case "voicechat-start":
            logger.info("Start STT streaming");
            startStreaming(this.sendMessage, msg.channel);
            break;
          case "voicechat-end":
            logger.info("Stop STT streaming");
            stopStreaming();
            break;
          default:
            logger.info(`Unhandled message event: ${msg.event}`);
            break;
        }
        break;
      // Add more cases as needed for other message types
      default:
        logger.info(`Unhandled message type: ${msg.type}`);
        break;
    }

  }

  private sendMessage(event: ClientMessageEvent, message: string) {
    if (!this.ws) return;
    this.ws.send(JSON.stringify({
      id: uuidv4(),
      type: MessageType.CLIENT,
      event,
      channel: this.currentChannel,
      sender: MessageSender.AGENT,
      message,
    }));
  }

  private joinChannel(channel: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      logger.error("WebSocket not open. Cannot join channel.");
      return;
    }
    this.ws.send(
      JSON.stringify({
        id: uuidv4(),
        type: MessageType.SYSTEM,
        sender: MessageSender.AGENT,
        message: channel,
        event: "join",
      })
    );
    this.currentChannel = channel;
    logger.info(`Joined channel: ${channel}`);
  }
}
