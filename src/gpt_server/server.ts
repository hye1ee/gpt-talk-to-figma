import WebSocket from "ws";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import { startStreaming, stopStreaming } from './streaming';

dotenv.config();

const SOCKET_PORT = process.env.SOCKET_PORT || "3055";
const SOCKET_SERVER_URL = `ws://localhost:${SOCKET_PORT}`;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Parse --channel argument from process.argv
let channelArg = "llm";
process.argv.forEach((arg) => {
  if (arg.startsWith("--channel=")) {
    channelArg = arg.split("=")[1] || "llm";
  }
});

// Logging utility
const logger = {
  info: (msg: string) => console.log(`[INFO] ${msg}`),
  error: (msg: string) => console.error(`[ERROR] ${msg}`),
  debug: (msg: string) => console.debug(`[DEBUG] ${msg}`),
};

let ws: WebSocket | null = null;
let currentChannel: string | null = null;

function connectToSocketServer() {
  if (ws && ws.readyState === WebSocket.OPEN) {
    logger.info("Already connected to socket server");
    return;
  }
  ws = new WebSocket(SOCKET_SERVER_URL);

  ws.on("open", () => {
    logger.info("Connected to socket server");
    joinChannel(channelArg);
  });

  ws.on("message", async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      logger.info(`Received message: ${JSON.stringify(msg)}`);
      if (msg.type === "message" && msg.message && msg.sender === "User") {
        // Send to GPT and return answer
        let gptAnswer = "[No answer]";
        try {
          const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant." },
              { role: "user", content: msg.message },
            ],
          });
          gptAnswer = completion.choices[0].message.content || "[No answer]";
        } catch (gptErr) {
          logger.error(`Error from OpenAI API: ${gptErr}`);
          gptAnswer = "[Error from GPT API]";
        }
        ws!.send(
          JSON.stringify({
            type: "message",
            channel: msg.channel,
            message: gptAnswer,
          })
        );
      } else if (msg.type === "voicechat-start" && ws) {
        logger.info("Start STT streaming");
        startStreaming(ws, msg.channel);
      } else if (msg.type === "voicechat-end") {
        logger.info("Stop STT streaming");
        stopStreaming();
      }
    } catch (err) {
      logger.error(`Error handling message: ${err}`);
    }
  });

  ws.on("close", () => {
    logger.info("Disconnected from socket server");
    ws = null;
    setTimeout(connectToSocketServer, 2000);
  });

  ws.on("error", (err) => {
    logger.error(`WebSocket error: ${err}`);
  });
}

function joinChannel(channel: string) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    logger.error("WebSocket not open. Cannot join channel.");
    return;
  }
  ws.send(
    JSON.stringify({
      type: "join",
      channel,
    })
  );
  currentChannel = channel;
  logger.info(`Joined channel: ${channel}`);
}

connectToSocketServer(); 