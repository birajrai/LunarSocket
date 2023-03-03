import { connectedPlayers } from '..';
import Command from './Command';

const command = new Command('online', 'See how many players are online');

command.help = `usage: online §o[options]
  options:
    §l-n§r, §l--names    §rShow connected player names
    §l-u§r, §l--uuids    §rShow connected player UUIDs
`;

command.setHandler((player, command, args) => {
  player.sendConsoleMessage(
    `There are §a${connectedPlayers.length}§r players online!`
  );

  if (args.includes('-n') || args.includes('--names')) {
    const names = connectedPlayers.map((p) => p.username);
    player.sendConsoleMessage(names.join(', '));
  }

  if (args.includes('-u') || args.includes('--uuids')) {
    const names = connectedPlayers.map((p) => p.uuid);
    player.sendConsoleMessage(names.join(', '));
  }
});

export default command;
