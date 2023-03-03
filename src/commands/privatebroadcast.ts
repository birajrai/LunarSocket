import { connectedPlayers } from '..';
import logger from '../utils/logger';
import Command from './Command';

const command = new Command(
  'privatebroadcast',
  'Broadcast a message to a player, will be displayed as a pop up notification'
);

command.help = `usage: privatebroadcast <player> <message>`;

command.setHandler((player, c, args) => {
  let title = '';
  let message = args.slice(1).join(' ');
  const target = args[0];

  if (message.includes('||')) {
    const split = message.split('||');
    title = split[0];
    message = split[1];
  }

  for (const p of connectedPlayers) {
    if (p.username === target) {
      // skipcq
      p.sendNotification(
        title,
        message.replace(/&([0123456789AaBbCcDdEeFfKkLlMmNnOoRr])/g, '§$1')
      );
    }
  }

  logger.log(`${player.username} private broadcasted: ${message}`);
});

export default command;
