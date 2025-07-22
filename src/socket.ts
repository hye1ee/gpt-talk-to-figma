import http from "http";
import WebSocket, { WebSocketServer } from "ws";
import type { IncomingMessage } from "http";
import dotenv from "dotenv";
import { Message, MessageSender, MessageType, SystemMessage, SystemMessageEvent } from "./types";

dotenv.config();

class SocketSystem {
  private static instance: SocketSystem;
  private channels: Map<string, Set<WebSocket>> = new Map();
  private server: http.Server;
  private wss: WebSocketServer;
  private port: number;

  private constructor(port: number) {
    this.port = port;
    this.server = http.createServer(this.handleHttpRequest.bind(this));
    this.wss = new WebSocketServer({ server: this.server });
    this.setupWebSocketHandlers();
    this.server.listen(this.port, () => {
      console.log(`WebSocket server running on port ${this.port}`);
    });
  }

  public static init(port?: number) {
    if (!SocketSystem.instance) {
      const resolvedPort = port ?? (process.env.SOCKET_PORT ? Number(process.env.SOCKET_PORT) : 3055);
      SocketSystem.instance = new SocketSystem(resolvedPort);
    }
    return SocketSystem.instance;
  }

  private handleHttpRequest(req: http.IncomingMessage, res: http.ServerResponse) {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      });
      res.end();
      return;
    }
    res.writeHead(200, { "Access-Control-Allow-Origin": "*" });
    res.end("WebSocket server running");
  }

  private sendMessage(ws: WebSocket, message: Message) {
    ws.send(JSON.stringify(message));
  }

  private sendSystemMessage(ws: WebSocket, event: SystemMessageEvent, message: string = "") {
    const systemMessage: SystemMessage = {
      id: "system-message",
      event,
      message,
      type: MessageType.SYSTEM,
      sender: MessageSender.SYSTEM,
    };

    ws.send(JSON.stringify(systemMessage));
  }

  private setupWebSocketHandlers() {
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
      console.log("New client connected");
      this.sendSystemMessage(ws, "info", "Please join a channel to start chatting");

      ws.on("close", () => {
        console.log("Client disconnected");
        // Remove client from their channel
        this.channels.forEach((clients, channelName) => {
          if (clients.has(ws)) {
            clients.delete(ws);
            // Notify other clients in same channel
            clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                this.sendSystemMessage(client, "leave", "A user has left the channel");
              }
            });
          }
        });
      });

      ws.on("message", (message: WebSocket.RawData) => {
        this.handleMessage(ws, message);
      });
    });
  }

  private handleMessage(ws: WebSocket, message: WebSocket.RawData) {
    try {
      console.log("Received message from client:", message.toString());
      const data = JSON.parse(message.toString());

      // (1) channel joining requests
      if (data.type === MessageType.SYSTEM && data.event === "join") {
        const channelName = data.message;
        if (!channelName || typeof channelName !== "string") {
          this.sendSystemMessage(ws, "error", "Channel name is required");
          return;
        }
        // Create channel if it doesn't exist
        if (!this.channels.has(channelName)) {
          this.channels.set(channelName, new Set());
        }
        // Add client to channel
        const channelClients = this.channels.get(channelName)!;
        channelClients.add(ws);
        // Notify client they joined successfully
        this.sendSystemMessage(ws, "join", channelName);
        // Notify other clients in channel
        channelClients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            this.sendSystemMessage(client, "info", "A new user has joined the channel");
          }
        });
        return;
      }
      // (2) Handle regular messages
      if (data.type === MessageType.CLIENT) {
        const channelName = data.channel;
        if (!channelName || typeof channelName !== "string") {
          this.sendSystemMessage(ws, "error", "Channel name is required");
          return;
        }
        const channelClients = this.channels.get(channelName);
        if (!channelClients || !channelClients.has(ws)) {
          this.sendSystemMessage(ws, "error", "You must join the channel first");
          return;
        }
        // Broadcast to all clients in the channel
        channelClients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            console.log("Broadcasting message to client:", data.message);
            this.sendMessage(client, data);
          }
        });
      }
    } catch (err) {
      console.error("Error handling message:", err);
    }
  }
}

// Start the singleton server
SocketSystem.init();
