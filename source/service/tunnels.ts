export const tunnels: {
  [name: string]: {
    ws: WebSocket;
    incomingMessageBuffer: any;
    timestamp: number;
  };
} = {};
