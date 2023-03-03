import checkUUID from '../utils/checkUUID';
import getConfig, { editConfig } from '../utils/config';
import Command from './Command';

const command = new Command(
  'unblacklist',
  'Unblacklists a UUID from connecting to the socket'
);

command.help = `usage: unblacklist <uuid>`;

command.setHandler(async (player, command, args) => {
  const playerUuid = args[0];

  if (!playerUuid)
    return player.sendConsoleMessage('§cYou must specify a player!');

  if (!checkUUID(playerUuid))
    return player.sendConsoleMessage('§cThe UUID you provided isnt valid.');

  const config = await getConfig();
  await editConfig({
    ...config,
    blacklist: {
      list: config.blacklist.list.filter((uuid) => uuid !== playerUuid),
    },
  });
});

export default command;
