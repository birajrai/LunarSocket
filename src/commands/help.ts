import Command from './Command';
import CommandHandler from './CommandHandler';

const command = new Command('help', 'Get this help message');

command.setHandler((player) => {
  player.sendConsoleMessage(`Available commands:\n${CommandHandler.commands
    .map((c) => `  ${c.command}   ${c.description}`)
    .join('\n')}
  
  Use "command --help" to see command help message`);
});

export default command;
