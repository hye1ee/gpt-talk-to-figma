import dotenv from 'dotenv';
import Agent from './agent';
import { SocketClientAgent } from './socket';

// 1. set up environment variables
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const SOCKET_PORT = process.env.SOCKET_PORT || '3055';
const SOCKET_SERVER_URL = `ws://localhost:${SOCKET_PORT}`;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY must be set in environment variables');
}

// 2. initialize Agent and SocketClient
Agent.init(OPENAI_API_KEY);
SocketClientAgent.init(SOCKET_SERVER_URL);

console.log('[INFO] Server initialized with centralized environment management.'); 