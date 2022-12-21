import express from "express";
import * as http from "http";
import * as WebSocket from "ws";
import WebSocketConnection from "./lib/ws";

const main = async () => {
  const app = express();
  const server = http.createServer(app);

  const webSocket = new WebSocket.Server({ server, path: "/ws" });
  WebSocketConnection(webSocket);

  const port = 8000;

  server.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
};
export default main;
