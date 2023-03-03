import { Express } from 'express';
import { readFileSync } from 'node:fs';
import * as http from 'node:http';
import * as https from 'node:https';
import { WebSocket } from 'ws';
import { initConfig } from '../utils/config';
import initAPI from './api';

const config = initConfig();

export default function createServer(): http.Server | https.Server {
  let server: http.Server | https.Server;
  let app: Express;

  if (config.api.enabled) app = initAPI();

  if (config.server.secure) {
    server = https.createServer(
      {
        cert: readFileSync(config.server.certificates.cert),
        key: readFileSync(config.server.certificates.key),
      },
      app
    );
  } else server = http.createServer(app);

  server.listen(config.server.port);

  return server;
}

export const connections: WebSocket[] = [];

export type DashboardEventType =
  | 'info'
  | 'event'
  | 'playerAdd'
  | 'playerRemove'
  | 'roleUpdate'
  | 'updateStats'
  | 'updateGraphs'
  | 'updatePlayerServer';

export interface DashboardEvent {
  type: DashboardEventType;
  data: any;
}

export function emitToDashboard(
  type: DashboardEventType,
  data: any,
  socket?: WebSocket
) {
  const msg = {
    type,
    data,
  };
  const packet = JSON.stringify(msg);
  if (socket) socket.send(packet);
  else connections.forEach((socket) => socket.send(packet));
}
