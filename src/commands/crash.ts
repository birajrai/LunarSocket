import { connectedPlayers } from '..';
import ForceCrashPacket from '../packets/ForceCrashPacket';
import Command from './Command';

const command = new Command('crash', "Crash someone from the websocket's game");

command.help = `usage: crash <player>`;

command.setHandler((player, command, args) => {
  if (!args.length) {
    player.sendConsoleMessage('You must specify a player to crash');
    return;
  }

  const target = connectedPlayers.find((p) => p.username === args[0]);
  if (!target) {
    player.sendConsoleMessage(`Player ${args[0]} not found`);
    return;
  }

  const packet = new ForceCrashPacket();
  packet.write({})

  target.writeToClient(packet);

  player.sendConsoleMessage(`Crashed ${target.username}`);
});

export default command;
