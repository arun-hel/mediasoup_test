import { RtpCodecCapability } from "mediasoup/node/lib/RtpParameters";
import { TransportListenIp } from "mediasoup/node/lib/Transport";
import { WorkerLogTag } from "mediasoup/node/lib/Worker";
import os from "os";

// mediasoup configuration.
export const config = {
  listenIp: "0.0.0.0",
  listenPort: 3016,

  mediasoup: {
    numWorkers: Object.keys(os.cpus()).length,
    worker: {
      rtcMinPort: 10000,
      rtcMaxPort: 10100,
      logLevel: "warn",
      logTags: ["info", "ice", "dtls", "rtp", "srtp", "rtcp"] as WorkerLogTag[],
    },
    router: {
      mediaCodecs: [
        {
          kind: "audio",
          mimeType: "audio/opus",
          clockRate: 48000,
          channels: 2,
        },
        {
          kind: "video",
          mimeType: "video/VP8",
          clockRate: 90000,
          parameters: {
            "x-google-start-bitrate": 1000,
          },
        },
      ] as RtpCodecCapability[],
    },
    webRtcTransport: {
      listenIps: [
        {
          ip: "0.0.0.0",
          announcedIp: "127.0.0.1",
        },
      ] as TransportListenIp[],
    },
  },
} as const;
