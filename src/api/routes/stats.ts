import checkDiskSpace from 'check-disk-space';
import { Router } from 'express';
import { cpu } from 'node-os-utils';
import { freemem, totalmem } from 'node:os';
import { emitToDashboard } from '..';
import { connectedPlayers } from '../..';
import { DatabaseManager } from '../../databases/Manager';
import { events } from '../../utils/events';
import { getLunarLatency, stats as st } from '../../utils/stats';
import auth from '../middleware/auth';

const statsRouter = Router();

let currentCpuUsage = 0;
let diskSpace = [0, 0];
async function updateStats() {
  currentCpuUsage = await cpu.usage(5000);

  const space = await checkDiskSpace(process.cwd());
  diskSpace = [space.size - space.free, space.size];
}
setInterval(updateStats, 10000);

function getProcessStatus() {
  return {
    ramUsage: {
      used: Math.round((totalmem() - freemem()) / 1000000),
      max: Math.round(totalmem() / 1000000),
    },
    cpuUsage: {
      used: currentCpuUsage,
      max: 100,
    },
    diskSpace: {
      used: Math.round(diskSpace[0] / 1000000000),
      max: Math.round(diskSpace[1] / 1000000000),
    },
  };
}

export async function getStats() {
  const averageConnected = Math.round(
    Object.values(st.onlinePlayers).reduce((p, c) => p + c, 0) /
      Object.values(st.onlinePlayers).length
  );

  return {
    uptime: Math.round(process.uptime()),
    onlinePlayers: connectedPlayers.length,
    uniquePlayers: await DatabaseManager.instance.database.getPlayerCount(),
    lunarLatency: (await getLunarLatency()) ?? 0,
    averageConnected: isNaN(averageConnected) ? 0 : averageConnected,
    events: [...events].reverse(),
    onlineGraph: st.onlinePlayers,
    rankRepartition: await DatabaseManager.instance.getRoleDistribution(),
    status: getProcessStatus(),
  };
}

statsRouter.get('/', auth, async (request, response) => {
  const stats = await getStats();

  response.status(200).send(stats);
});

setInterval(() => {
  emitToDashboard('updateStats', getProcessStatus());
}, 15_000);

export default statsRouter;
