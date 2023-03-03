import { Server as WebSocketServer } from 'ws';
import createServer, { connections, emitToDashboard } from './api';
import { getStats } from './api/routes/stats';
import Packet from './packets/Packet';
import Player, { Handshake } from './player/Player';
import getConfig, { initConfig } from './utils/config';
import { registerEvent } from './utils/events';
import logger from './utils/logger';
import { getCosmeticsIndex } from './utils/lunar';
import ServerString from './utils/ServerString';
import startStats from './utils/stats';

console.log(`  _                               _____            _        _   
 | |                             / ____|          | |      | |  
 | |    _   _ _ __   __ _ _ __  | (___   ___   ___| | _____| |_ 
 | |   | | | | '_ \\ / _\` | '__|  \\___ \\ / _ \\ / __| |/ / _ \\ __|
 | |___| |_| | | | | (_| | |     ____) | (_) | (__|   <  __/ |_ 
 |______\\__,_|_| |_|\\__,_|_|    |_____/ \\___/ \\___|_|\\_\\___|\\__|\n`);

let config = initConfig();
export const httpServer = createServer();
export const isProduction = process.env.LUNARSOCKET_DEBUG !== 'true';

const server = new WebSocketServer({
  server: httpServer,
  path: config.server.websocketPath,
});

server.on('error', (error) => logger.error(error));

server.on('listening', () => {
  logger.log(`Server listening on port ${config.server.port}`);
  registerEvent('start', Date.now().toString());
});

server.on('connection', async (socket, request) => {
  if (request.url.includes('dashboard=true')) {
    const query = new URLSearchParams(request.url.split('?')[1]);
    if (query.get('apiKey') === (await getConfig()).api.authorization) {
      socket.on('close', () => connections.splice(connections.indexOf(socket)));
      connections.push(socket);
      return emitToDashboard(
        'info',
        {
          stats: await getStats(),
          players: connectedPlayers.map((p) => ({
            uuid: p.uuid,
            username: p.username,
            role: p.role.name,
            server: p.server,
            version: p.version,
          })),
        },
        socket
      );
    } else if ((await getConfig()).api.enabled) return socket.close(4004);
    else return socket.close(4001);
  }
  const getHeader = (name: string) => request.headers[name.toLowerCase()];

  const handshake = {} as Handshake;

  for (const header of [
    'accountType',
    'arch',
    'Authorization',
    'branch',
    'clothCloak',
    'gitCommit',
    'hatHeightOffset',
    'hwid',
    'launcherVersion',
    'lunarPlusColor',
    'os',
    'playerId',
    'protocolVersion',
    'server',
    'showHatsOverHelmet',
    'showHatsOverSkinLayer',
    'username',
    'version',
    'flipShoulderPet',
    'ichorModules',
    'showOverBoots',
    'showOverChestplate',
    'showOverLeggings',
  ]) {
    handshake[header] = getHeader(header) ?? '';
  }

  handshake.Host = 'assetserver.lunarclientprod.com';

  // Ignoring players with older/newer protocol versions
  if (handshake.protocolVersion !== '8')
    return socket.close(1002, 'Incompatible protocol version, requires 8');

  config = await getConfig();

  if (config.whitelist.enabled)
    if (!config.whitelist.list.includes(handshake.playerId))
      return socket.close(3000, 'You are not whitelisted');
  if (config.blacklist.list.includes(handshake.playerId))
    return socket.close(3000, 'You have been blacklisted.');

  // Closing the connection if the player is already connected
  if (connectedPlayers.find((p) => p.uuid === handshake.playerId))
    return socket.close(3001, 'Already connected');

  const player = new Player(socket, handshake, await getCosmeticsIndex());

  emitToDashboard('playerAdd', {
    uuid: player.uuid,
    username: player.username,
    role: player.role.name,
    server: player.server,
    version: player.version,
  });
  return connectedPlayers.push(player);
});

export function broadcast(
  data: Buffer | Packet,
  broadcastServer?: string,
  broadcastPlayer?: Player
): void {
  const playerServer = new ServerString(broadcastServer);

  connectedPlayers.forEach((p) => {
    if (broadcastPlayer && p.uuid === broadcastPlayer.uuid) return;
    if (broadcastServer) {
      if (ServerString.match(playerServer, p.server)) p.writeToClient(data);
    } else p.writeToClient(data);
  });
}

export function removePlayer(uuid: string): void {
  connectedPlayers.splice(
    connectedPlayers.findIndex((p) => p.uuid === uuid),
    1
  );
  emitToDashboard('playerRemove', uuid);
}

export const connectedPlayers: Player[] = [];

startStats();

process.on('uncaughtException', (error) => logger.error(error));
