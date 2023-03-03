import { connectedPlayers } from '..';
import getConfig from '../utils/config';
import Command from './Command';

const command = new Command(
  'rolebroadcast',
  'Broadcasts a message to a single role'
);

command.help = `usage: rolebroadcast <rank> <message>`;

command.setHandler(async (player, c, args): Promise<void> => {
  let message = args.slice(1).join(' ');
  let title = '';
  const role = args[0];
  if (!message)
    return player.sendConsoleMessage('§cYou must specify a message!');
  if (!role) return player.sendConsoleMessage('§cYou must specify a role!');
  const config = await getConfig();
  if (!config.roles[role])
    return player.sendConsoleMessage("§cThis role doesn't exist!");
  if (message.includes('||')) {
    const split = message.split('||');
    title = split[0];
    message = split[1];
  }
  for (const p of connectedPlayers) {
    // skipcq
    if (p.role.name === role)
      p.sendNotification(
        title,
        message.replace(/&([0123456789AaBbCcDdEeFfKkLlMmNnOoRr])/g, '§$1')
      );
  }
  return null;
});
export default command;
