import { connectedPlayers } from '..';
import logger from '../utils/logger';
import Command from './Command';

const command = new Command(
  'broadcast',
  'Broadcast a message to everyone, will be displayed as a pop up notification'
);

command.help = `usage: broadcast <message>`;

command.setHandler(async (player, command, args) => {
  let title = '';
  let message = args.join(' ');

  if (message.includes('||')) {
    const split = message.split('||');
    title = split[0];
    message = split[1];
  }

  for (const player of connectedPlayers)
    player.sendNotification(
      title,
      message.replace(/&([0123456789AaBbCcDdEeFfKkLlMmNnOoRr])/g, '§$1')
    );

  logger.log(`${player.username} broadcasted: ${message}`);
});

export default command;
