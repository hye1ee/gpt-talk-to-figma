# GPT-Talk-to-Figma

> **This project is based on [sonnylazuardi/cursor-talk-to-figma-mcp](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp).**

This project enables **Figma plugins** to communicate with a **local server** that calls the GPT API, using a WebSocket connection. The system currently only supports running all components locally.

---

## 1. Initial Setup 📝

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file and set your GPT API key and socket connection port (if different from default):
     ```bash
     # Example .env
     OPENAI_API_KEY=your-gpt-api-key
     SOCKET_PORT=3055
     ```

---

## 2. Install the Figma Plugin 🎨

1. Open **Figma**
2. Go to **Plugins > Development > Import plugin from manifest**
3. Import the manifest file located at:
   ```
   src/figma_plugin/manifest.json
   ```

---

## 3. Run the Socket Server 🔌

Start the WebSocket server (handles communication between Figma plugin and GPT server):

```bash
npm run socket
```

**After opening the socket server, please make sure that your Figma plugin connects to this socket server first before opening the GPT server.**

- If you connect correctly, you will get the channel value in the connection tab of the plugin. **Remember this value.**

---

## 4. Run the GPT Server 🤖

Start the GPT server (handles requests to the GPT API) and connect it to the channel you obtained from the previous step:

```bash
npm run server -- --channel=<channel_value_from_plugin>
```

- The GPT server will automatically connect to the socket server and the channel that you specify in the command.
- Replace `<channel_value_from_plugin>` with the channel value you got from the Figma plugin's connection tab.
- If not specified, the default channel is `llm`, but you should use the value shown in the plugin for correct communication.

---

## Notes 💡

- All servers must be running **locally** for the system to work.
- You can change the socket port by editing the `PORT` variable in `src/socket.ts` and updating your `.env` if needed.
- For more details on the protocol or to extend functionality, see the code in `src/socket.ts` and `src/gpt_server/server.ts`.
