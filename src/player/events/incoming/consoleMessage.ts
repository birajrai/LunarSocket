import ConsoleMessagePacket from '../../../packets/ConsoleMessagePacket';
import Player from '../../Player';

export default function (player: Player, packet: ConsoleMessagePacket): void {
  if (!player.operator && !player.role.data.console) return;
  player.commandHandler.handle(packet.data.message);
}
