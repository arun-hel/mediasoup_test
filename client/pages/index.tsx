import { useState, useEffect } from "react";
import { Device } from "mediasoup-client";
import * as Ws from "ws";

export default function Home() {
  const [ws, setWs] = useState<Ws>();

  const [mediaState, setMediaState] = useState({
    cam: false,
    screen: false,
    mic: false,
  });

  let device: Device;
  function isValidJSOnString(str: string) {
    try {
      JSON.parse(str);
    } catch (e) {
      console.error("Invalid json", e);
      return false;
    }
    return true;
  }

  async function onRouterRtpCapabilities(routerRtpCapabilities: any) {
    device = new Device();
    await device.load({ routerRtpCapabilities });
  }

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => {
      const msg = {
        type: "getRouterRtpCapabilities",
      };
      const resp = JSON.stringify(msg);
      ws.send(resp);
      setWs(ws as unknown as Ws);
    };

    ws.onmessage = (e) => {
      console.log("ws message", e);
    };
    ws.onclose = () => {
      console.log("ws close");
    };
    ws.onerror = (e) => {
      console.log("ws error", e);
    };
  }, []);

  useEffect(() => {
    if (ws) {
      ws.onmessage = (e: any) => {
        const isValidJson = isValidJSOnString(e.data);
        if (!isValidJson) {
          console.error("Invalid msg", e);
          return;
        }

        const msg = JSON.parse(e.data);
        switch (msg.type) {
          case "routerCapabilities":
            onRouterRtpCapabilities(msg.data);
            break;
          default:
            console.error("Invalid event", e);
            break;
        }
      };
    }
  }, [ws]);
  return (
    <>
      <h1>Cam: {`${mediaState.cam}`}</h1>
      <h1>ScreenShare: {`${mediaState.screen}`}</h1>
      <h1>Mic: {`${mediaState.mic}`}</h1>
    </>
  );
}
