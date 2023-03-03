import Player from '../player/Player';
import Command from './Command';

const command = new Command('kickme', 'Kick yourself from the websocket');

command.setHandler((player) => {
  if (!(player instanceof Player)) {
    player.sendConsoleMessage('You must be a player to execute this command');
    return;
  }
  player.removePlayer();
});

export default command;
