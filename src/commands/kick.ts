import { connectedPlayers } from '..';
import Command from './Command';

const command = new Command('kick', 'Kick someone from the websocket');

command.help = `usage: kick <player>`;

command.setHandler((player, command, args) => {
  if (!args.length) {
    player.sendConsoleMessage('You must specify a player to kick');
    return;
  }

  const target = connectedPlayers.find((p) => p.username === args[0]);
  if (!target) {
    player.sendConsoleMessage(`Player ${args[0]} not found`);
    return;
  }

  target.removePlayer();
  player.sendConsoleMessage(`Kicked ${target.username}`);
});

export default command;
