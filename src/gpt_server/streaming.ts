// streaming-stt.ts
import recorder from 'node-record-lpcm16';
import { SpeechClient, protos } from '@google-cloud/speech';
import { WebSocket } from 'ws';
import { Writable } from 'stream';

// https://cloud.google.com/speech-to-text/docs/transcribe-streaming-audio
const client = new SpeechClient();

const request = {
  config: {
    encoding: protos.google.cloud.speech.v1.RecognitionConfig.AudioEncoding.LINEAR16,
    sampleRateHertz: 16000,
    languageCode: 'en-US',
  },
  interimResults: true, // Receive interim results
} as any;

let recognizeStream: Writable | undefined;
let mic: any;
let isEnding = false;

// Start streaming audio from mic to Google STT
export function startStreaming(socket: WebSocket, channel: string): void {
  console.log("🎙️ Start recording and STT");
  isEnding = false;

  // Connect to Google STT streaming
  recognizeStream = client
    .streamingRecognize(request)
    .on('data', (data: any) => {
      const transcript = data.results[0]?.alternatives[0]?.transcript;
      if (transcript) {
        console.log('📝 Recognized:', transcript);
        if (data.results[0].isFinal) {
          socket.send(JSON.stringify({ type: 'voicechat-final', message: transcript, channel }));
        } else {
          socket.send(JSON.stringify({ type: 'voicechat-interim', message: transcript, channel }));
        }
      }
      // If we are ending, end the stream after the last data event
      if (isEnding && recognizeStream) {
        recognizeStream.end();
        recognizeStream = undefined;
        isEnding = false;
      }
    })
    .on('error', (err: Error) => {
      console.error("STT Error:", err);
    });

  // Start recording from microphone and pipe to STT stream
  mic = recorder
    .record({
      sampleRateHertz: 16000,
      channels: 1,
      threshold: 0,
      verbose: false,
      recordProgram: 'sox', // or "rec", "arecord" depending on OS
      silence: '5.0',
    })
  mic.stream().on('error', console.error).pipe(recognizeStream);
}

// Stop streaming audio and STT
export function stopStreaming(): void {
  if (recognizeStream) {
    isEnding = true;
  }
  if (mic) {
    mic.stop();
    mic = undefined;
  }
  // recognizeStream will be ended after the last data event
}

// Handle socket events
// io.on("connection", (socket: Socket) => {
//   console.log("🔌 Client connected");

//   socket.on("start-recording", () => {
//     startStreaming(socket);
//   });

//   socket.on("stop-recording", () => {
//     stopStreaming();
//   });
// });
