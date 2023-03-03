import FriendListPacket from '../../../packets/FriendListPacket';
import Player from '../../Player';

export default function (player: Player, packet: FriendListPacket): void {
  const newPacket = new FriendListPacket();
  newPacket.write({
    ...packet.data,
    consoleAccess: player.operator || player.role.data.console,
  });
  player.writeToClient(newPacket);

  player.lastFriendList = newPacket;
}
