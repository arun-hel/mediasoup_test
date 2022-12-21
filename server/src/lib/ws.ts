import { types } from "mediasoup";
import WebSocket from "ws";
import createWorker from "./worker";

let mediasoupWorker: types.Router;
const WebSocketConnection = async (webSocket: WebSocket.Server) => {
  try {
    mediasoupWorker = await createWorker();
  } catch (error) {
    throw new Error(`Error on creating mediasoup worker: ${error}`);
  }

  webSocket.on("connection", (ws: WebSocket) => {
    ws.on("message", (message: any) => {
      // BUG: Due to Ws bug we  "message" is not a string, it is a Buffer
      const validJson = isValidJSOnString(message.toString());

      if (!validJson) {
        console.error("Invalid JSON");
        return;
      }

      const event = JSON.parse(message);

      switch (event.type) {
        case "getRouterRtpCapabilities":
          getRouterRtpCapabilities(event.type, ws);
          break;

        default:
          console.error("Unknown event type");
      }
    });
  });
};

function getRouterRtpCapabilities(event: string, ws: WebSocket) {
  send(ws, "routerCapabilities", mediasoupWorker.rtpCapabilities);
}

function send(ws: WebSocket, type: string, msg: any) {
  const message = {
    type,
    data: msg,
  };
  ws.send(JSON.stringify(message));
}

function isValidJSOnString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export default WebSocketConnection;
