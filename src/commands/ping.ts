import Player from '../player/Player';
import Command from './Command';

const command = new Command('ping', 'Get your latency');

command.setHandler(async (player) => {
  if (!(player instanceof Player)) return;

  player.sendConsoleMessage(
    `Latency: ${Math.round(await player.getLatency())}ms`
  );
});

export default command;
