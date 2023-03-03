import DoEmotePacket from '../../../packets/DoEmotePacket';
import Player from '../../Player';

export default function (player: Player, packet: DoEmotePacket): void {
  if (
    player.emotes.owned.owned.includes(packet.data.id) ||
    packet.data.id === -1 // -1 is when you cancel/finish the emote
  ) {
    // Player really owns this emote, playing on the real server
    player.writeToServer(packet);
  } else {
    // Player is using a fake emote, playing on the fake server
    player.playEmote(packet.data.id);
  }
}
