import { connectedPlayers } from '..';
import { emitToDashboard } from '../api';
import { DatabaseManager } from '../databases/Manager';

export const stats = {
  onlinePlayers: {} as { [key: string]: number },
};

function onlineListener(): void {
  const date = new Date();
  const key = `${date.getHours()}:${date.getMinutes()}`;
  stats.onlinePlayers[key] = connectedPlayers.length;
  setInterval(() => {
    const date = new Date();
    const key = `${date.getHours()}:${date.getMinutes()}`;
    stats.onlinePlayers[key] = connectedPlayers.length;
    emitToDashboard('updateGraphs', {
      onlineGraph: {
        action: 'add',
        key,
        value: connectedPlayers.length,
      },
    });

    setTimeout(() => {
      delete stats.onlinePlayers[key];
      emitToDashboard('updateGraphs', {
        onlineGraph: {
          action: 'remove',
          key,
        },
      });
    }, 24 * 60 * 60 * 1000); // After one day
  }, 1 * 60 * 1000); // Every one minute
}

setInterval(async () => {
  emitToDashboard('updateGraphs', {
    rankRepartition: await DatabaseManager.instance.getRoleDistribution(),
  });
}, 5 * 60 * 1000); // Every 5 minutes

export async function getLunarLatency() {
  return await connectedPlayers[0]?.getLatency(true);
}

export default function startStats(): void {
  onlineListener();
}
