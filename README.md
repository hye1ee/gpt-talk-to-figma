# GPT-Talk-to-Figma

> **This project is based on [sonnylazuardi/cursor-talk-to-figma-mcp](https://github.com/sonnylazuardi/cursor-talk-to-figma-mcp).**

This project enables **Figma plugins** to communicate with a **local server** that calls the GPT API, using a WebSocket connection. The system currently only supports running all components locally.

<br/>

## 1. Initial Setup 📝

1. **Install Sox**
   - This project uses the [`node-record-lpcm16`](https://www.npmjs.com/package/node-record-lpcm16) library to access the microphone in Node.js. **Sox** is an external command-line tool required by this library to record audio from your microphone.
   ```bash
   brew install sox
   ```

<!-- - **macOS (Homebrew):** -->

<!-- - **Ubuntu/Debian:**
  ```sh
  sudo apt-get install sox
  ```
- **Windows:**
  - Download the installer from [Sox official site](http://sox.sourceforge.net/)
  - Add the installation directory to your system's PATH environment variable -->

2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Get Google Cloud credentials (for Speech-to-Text):**

   - Go to the [Google Cloud Console](https://console.cloud.google.com/), create a project, and enable the Speech-to-Text API.
   - Create a service account (IAM & Admin > Service Accounts), grant it the "Editor" or "Speech-to-Text Admin" role, and download a JSON key.
   - Place the JSON key in your project folder (e.g., `google-key.json`).
   - [Google service account key guide](https://cloud.google.com/docs/authentication/getting-started)

4. **Set up environment variables:**
   - Copy the provided template to create your own .env file:
     ```bash
     cp .env.copy .env
     ```
   - Then, edit `.env` to set your GPT API key, socket connection port (if different from default), and the path to your Google Cloud credential key:
     ```bash
     # Example .env
     OPENAI_API_KEY=your-openai-api-key
     PORT=3055
     GOOGLE_APPLICATION_CREDENTIALS=./google-key.json  # Path to your Google Cloud service account key
     ```

<br/>

## 2. Install the Figma Plugin 🎨

1. Open **Figma**
2. Go to **Plugins > Development > Import plugin from manifest**
3. Import the manifest file located at:
   ```
   src/figma_plugin/manifest.json
   ```

<br/>

## 3. Run the Socket Server 🔌

Start the WebSocket server (handles communication between Figma plugin and GPT server):

```bash
npm run socket
```

**After opening the socket server, please make sure that your Figma plugin connects to this socket server first before opening the GPT server.**

- If you connect correctly, you will get the channel value in the connection tab of the plugin. **Remember this value.**

<br/>

## 4. Run the GPT Server 🤖

Start the GPT server (handles requests to the GPT API) and connect it to the channel you obtained from the previous step:

```bash
npm run server -- --channel=<channel_value_from_plugin>
```

- The GPT server will automatically connect to the socket server and the channel that you specify in the command.
- Replace `<channel_value_from_plugin>` with the channel value you got from the Figma plugin's connection tab.
- If not specified, the default channel is `llm`, but you should use the value shown in the plugin for correct communication.

<br/>

## Notes 💡

- All servers must be running **locally** for the system to work.
- You can change the socket port by editing the `PORT` variable in `src/socket.ts` and updating your `.env` if needed.
- For more details on the protocol or to extend functionality, see the code in `src/socket.ts` and `src/gpt_server/server.ts`.
